import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    const type = context.getType();

    let method = '';
    let url = '';

    if (type === 'http') {
      const req = context.switchToHttp().getRequest();
      method = req.method;
      url = req.originalUrl;
    } else if (type === 'ws') {
      const client = context.switchToWs().getClient();
      method = 'WS';
      url = context.getHandler().name;
    }

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(`[${method}] ${url} - ${responseTime}ms`);
      })
    );
  }
}
