import {
  PROCESS_STATUSES,
  TRANSACTION_TYPES,
} from '../constants/transaction.constants';

export type ProcessStatus =
  (typeof PROCESS_STATUSES)[keyof typeof PROCESS_STATUSES];

export type TransactionType =
  (typeof TRANSACTION_TYPES)[keyof typeof TRANSACTION_TYPES];
