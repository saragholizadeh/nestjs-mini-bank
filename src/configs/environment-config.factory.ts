import * as dotenv from 'dotenv';
import {
  APP_DEFAULTS,
  APP_ENVIRONMENTS,
  AUTH_DEFAULTS,
  DATABASE_DEFAULTS,
  REDIS_DEFAULTS,
} from '../common/constants/runtime.constants';
import { AppEnvironment, EnvironmentConfig } from './environment-config.types';

type EnvironmentSource = NodeJS.ProcessEnv;

dotenv.config({ quiet: true });

const REQUIRED_ENV_KEYS = [
  'DB_HOST',
  'DB_NAME',
  'DB_USERNAME',
  'DB_PASSWORD',
  'JWT_SECRET',
] as const;

export function createEnvironmentConfig(
  env: EnvironmentSource = process.env,
): EnvironmentConfig {
  assertRequiredEnv(env);

  return {
    app: {
      name: env.APP_NAME ?? APP_DEFAULTS.NAME,
      nodeEnv: parseNodeEnv(env.NODE_ENV),
      port: parsePort(env.PORT, APP_DEFAULTS.PORT, 'PORT'),
    },
    database: {
      host: env.DB_HOST!,
      port: parsePort(env.DB_PORT, DATABASE_DEFAULTS.PORT, 'DB_PORT'),
      name: env.DB_NAME!,
      username: env.DB_USERNAME!,
      password: env.DB_PASSWORD!,
    },
    jwt: {
      secret: env.JWT_SECRET!,
      expiresIn: env.JWT_EXPIRES_IN ?? AUTH_DEFAULTS.JWT_EXPIRES_IN,
    },
    redis: {
      host: env.REDIS_HOST ?? REDIS_DEFAULTS.HOST,
      port: parsePort(env.REDIS_PORT, REDIS_DEFAULTS.PORT, 'REDIS_PORT'),
    },
  };
}

function assertRequiredEnv(env: EnvironmentSource): void {
  const missingKeys = REQUIRED_ENV_KEYS.filter((key) => !env[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingKeys.join(', ')}`,
    );
  }
}

function parseNodeEnv(value: string | undefined): AppEnvironment {
  const nodeEnv = value ?? APP_DEFAULTS.NODE_ENV;
  const allowedEnvironments = Object.values(APP_ENVIRONMENTS);

  if (!allowedEnvironments.includes(nodeEnv as AppEnvironment)) {
    throw new Error(
      `Invalid NODE_ENV "${nodeEnv}". Allowed values: ${allowedEnvironments.join(
        ', ',
      )}`,
    );
  }

  return nodeEnv as AppEnvironment;
}

function parsePort(
  value: string | undefined,
  defaultValue: number,
  key: string,
): number {
  const rawValue = value ?? String(defaultValue);
  const port = Number(rawValue);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`${key} must be a valid TCP port number.`);
  }

  return port;
}
