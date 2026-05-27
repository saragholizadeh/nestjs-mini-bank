import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Response } from 'express';
import { ApiSuccessResponse } from '../interfaces/api-response.interface';

type EnvelopePayload<T> = {
  message: string;
  data: T;
};

@Injectable()
export class ResponseEnvelopeInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T | null>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T | null>> {
    return next.handle().pipe(
      map((result) => {
        const response = context.switchToHttp().getResponse<Response>();
        const statusCode = response.statusCode || HttpStatus.OK;
        const { message, data } = this.normalizeResult(result);

        return {
          success: true,
          statusCode,
          message,
          data,
          error: null,
        };
      }),
    );
  }

  private normalizeResult(result: T): EnvelopePayload<T | null> {
    if (result === null || result === undefined) {
      return { message: 'Request completed successfully', data: null };
    }

    if (typeof result === 'object' && !Array.isArray(result)) {
      const payload = result as Record<string, unknown>;
      if ('message' in payload || 'data' in payload) {
        const { message: payloadMessage, data: payloadData, ...rest } = payload;
        const message =
          typeof payloadMessage === 'string'
            ? payloadMessage
            : 'Request completed successfully';

        return {
          message,
          data:
            'data' in payload
              ? ((payloadData as T | null | undefined) ?? null)
              : Object.keys(rest).length > 0
                ? (rest as T)
                : null,
        };
      }
    }

    return {
      message: 'Request completed successfully',
      data: result,
    };
  }
}
