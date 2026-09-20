import { envConfig } from './env.config';

export const jwtConfig = {
  secret: envConfig.JWT_SECRET,
  expiresIn: envConfig.JWT_EXPIRES_IN || '15m',
};
