import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import {
  apiErrorEnvelopeResponse,
  apiSuccessEnvelopeResponse,
  buildSwaggerBodyExamples,
} from 'src/infrastructure/http/swagger/swagger.response';
import { DepositDto, TransferDto, WithdrawDto } from './dto/transaction.dto';
import {
  TransactionHistoryResponseDto,
  TransactionReceiptResponseDto,
  TransferResponseDto,
} from './dto/transaction-response.dto';

const accountId = 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111';
const destinationAccountId = '0b4da946-5cd8-46d2-9269-f9421f57d2c1';

export const ApiTransactionControllerDocs = () =>
  applyDecorators(ApiTags('Transactions'), ApiBearerAuth('access-token'));

export const ApiDepositDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Deposit funds into an account',
      description:
        'Deposits money into an owned account and records the transaction atomically.',
    }),
    buildSwaggerBodyExamples('Deposit request examples.', {
      basic: {
        summary: 'Deposit into owned account',
        value: {
          accountId,
          amount: 50000,
          idempotencyKey: 'deposit-2026-06-02-001',
        },
      },
    }),
    ApiBody({ type: DepositDto }),
    apiSuccessEnvelopeResponse({
      status: HttpStatus.OK,
      description: 'Deposit completed successfully.',
      example: {
        success: true,
        statusCode: 200,
        message: 'Deposit successful',
        data: null,
        error: null,
      },
    }),
    commonTransactionErrors(),
  );

export const ApiWithdrawDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Withdraw funds from an account',
      description:
        'Withdraws money from an owned account after balance and account-state validation.',
    }),
    buildSwaggerBodyExamples('Withdraw request examples.', {
      basic: {
        summary: 'Withdraw from owned account',
        value: {
          accountId,
          amount: 25000,
          idempotencyKey: 'withdraw-2026-06-02-001',
        },
      },
    }),
    ApiBody({ type: WithdrawDto }),
    apiSuccessEnvelopeResponse({
      status: HttpStatus.OK,
      description: 'Withdrawal completed successfully.',
      example: {
        success: true,
        statusCode: 200,
        message: 'Withdrawal successful',
        data: null,
        error: null,
      },
    }),
    commonTransactionErrors(),
    insufficientFundsError(),
  );

export const ApiTransferDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Transfer funds between accounts',
      description:
        'Transfers money from an owned source account to a destination account in one atomic operation.',
    }),
    buildSwaggerBodyExamples('Transfer request examples.', {
      basic: {
        summary: 'Transfer from owned account',
        value: {
          fromAccountId: accountId,
          toAccountId: destinationAccountId,
          amount: 10000,
          idempotencyKey: 'transfer-2026-06-02-001',
        },
      },
    }),
    ApiBody({ type: TransferDto }),
    apiSuccessEnvelopeResponse({
      status: HttpStatus.OK,
      description: 'Transfer completed successfully.',
      dataType: TransferResponseDto,
      example: {
        success: true,
        statusCode: 200,
        message: 'Transfer successful',
        data: {
          transferLogId: 'b8f7f52d-7f27-4f8b-8a9d-f8b7d9c20f31',
        },
        error: null,
      },
    }),
    commonTransactionErrors(),
    insufficientFundsError(),
  );

export const ApiTransactionHistoryDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get my transaction history',
      description:
        'Returns paginated transaction history for all accounts owned by the authenticated user.',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      example: 1,
      description: 'Page number, starting from 1.',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      example: 20,
      description: 'Number of transactions per page. Maximum is 100.',
    }),
    apiSuccessEnvelopeResponse({
      status: HttpStatus.OK,
      description: 'Transaction history returned successfully.',
      dataType: TransactionHistoryResponseDto,
      example: {
        success: true,
        statusCode: 200,
        message: 'Request completed successfully',
        data: {
          transactions: [
            {
              id: '5f84f828-f42c-4844-aac9-e5cf08e0d5de',
              accountId,
              type: 'deposit',
              amount: 50000,
              currencyCode: 'USD',
              balanceBefore: 0,
              balanceAfter: 50000,
              status: 'completed',
              referenceId: null,
              idempotencyKey: 'deposit-2026-06-02-001',
              createdAt: '2026-06-02T10:30:00.000Z',
            },
          ],
          meta: {
            page: 1,
            limit: 20,
            total: 1,
            totalPages: 1,
          },
        },
        error: null,
      },
    }),
    commonReadErrors(),
  );

export const ApiTransactionReceiptDocs = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get my transaction receipt',
      description:
        'Returns a receipt for one transaction when it belongs to one of the authenticated user accounts.',
    }),
    ApiParam({
      name: 'transactionId',
      example: '5f84f828-f42c-4844-aac9-e5cf08e0d5de',
    }),
    apiSuccessEnvelopeResponse({
      status: HttpStatus.OK,
      description: 'Transaction receipt returned successfully.',
      dataType: TransactionReceiptResponseDto,
      example: {
        success: true,
        statusCode: 200,
        message: 'Request completed successfully',
        data: {
          id: '5f84f828-f42c-4844-aac9-e5cf08e0d5de',
          accountId,
          type: 'deposit',
          amount: 50000,
          currencyCode: 'USD',
          balanceBefore: 0,
          balanceAfter: 50000,
          status: 'completed',
          referenceId: null,
          idempotencyKey: 'deposit-2026-06-02-001',
          createdAt: '2026-06-02T10:30:00.000Z',
        },
        error: null,
      },
    }),
    commonReadErrors(),
    apiErrorEnvelopeResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'The transaction does not belong to the authenticated user.',
      example: {
        success: false,
        statusCode: 403,
        message: 'Transaction does not belong to you',
        data: null,
        error: {
          code: 'FORBIDDEN',
          details: null,
        },
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.NOT_FOUND,
      description: 'Transaction was not found.',
      example: {
        success: false,
        statusCode: 404,
        message: 'Transaction not found',
        data: null,
        error: {
          code: 'NOT_FOUND',
          details: null,
        },
      },
    }),
  );

function commonTransactionErrors(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    apiErrorEnvelopeResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid request body or inactive account.',
      example: {
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        data: null,
        error: {
          code: 'BAD_REQUEST',
          details: ['amount must be a positive number'],
        },
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
        error: {
          code: 'UNAUTHORIZED',
          details: null,
        },
      },
    }),
    apiErrorEnvelopeResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'The account does not belong to the authenticated user.',
      example: {
        success: false,
        statusCode: 403,
        message: 'Account does not belong to you',
        data: null,
        error: {
          code: 'FORBIDDEN',
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
}

function insufficientFundsError(): ReturnType<typeof applyDecorators> {
  return apiErrorEnvelopeResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'The account does not have enough available balance.',
    example: {
      success: false,
      statusCode: 422,
      message: 'Insufficient funds - available: 5000, required: 10000',
      data: null,
      error: {
        code: 'UNPROCESSABLE_ENTITY',
        details: null,
      },
    },
  });
}

function commonReadErrors(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    apiErrorEnvelopeResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Invalid query parameter or route parameter.',
      example: {
        success: false,
        statusCode: 400,
        message: 'Validation failed',
        data: null,
        error: {
          code: 'BAD_REQUEST',
          details: ['limit must not be greater than 100'],
        },
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
}
