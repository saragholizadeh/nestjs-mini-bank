import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

type ExceptionResponseBody = {
  message?: string | string[];
  error?: string;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly exposeErrorDetails = false) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const payload = this.normalizeException(exception);

    const body: ApiErrorResponse = {
      success: false,
      statusCode: payload.statusCode,
      message: payload.message,
      data: null,
      error: {
        code: payload.code,
        details: payload.details,
      },
    };

    response.status(payload.statusCode).json(body);
  }

  private normalizeException(exception: unknown): {
    statusCode: number;
    code: string;
    message: string;
    details: string[] | null;
  } {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const response = exception.getResponse();

      if (Array.isArray((response as ExceptionResponseBody).message)) {
        const details = (response as ExceptionResponseBody).message as string[];
        return {
          statusCode,
          code: HttpStatus[statusCode] ?? 'HTTP_ERROR',
          message:
            statusCode === HttpStatus.BAD_REQUEST
              ? 'Validation failed'
              : this.defaultHttpMessage(statusCode),
          details,
        };
      }

      if (typeof response === 'string') {
        return {
          statusCode,
          code: HttpStatus[statusCode] ?? 'HTTP_ERROR',
          message: response,
          details: null,
        };
      }

      const body = response as ExceptionResponseBody;
      return {
        statusCode,
        code: HttpStatus[statusCode] ?? 'HTTP_ERROR',
        message:
          typeof body.message === 'string'
            ? body.message
            : this.defaultHttpMessage(statusCode),
        details: null,
      };
    }

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Something went wrong',
      details: this.exposeErrorDetails
        ? [this.getUnknownErrorMessage(exception)]
        : null,
    };
  }

  private getUnknownErrorMessage(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message;
    }

    return 'Unexpected non-error exception was thrown';
  }

  private defaultHttpMessage(statusCode: number): string {
    switch (statusCode) {
      case HttpStatus.BAD_REQUEST:
        return 'Bad request';
      case HttpStatus.UNAUTHORIZED:
        return 'Unauthorized';
      case HttpStatus.FORBIDDEN:
        return 'Forbidden';
      case HttpStatus.NOT_FOUND:
        return 'Not found';
      case HttpStatus.CONFLICT:
        return 'Conflict';
      default:
        return 'Request failed';
    }
  }
}
