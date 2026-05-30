import { DataSource } from 'typeorm';
import { createEnvironmentConfig } from './src/configs/environment-config.factory';
import { DATABASE_DEFAULTS } from './src/common/constants/runtime.constants';

const config = createEnvironmentConfig();

export const AppDataSource = new DataSource({
  type: DATABASE_DEFAULTS.DRIVER,
  host: config.database.host,
  port: config.database.port,
  database: config.database.name,
  username: config.database.username,
  password: config.database.password,
  entities: ['src/infrastructure/database/entities/*.entity.ts'],
  migrations: ['src/infrastructure/database/migrations/*{.ts,.js}'],
});
