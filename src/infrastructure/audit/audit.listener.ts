import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuditService } from './audit.service';
import { EVENTS } from '../../domain/events/event-names';
import { MoneyDepositedEvent } from '../../domain/events/money-deposited.event';
import { MoneyWithdrawnEvent } from '../../domain/events/money-withdrawn.event';
import { TransferCompletedEvent } from '../../domain/events/transfer-completed.event';
import { TransferFailedEvent } from '../../domain/events/transfer-failed.event';
import { LoginFailedEvent } from '../../domain/events/login-failed.event';

@Injectable()
export class AuditListener {
  constructor(private readonly auditService: AuditService) {}

  @OnEvent(EVENTS.MONEY_DEPOSITED)
  async handleDeposit(event: MoneyDepositedEvent): Promise<void> {
    await this.auditService.log({
      userId: event.userId,
      action: 'DEPOSIT',
      entityType: 'account',
      entityId: event.accountId,
      before: { balance: event.balanceBefore },
      after: { balance: event.balanceAfter },
      ipAddress: event.ipAddress,
      result: 'SUCCESS',
    });
  }

  @OnEvent(EVENTS.MONEY_WITHDRAWN)
  async handleWithdraw(event: MoneyWithdrawnEvent): Promise<void> {
    await this.auditService.log({
      userId: event.userId,
      action: 'WITHDRAWAL',
      entityType: 'account',
      entityId: event.accountId,
      before: { balance: event.balanceBefore },
      after: { balance: event.balanceAfter },
      ipAddress: event.ipAddress,
      result: 'SUCCESS',
    });
  }

  @OnEvent(EVENTS.TRANSFER_COMPLETED)
  async handleTransfer(event: TransferCompletedEvent): Promise<void> {
    await this.auditService.log({
      userId: event.userId,
      action: 'TRANSFER',
      entityType: 'account',
      entityId: event.fromAccountId,
      before: null,
      after: {
        toAccountId: event.toAccountId,
        transferLogId: event.transferLogId,
        amount: event.amount,
      },
      ipAddress: event.ipAddress,
      result: 'SUCCESS',
    });
  }

  @OnEvent(EVENTS.TRANSFER_FAILED)
  async handleTransferFailed(event: TransferFailedEvent): Promise<void> {
    await this.auditService.log({
      userId: event.userId,
      action: 'TRANSFER',
      entityType: 'account',
      entityId: event.fromAccountId,
      before: null,
      after: { reason: event.reason },
      ipAddress: event.ipAddress,
      result: 'FAILED',
    });
  }

  @OnEvent(EVENTS.LOGIN_FAILED)
  async handleLoginFailed(event: LoginFailedEvent): Promise<void> {
    await this.auditService.log({
      userId: null,
      action: 'LOGIN',
      entityType: 'user',
      entityId: null,
      before: null,
      after: { email: event.email },
      ipAddress: event.ipAddress,
      result: 'FAILED',
    });
  }
}
