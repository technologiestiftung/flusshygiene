import { wsSubmit } from './websocket-server';

import { BroadCaster } from './events-broadcaster';
import { ENV_SUFFIX } from './common/constants';
import { app, wss } from './app';
// import http from 'http';
import { logger } from './logger';
import { IBroadcastData } from './common/interfaces';

const broadcaster = BroadCaster.getInstance();

const PORT: number | string =
  process.env[`REDIS_EXPRESS_PORT_${ENV_SUFFIX}`] || 4004;

// const server = http.createServer(app);
// const wss = websocketServer(server);

broadcaster.on('passthrough', (data: IBroadcastData) => {
  switch (data.event) {
    case 'start': {
      logger.info('passthrough has started');

      break;
    }
    case 'end': {
      logger.info('passthrough has ended');
      break;
    }
    default: {
      logger.info('response passed back from opencpu', data);
      wsSubmit(wss, data);
      break;
    }
  }
});
app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(
      `server listening on http://localhost:${PORT}\nwss listening on ws://localhost:${PORT}`,
    );
  }
});

// pubsub().catch((err) => {
//   throw err;
// });
