import { websocketServer, wsSubmit } from './websocket-server';

import { BroadCaster } from './events-broadcaster';
import { ENV_SUFFIX } from './common/constants';
import app from './app';
import http from 'http';
import { logger } from './logger';

const broadcaster = BroadCaster.getInstance();
// const ENV_SUFFIX = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';

const PORT: number | string =
  process.env[`REDIS_EXPRESS_PORT_${ENV_SUFFIX}`] || 4004;

const server = http.createServer(app);
const wss = websocketServer(server);

broadcaster.on('passthrough', (data: any) => {
  switch (data) {
    case 'start': {
      console.info('passthrough has started');

      break;
    }
    case 'end': {
      console.info('passthrough has ended');
      break;
    }
    default: {
      // console.info('data', data);
      wsSubmit(wss, data);
      break;
    }
  }
});
server.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(
      `server listening on http://localhost:${PORT}\n`,
      `wss listening on ws://localhost:${PORT}`,
    );
  }
});

// pubsub().catch((err) => {
//   throw err;
// });
