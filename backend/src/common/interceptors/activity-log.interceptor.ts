import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ActivityLogsService } from '../../activity-logs/activity-logs.service';

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(private readonly activityLogsService: ActivityLogsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user } = request;

    const mutatingMethods = ['POST', 'PATCH', 'DELETE'];
    if (!mutatingMethods.includes(method) || !user) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(() => {
        this.activityLogsService
          .create({
            userId: user.sub,
            action: method,
            resource: url,
            description: `${method} ${url}`,
          })
          .catch(() => {
            // No bloquear si falla el log
          });
      }),
    );
  }
}
