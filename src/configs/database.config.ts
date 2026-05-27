import { registerAs } from '@nestjs/config';
import { DATABASE_DEFAULTS } from 'src/common/constants/runtime.constants';

export default registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? String(DATABASE_DEFAULTS.PORT), 10),
  name: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
}));
