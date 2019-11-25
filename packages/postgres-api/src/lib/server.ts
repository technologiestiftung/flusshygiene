// import http from 'http';
import app from './app';
import { CONSTANTS } from './common/constants';

const PORT: number | string =
  process.env[`POSTGRES_EXPRESS_PORT_${CONSTANTS.ENV_SUFFIX}`] || 5004;

// const server = http.createServer(app);

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    process.stdout.write(`listening on http://localhost:${PORT}\n`);
  }
});
