import {
  Controller, Post, Get, Body, Res, Req, UseGuards, HttpCode, HttpStatus, UnauthorizedException,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ConfigService } from '@nestjs/config';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    
    // Access Token: 15 minutes by default or matching JWT_EXPIRES_IN (e.g., 8h)
    const accessExpiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '8h');
    const accessMaxAge = accessExpiresIn.endsWith('h') ? parseInt(accessExpiresIn) * 60 * 60 * 1000 : 8 * 60 * 60 * 1000;

    // Refresh Token: 7 days by default
    const refreshExpiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    const refreshMaxAge = refreshExpiresIn.endsWith('d') ? parseInt(refreshExpiresIn) * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;

    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      maxAge: accessMaxAge,
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: '/api/v1/auth/refresh', // Solo se envía en esta ruta para mayor seguridad
      maxAge: refreshMaxAge,
    });
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken, user } = await this.authService.login(dto);
    this.setCookies(res, accessToken, refreshToken);
    return { message: 'Sesión iniciada', user };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar el Access Token' })
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }

    // El JWT payload sub es el userId. Necesitamos decodificar el token para sacar el userId o que la app valide el JWT.
    // Como jwtService ya lo valida en el método de estrategia, podemos decodificarlo o pasarlo al service para que lo valide con try/catch.
    // Para simplificar, leemos el userId asumiendo que es válido, pero el AuthService lanzará excepción si no lo es o no matchea.
    
    // Mejor que AuthService lo decodifique (el JWT_REFRESH_SECRET):
    // Pero espera, no estamos usando un RefreshStrategy. Hagamos que el AuthService verifique y retorne tokens.
    // Extraemos el sub del payload
    const jwt = require('jsonwebtoken');
    try {
      const decoded = jwt.verify(refreshToken, this.configService.get('JWT_REFRESH_SECRET', 'dev-refresh-secret'));
      const userId = decoded.sub;
      
      const tokens = await this.authService.refreshTokens(userId, refreshToken);
      this.setCookies(res, tokens.accessToken, tokens.refreshToken);
      return { message: 'Token refrescado' };
    } catch (err) {
      res.clearCookie('jwt');
      res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cerrar sesión' })
  async logout(@CurrentUser('sub') userId: string, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(userId);
    res.clearCookie('jwt');
    res.clearCookie('refresh_token', { path: '/api/v1/auth/refresh' });
    return { message: 'Sesión cerrada' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Datos del usuario actual' })
  getMe(@CurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }

  // --- Google OAuth ---
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Iniciar sesión con Google' })
  async googleAuth(@Req() req) {
    // Inicia el flujo, redirige a Google
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback de Google' })
  async googleAuthRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
    // Passport añade req.user
    const profile = req.user;
    const tokens = await this.authService.validateOAuthLogin(profile.email, profile.name, profile.googleId);
    
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);
    
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
    // Usamos res.redirect en vez de retornar JSON porque viene de una redirección de Google
    res.redirect(frontendUrl + '/dashboard');
  }
}
