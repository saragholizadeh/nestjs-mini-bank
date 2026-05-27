import { CURRENCY_TYPES } from '../constants/currency.constants';

export type CurrencyCode = (typeof CURRENCY_TYPES)[keyof typeof CURRENCY_TYPES];
