// broadcaster - instance.ts;
import { BroadCaster } from './events-broadcaster';
import { IBroadcastData } from './common/interfaces';
import { logger } from './logger';

const broadcaster = BroadCaster.getInstance();
/**
 * No need to have this here in index.
 * Should go to http-router or broadcaser itself
 */
broadcaster.on('passthrough', (data: IBroadcastData) => {
  switch (data.event) {
    case 'start': {
      logger.info('passthrough has started');
      broadcaster.emit('data', { data });
      break;
    }
    case 'end': {
      logger.info('passthrough has ended');
      broadcaster.emit('data', { data });
      break;
    }
    default: {
      logger.info(
        `response passed back from opencpu ${JSON.stringify(data)}`,
        data,
      );
      broadcaster.emit('data', { data });
      break;
    }
  }
});

export default broadcaster;
export { broadcaster };
