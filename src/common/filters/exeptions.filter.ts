import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch() // 모든 에러를 다 잡겠다
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 1. 에러 상태 코드 판별 (HttpException이 아니면 무조건 500)
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // 2. 에러 메시지 추출
    const message =
      exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    // 3. 로그에 빨간색으로 에러 출력 (디버깅용)
    this.logger.error(
      `Error on ${request.url}`,
      exception instanceof Error ? exception.stack : String(exception)
    );

    // 4. 플러터 앱이 알아먹기 좋게 통일된 형식으로 응답
    response.status(status).json({
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: typeof message === 'string' ? message : (message as any).message,
    });
  }
}
