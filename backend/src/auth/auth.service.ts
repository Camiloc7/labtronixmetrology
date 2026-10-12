import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  /**
   * Hash del refresh token para almacenamiento.
   * Se usa SHA-256 (del token completo) y no bcrypt: bcrypt trunca la entrada a
   * 72 bytes y los JWT (~350 chars) tienen los bytes que diferencian un token
   * de otro (jti, firma) siempre más allá de ese límite, así que dos tokens
   * distintos del mismo usuario colisionarían bajo bcrypt.compare.
   */
  private hashRefreshToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async getTokens(userId: string, email: string, role: string, name: string) {
    const payload = { sub: userId, email, role, name };
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret && this.configService.get('NODE_ENV') === 'production') {
      throw new Error('JWT_REFRESH_SECRET es obligatorio en producción');
    }
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, {
        secret:
          refreshSecret ||
          'local-development-refresh-secret-not-for-production',
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRES_IN',
          '7d',
        ) as any,
        // jti aleatorio: garantiza que cada refresh token sea único, aunque se
        // emita en el mismo segundo que otro (el iat solo tiene resolución en
        // segundos). Sin esto, dos tokens idénticos romperían la detección de
        // reutilización durante la rotación.
        jwtid: crypto.randomUUID(),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.usersService.updateRefreshToken(
      userId,
      this.hashRefreshToken(refreshToken),
    );
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.isActive || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException(
        'Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intente más tarde.',
      );
    }

    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordValid) {
      const attempts = (user.failedLoginAttempts || 0) + 1;
      let lockedUntil: Date | null = null;

      if (attempts >= 5) {
        // Lock for 15 minutes
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      }

      await this.usersService.updateLoginAttempts(
        user.id,
        attempts,
        lockedUntil,
      );

      if (lockedUntil) {
        throw new UnauthorizedException(
          'Cuenta bloqueada temporalmente por múltiples intentos fallidos. Intente más tarde.',
        );
      }
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Reset attempts on successful login
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await this.usersService.updateLoginAttempts(user.id, 0, null);
    }

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.name,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new UnauthorizedException('Acceso denegado');
    }

    const presentedHash = this.hashRefreshToken(refreshToken);
    const matchesCurrent = user.hashedRefreshToken
      ? presentedHash === user.hashedRefreshToken
      : false;
    const matchesPrevious = user.previousHashedRefreshToken
      ? presentedHash === user.previousHashedRefreshToken
      : false;

    // Token actual válido: rotación normal.
    if (matchesCurrent) {
      const tokens = await this.getTokens(
        user.id,
        user.email,
        user.role,
        user.name,
      );
      const newRefreshHash = this.hashRefreshToken(tokens.refreshToken);
      await this.usersService.rotateRefreshToken(
        user.id,
        user.hashedRefreshToken,
        newRefreshHash,
      );
      return tokens;
    }

    // Reutilización de un refresh token ya rotado: posible token robado.
    // Por seguridad se revoca toda la familia de tokens.
    if (matchesPrevious) {
      await this.usersService.revokeRefreshTokens(user.id);
      throw new UnauthorizedException(
        'Sesión revocada por reutilización del token de refresco',
      );
    }

    throw new UnauthorizedException('Acceso denegado');
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

    const tokens = await this.getTokens(
      user.id,
      user.email,
      user.role,
      user.name,
    );
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async getMe(userId: string) {
    const user = await this.usersService.findOne(userId);
    const {
      passwordHash: _,
      hashedRefreshToken: __,
      previousHashedRefreshToken: ___,
      ...result
    } = user;
    return result;
  }
}
