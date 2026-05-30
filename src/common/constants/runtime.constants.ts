export const APP_ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test',
} as const;

export const APP_DEFAULTS = {
  PORT: 3000,
  NODE_ENV: APP_ENVIRONMENTS.DEVELOPMENT,
  NAME: 'mini-bank',
} as const;

export const DATABASE_DEFAULTS = {
  PORT: 5432,
  DRIVER: 'postgres',
} as const;

export const REDIS_DEFAULTS = {
  HOST: 'localhost',
  PORT: 6379,
} as const;

export const AUTH_DEFAULTS = {
  BCRYPT_SALT_ROUNDS: 12,
  JWT_EXPIRES_IN: '7d',
} as const;

export const ACCOUNT_NUMBER_RULES = {
  LENGTH: 10,
  PAD_CHAR: '0',
} as const;
