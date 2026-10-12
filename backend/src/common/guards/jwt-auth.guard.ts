import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.['jwt'];

    if (!token) {
      throw new UnauthorizedException('No hay sesión activa');
    }

    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') ||
        'local-development-secret-not-for-production';
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request['user'] = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }
  }
}