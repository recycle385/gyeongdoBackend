import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // 1. 요청이 들어온 시간 기록
    const now = Date.now();

    // HTTP 요청인지 소켓 요청인지 구분
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
      // 소켓 이벤트명 (move, join 등)
      url = context.getHandler().name;
    }

    // 2. 처리가 다 끝나고 나갈 때 로그 찍기
    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - now;
        this.logger.log(
          `[${method}] ${url} - ${responseTime}ms` // 예: [WS] handleMove - 12ms
        );
      })
    );
  }
}
