import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies?.['jwt'];

    if (!token) {
      throw new UnauthorizedException('No hay sesión activa');
    }

    const secret =
      this.configService.get<string>('JWT_SECRET') ||
      'local-development-secret-not-for-production';

    let payload: { sub: string };
    try {
      payload = await this.jwtService.verifyAsync(token, { secret });
    } catch {
      throw new UnauthorizedException('Sesión inválida o expirada');
    }

    // Comprobar el estado real del usuario en BD: si fue desactivado o
    // eliminado, la sesión se invalida inmediatamente (no esperar al expiry
    // del access token). El payload del JWT no sirve como fuente de verdad
    // para isActive porque queda obsoleto hasta su expiración.
    const user = await this.dataSource
      .getRepository(User)
      .findOne({
        where: { id: payload.sub },
        select: { id: true, isActive: true },
      });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Usuario inactivo o sin acceso');
    }

    request['user'] = payload;
    return true;
  }
}
