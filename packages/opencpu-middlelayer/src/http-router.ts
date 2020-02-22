import { BroadCaster } from './events-broadcaster';
import Router from 'express-promise-router';
import { logger } from './logger';
import { IBroadcastData } from './common/interfaces';
import { postHandler } from './request-handler/post-handler';
import { getHandler } from './request-handler/get-handler';

// import got from 'got';
const router = Router();
export const broadcaster = BroadCaster.getInstance();
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

router.get('/stream', broadcaster.route);

router.get('/health', getHandler);

router.post(['/calibrate', '/predict', '/model', '/sleep'], postHandler);
// router.post('/predict', async (req, res) => {
//   res.status(201).json({
//     success: true,
//     message: `Your request to ${req.url} is beeing processed`,
//   });
// });
// router.post('/model', async (req, res) => {
//   res.status(201).json({
//     success: true,
//     message: `Your request to ${req.url} is beeing processed`,
//   });
// });

export { router };
