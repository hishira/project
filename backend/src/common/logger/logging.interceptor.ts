import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, ip, headers } = request;
    const userAgent = headers['user-agent'] || '';

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        const { statusCode } = response;

        // Extract user information if available from request
        const user = (request as any).user;
        const userId = user?.id || user?.sub;
        const sessionId = (request as any).sessionId;

        this.logger.logHttpRequest({
          method,
          url,
          statusCode,
          responseTime,
          ip,
          userAgent,
          userId,
          sessionId,
        });
      }),
    );
  }
}
