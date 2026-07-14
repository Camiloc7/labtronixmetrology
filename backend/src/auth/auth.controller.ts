import {
  Controller, Post, Get, Body, Res, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.authService.login(dto);

    const expiresIn = process.env.JWT_EXPIRES_IN || '8h';
    const maxAge = expiresIn.endsWith('h')
      ? parseInt(expiresIn) * 60 * 60 * 1000
      : 8 * 60 * 60 * 1000;

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge,
    });

    return { message: 'Sesión iniciada', user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cerrar sesión' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Sesión cerrada' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Datos del usuario actual' })
  getMe(@CurrentUser('sub') userId: string) {
    return this.authService.getMe(userId);
  }
}
