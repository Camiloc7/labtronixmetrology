import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

@Injectable()
export class PublicContactRateLimitGuard implements CanActivate {
  private readonly attempts = new Map<string, number[]>();
  private readonly windowMs = 10 * 60 * 1000;
  private readonly maxAttempts = 5;

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.ip || request.socket.remoteAddress || 'unknown';
    const cutoff = Date.now() - this.windowMs;
    const recent = (this.attempts.get(key) || []).filter(
      (time) => time > cutoff,
    );

    if (recent.length >= this.maxAttempts) {
      throw new HttpException(
        'Demasiadas solicitudes de contacto. Intente nuevamente más tarde.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    recent.push(Date.now());
    this.attempts.set(key, recent);
    return true;
  }
}
