import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

interface AttemptWindow {
  count: number;
  resetsAt: number;
}

/** Límite en memoria para endpoints de autenticación. El proxy deberá imponer el límite distribuido en producción. */
@Injectable()
export class LoginRateLimitGuard implements CanActivate {
  private readonly attempts = new Map<string, AttemptWindow>();
  private readonly maxAttempts = 10;
  private readonly windowMs = 60_000;

  private pruneExpired(now: number): void {
    if (this.attempts.size < 1_000) {
      return;
    }

    for (const [key, attempt] of this.attempts) {
      if (attempt.resetsAt <= now) {
        this.attempts.delete(key);
      }
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.ip || request.socket.remoteAddress || 'unknown';
    const now = Date.now();
    this.pruneExpired(now);
    const current = this.attempts.get(key);
    const window =
      !current || current.resetsAt <= now
        ? { count: 0, resetsAt: now + this.windowMs }
        : current;

    window.count += 1;
    this.attempts.set(key, window);
    if (window.count > this.maxAttempts) {
      throw new HttpException(
        'Demasiados intentos. Intente nuevamente en un minuto.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
