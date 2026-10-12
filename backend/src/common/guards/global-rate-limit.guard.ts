import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

interface Window {
  count: number;
  resetsAt: number;
}

/** Límite global en memoria por IP (sliding window). En producción el proxy deberá
 * imponer el límite distribuido; aquí se cubre la defensa en profundidad. */
@Injectable()
export class GlobalRateLimitGuard implements CanActivate {
  private readonly windows = new Map<string, Window>();

  constructor(private readonly configService: ConfigService) {}

  private get maxRequests(): number {
    const value = Number(this.configService.get('RATE_LIMIT_MAX'));
    return Number.isFinite(value) && value > 0 ? value : 300;
  }

  private get windowMs(): number {
    const value = Number(this.configService.get('RATE_LIMIT_WINDOW_MS'));
    return Number.isFinite(value) && value > 0 ? value : 60_000;
  }

  private pruneExpired(now: number): void {
    if (this.windows.size < 5_000) {
      return;
    }
    for (const [key, win] of this.windows) {
      if (win.resetsAt <= now) {
        this.windows.delete(key);
      }
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.ip || request.socket.remoteAddress || 'unknown';
    const now = Date.now();
    this.pruneExpired(now);

    const current = this.windows.get(key);
    const win =
      !current || current.resetsAt <= now
        ? { count: 0, resetsAt: now + this.windowMs }
        : current;

    win.count += 1;
    this.windows.set(key, win);

    if (win.count > this.maxRequests) {
      throw new HttpException(
        'Demasiadas solicitudes. Intente nuevamente.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    return true;
  }
}
