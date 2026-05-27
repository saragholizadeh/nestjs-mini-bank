import { CURRENCY_TYPES } from './currency.constants';

export const ACCOUNT_STATUSES = {
  ACTIVE: 'active',
  FROZEN: 'frozen',
  CLOSED: 'closed',
} as const;

export const ACCOUNT_DEFAULTS = {
  INITIAL_BALANCE: 0,
  CURRENCY_CODE: CURRENCY_TYPES.USD,
  STATUS: ACCOUNT_STATUSES.ACTIVE,
} as const;
