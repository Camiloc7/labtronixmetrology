import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async getTokens(userId: string, email: string, role: string, name: string) {
    const payload = { sub: userId, email, role, name };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'dev-refresh-secret'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(userId, hashedToken);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.isActive || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role, user.name);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return { ...tokens, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Acceso denegado');
    }

    const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Acceso denegado');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role, user.name);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async validateOAuthLogin(email: string, name: string, googleId: string) {
    let user = await this.usersService.findByEmail(email);

    if (!user) {
      // Create new user automatically if not found
      user = await this.usersService.createGoogleUser(email, name, googleId);
    } else if (!user.googleId) {
      // Link Google ID if user exists without one
      await this.usersService.update(user.id, { googleId } as any);
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario inactivo');
    }

    const tokens = await this.getTokens(user.id, user.email, user.role, user.name);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async getMe(userId: string) {
    const user = await this.usersService.findOne(userId);
    const { passwordHash: _, hashedRefreshToken: __, ...result } = user;
    return result;
  }
}
