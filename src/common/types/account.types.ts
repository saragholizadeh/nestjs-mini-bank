import { ACCOUNT_STATUSES } from '../constants/account.constants';

export type AccountStatus =
  (typeof ACCOUNT_STATUSES)[keyof typeof ACCOUNT_STATUSES];
