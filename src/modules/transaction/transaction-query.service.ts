import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccountRepository } from 'src/infrastructure/database/repositories/account.repository';
import { TransactionRepository } from 'src/infrastructure/database/repositories/transaction.repository';
import { Transaction } from 'src/infrastructure/database/entities/transaction.entity';
import { TransactionHistoryQueryDto } from './dto/transaction.dto';
import {
  TransactionHistoryResponseDto,
  TransactionItemDto,
  TransactionReceiptResponseDto,
} from './dto/transaction-response.dto';

@Injectable()
export class TransactionQueryService {
  constructor(
    private readonly accountRepo: AccountRepository,
    private readonly transactionRepo: TransactionRepository,
  ) {}

  async getMyHistory(
    userId: string,
    query: TransactionHistoryQueryDto,
  ): Promise<TransactionHistoryResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;
    const accounts = await this.accountRepo.findByUserId(userId);
    const accountIds = accounts.map((account) => account.id);
    const [transactions, total] =
      await this.transactionRepo.findByAccountIdsPaginated(
        accountIds,
        limit,
        offset,
      );

    return {
      transactions: transactions.map((transaction) =>
        this.toTransactionItem(transaction),
      ),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMyReceipt(
    userId: string,
    transactionId: string,
  ): Promise<TransactionReceiptResponseDto> {
    const transaction = await this.transactionRepo.findById(transactionId);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const account = await this.accountRepo.findById(transaction.accountId);

    if (!account || account.userId !== userId) {
      throw new ForbiddenException('Transaction does not belong to you');
    }

    return this.toTransactionItem(transaction);
  }

  private toTransactionItem(transaction: Transaction): TransactionItemDto {
    return {
      id: transaction.id,
      accountId: transaction.accountId,
      type: transaction.type,
      amount: transaction.amount,
      currencyCode: transaction.currencyCode,
      balanceBefore: transaction.balanceBefore,
      balanceAfter: transaction.balanceAfter,
      status: transaction.status,
      referenceId: transaction.referenceId,
      idempotencyKey: transaction.idempotencyKey,
      createdAt: transaction.createdAt,
    };
  }
}
