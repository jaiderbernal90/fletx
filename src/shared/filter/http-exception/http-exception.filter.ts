import { ApiErrorResponse } from '@/shared/interfaces/api.response.interface';
import { IExceptionResponse, IRequestWithUser } from '@/shared/utils/exception.response.interface';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor() {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<IRequestWithUser>();

    const { status, message, error, stack, details } = this.extractExceptionInfo(exception);

    this.logError(request, status, message, error, stack);

    const errorResponse: ApiErrorResponse<null> = {
      success: false,
      message,
      error,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      traceId: request.traceId,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }

  private extractExceptionInfo(exception: unknown): {
    status: number;
    message: string;
    error: string | null;
    stack?: string;
    details?: string;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as string | IExceptionResponse;
      const details = this.extractDetails(exceptionResponse);

      return {
        status,
        message: this.extractMessage(exceptionResponse, exception),
        error: this.extractError(exceptionResponse, exception),
        stack: exception.stack,
        ...(details && { details }),
      };
    }

    if (exception instanceof Error) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: exception.message,
        error: exception.name,
        stack: exception.stack,
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: null,
    };
  }

  private extractMessage(exceptionResponse: string | IExceptionResponse, exception: HttpException): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (Array.isArray(exceptionResponse.message)) {
      return 'BAD REQUEST';
    }

    return exceptionResponse.message || exception.message;
  }

  private extractError(exceptionResponse: string | IExceptionResponse, exception: HttpException): string {
    if (typeof exceptionResponse === 'object') {
      return exceptionResponse.error || exception.name;
    }
    return exception.name;
  }

  private extractDetails(exceptionResponse: string | IExceptionResponse): any {
    if (typeof exceptionResponse === 'object' && 'details' in exceptionResponse) {
      return exceptionResponse.details;
    }
    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      return exceptionResponse.message;
    }

    return undefined;
  }

  private logError(
    request: IRequestWithUser,
    status: number,
    message: string,
    error: string | null,
    stack?: string,
  ): void {
    const correlationId = request.headers['x-correlation-id'] || uuid();

    const logMessage = {
      correlationId,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      status,
      message,
      error,
      userId: request?.user?.id,
      ip: request.ip,
      userAgent: request.headers['user-agent'],
      ...(stack && { stack }),
    };

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(JSON.stringify(logMessage));
    } else {
      this.logger.warn(JSON.stringify(logMessage));
    }
  }
}
