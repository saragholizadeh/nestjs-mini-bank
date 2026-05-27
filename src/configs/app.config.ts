import { registerAs } from '@nestjs/config';
import { APP_DEFAULTS } from 'src/common/constants/runtime.constants';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT ?? String(APP_DEFAULTS.PORT), 10),
  nodeEnv: process.env.NODE_ENV ?? APP_DEFAULTS.NODE_ENV,
}));
