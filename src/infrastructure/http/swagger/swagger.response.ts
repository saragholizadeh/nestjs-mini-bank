import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiBody,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiResponseOptions,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';

type ApiEnvelopeExample = {
  success: boolean;
  statusCode: number;
  message: string;
  data: unknown;
  error: unknown;
};

type ApiEnvelopeSuccessOptions = {
  status: HttpStatus;
  description: string;
  dataType: Type<unknown>;
  example: ApiEnvelopeExample;
};

type ApiEnvelopeErrorOptions = {
  status: HttpStatus;
  description: string;
  example: ApiEnvelopeExample;
};

type SwaggerBodyExamples = Record<
  string,
  {
    summary: string;
    value: unknown;
  }
>;

export function buildSwaggerBodyExamples(
  description: string,
  examples: SwaggerBodyExamples,
): ReturnType<typeof ApiBody> {
  return ApiBody({
    description,
    examples,
  });
}

export function apiSuccessEnvelopeResponse({
  status,
  description,
  dataType,
  example,
}: ApiEnvelopeSuccessOptions): ReturnType<typeof applyDecorators> {
  const responseDecorator =
    status === HttpStatus.CREATED
      ? ApiCreatedResponse
      : status === HttpStatus.OK
        ? ApiOkResponse
        : ApiOkResponse;

  const responseOptions: ApiResponseOptions = {
    status,
    description,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        statusCode: { type: 'number', example: status },
        message: { type: 'string', example: example.message },
        data: { $ref: getSchemaPath(dataType) },
        error: { nullable: true, example: null },
      },
      required: ['success', 'statusCode', 'message', 'data', 'error'],
      example,
    },
  };

  return applyDecorators(
    ApiExtraModels(dataType),
    responseDecorator(responseOptions),
  );
}

export function apiErrorEnvelopeResponse({
  status,
  description,
  example,
}: ApiEnvelopeErrorOptions): ReturnType<typeof applyDecorators> {
  const responseMap = {
    [HttpStatus.BAD_REQUEST]: ApiBadRequestResponse,
    [HttpStatus.UNAUTHORIZED]: ApiUnauthorizedResponse,
    [HttpStatus.CONFLICT]: ApiConflictResponse,
    [HttpStatus.INTERNAL_SERVER_ERROR]: ApiInternalServerErrorResponse,
  } as const;

  const responseDecorator =
    responseMap[status as keyof typeof responseMap] ?? ApiInternalServerErrorResponse;

  const responseOptions: ApiResponseOptions = {
    status,
    description,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: status },
        message: { type: 'string', example: example.message },
        data: { nullable: true, example: null },
        error: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              example:
                (example.error as { code?: string } | null | undefined)?.code ??
                'HTTP_ERROR',
            },
            details: { nullable: true, example: null },
          },
          required: ['code', 'details'],
        },
      },
      required: ['success', 'statusCode', 'message', 'data', 'error'],
      example,
    },
  };

  return applyDecorators(responseDecorator(responseOptions));
}
