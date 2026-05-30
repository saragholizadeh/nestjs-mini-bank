import { APP_ENVIRONMENTS } from '../common/constants/runtime.constants';

export type AppEnvironment =
  (typeof APP_ENVIRONMENTS)[keyof typeof APP_ENVIRONMENTS];

export type EnvironmentConfig = {
  app: {
    name: string;
    nodeEnv: AppEnvironment;
    port: number;
  };
  database: {
    host: string;
    port: number;
    name: string;
    username: string;
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  redis: {
    host: string;
    port: number;
  };
};
