import { ENV_SUFFIX } from './common/constants';
import { app } from './app';
import { logger } from './logger';
const PORT: number | string =
  process.env[`REDIS_EXPRESS_PORT_${ENV_SUFFIX}`] || 4004;
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(`server listening on http://localhost:${PORT}`);
  }
});
