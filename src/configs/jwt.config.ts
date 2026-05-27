import { registerAs } from '@nestjs/config';
import { AUTH_DEFAULTS } from 'src/common/constants/runtime.constants';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_EXPIRES_IN ?? AUTH_DEFAULTS.JWT_EXPIRES_IN,
}));
