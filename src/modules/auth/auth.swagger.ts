import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';
import {
  apiErrorEnvelopeResponse,
  apiSuccessEnvelopeResponse,
  buildSwaggerBodyExamples,
} from 'src/infrastructure/http/swagger/swagger.response';

const registerRequestExamples = {
  basic: {
    summary: 'Happy-path registration',
    value: {
      email: 'sara@example.com',
      password: 'Secret123!',
      fullName: 'Sara Ahmadi',
    },
  },
};

const loginRequestExamples = {
  basic: {
    summary: 'Happy-path login',
    value: {
      email: 'sara@example.com',
      password: 'Secret123!',
    },
  },
};

export const ApiAuthControllerDocs = () => applyDecorators(ApiTags('Auth'));

export const ApiRegisterDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Register a new user',
      description:
        'Creates a user and a default account in one atomic transaction.',
    }),
    buildSwaggerBodyExamples(
      'Register payload with a realistic example.',
      registerRequestExamples,
    ),
    ApiBody({ type: RegisterDto }),
    apiSuccessEnvelopeResponse({
      status: HttpStatus.CREATED,
      description: 'User registered successfully.',
      dataType: RegisterResponseDto,
      example: {
        success: true,
        statusCode: 201,
        message: 'Registration successful',
        data: {
          userId: '55d4b4bf-1b24-4c3c-8d89-2e1b8d9b78da',
          accountId: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
        },
        error: null,
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation failed.',
      example: {
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        data: null,
        error: {
          code: 'BAD_REQUEST',
          details: ['password must be longer than or equal to 8 characters'],
        },
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.CONFLICT,
      description: 'Email already in use.',
      example: {
        success: false,
        statusCode: 409,
        message: 'Email already in use',
        data: null,
        error: {
          code: 'CONFLICT',
          details: null,
        },
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Unexpected failure.',
      example: {
        success: false,
        statusCode: 500,
        message: 'Something went wrong',
        data: null,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          details: null,
        },
      },
    }),
  );

export const ApiLoginDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Login a user',
      description: 'Validates credentials and returns a JWT access token.',
    }),
    buildSwaggerBodyExamples(
      'Login payload with a realistic example.',
      loginRequestExamples,
    ),
    ApiBody({ type: LoginDto }),
    apiSuccessEnvelopeResponse({
      status: HttpStatus.OK,
      description: 'Login succeeded.',
      dataType: LoginResponseDto,
      example: {
        success: true,
        statusCode: 200,
        message: 'Login successful',
        data: {
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NWQ0YjRiZi0xYjI0LTRjM2MtOGQ4OS0yZTFiOGQ5Yjc4ZGEiLCJlbWFpbCI6InNhcmFAZXhhbXBsZS5jb20ifQ.signature',
        },
        error: null,
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Validation failed.',
      example: {
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        data: null,
        error: {
          code: 'BAD_REQUEST',
          details: ['email must be an email'],
        },
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Invalid email or password.',
      example: {
        success: false,
        statusCode: 401,
        message: 'Invalid credentials',
        data: null,
        error: {
          code: 'UNAUTHORIZED',
          details: null,
        },
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Unexpected failure.',
      example: {
        success: false,
        statusCode: 500,
        message: 'Something went wrong',
        data: null,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          details: null,
        },
      },
    }),
  );
