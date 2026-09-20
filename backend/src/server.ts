import { envConfig } from './config/env.config';
import app from './app';

const start = async () => {
  try {
    await app.listen({ port: envConfig.PORT, host: envConfig.HOST });
    console.log(`🚀 Server running on http://${envConfig.HOST}:${envConfig.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();