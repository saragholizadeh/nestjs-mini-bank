import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  apiErrorEnvelopeResponse,
  apiSuccessEnvelopeResponse,
} from 'src/infrastructure/http/swagger/swagger.response';
import {
  AccountBalanceResponseDto,
  MyAccountsResponseDto,
} from './dto/account-response.dto';

export const ApiAccountControllerDocs = () => applyDecorators(ApiTags('Accounts'));

export const ApiMyAccountsDocs = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get my accounts',
      description: 'Returns all active accounts owned by the authenticated user.',
    }),
    apiSuccessEnvelopeResponse({
      status: HttpStatus.OK,
      description: 'Accounts returned successfully.',
      dataType: MyAccountsResponseDto,
      example: {
        success: true,
        statusCode: 200,
        message: 'Request completed successfully',
        data: {
          accounts: [
            {
              id: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
              accountNumber: '1234567890',
              currencyCode: 'USD',
              status: 'active',
            },
          ],
        },
        error: null,
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Missing, expired, or invalid bearer token.',
      example: {
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
        data: null,
        error: { code: 'UNAUTHORIZED', details: null },
      },
    }),
  );

export const ApiAccountBalanceDocs = () =>
  applyDecorators(
    ApiBearerAuth('access-token'),
    ApiOperation({
      summary: 'Get my account balance',
      description:
        'Returns the balance for one account when it belongs to the authenticated user.',
    }),
    ApiParam({
      name: 'accountId',
      example: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
    }),
    apiSuccessEnvelopeResponse({
      status: HttpStatus.OK,
      description: 'Account balance returned successfully.',
      dataType: AccountBalanceResponseDto,
      example: {
        success: true,
        statusCode: 200,
        message: 'Request completed successfully',
        data: {
          accountId: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
          balance: 50000,
          currencyCode: 'USD',
        },
        error: null,
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Account does not belong to the authenticated user.',
      example: {
        success: false,
        statusCode: 403,
        message: 'Account does not belong to you',
        data: null,
        error: { code: 'FORBIDDEN', details: null },
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Missing, expired, or invalid bearer token.',
      example: {
        success: false,
        statusCode: 401,
        message: 'Unauthorized',
        data: null,
        error: { code: 'UNAUTHORIZED', details: null },
      },
    }),
  );
