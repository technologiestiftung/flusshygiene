import { FHpredictFunctions } from './../common/enums';
import { OCPU_API_HOST, VERSION } from '../common/constants';
import postPassThrough from '../post-pass-through';
import { logger } from '../logger';
import { IBroadcastData } from '../common/interfaces';
import { Request, Response } from 'express';
import broadcaster from '../broadcaster-instance';
export const postHandler: (
  req: Request,
  res: Response,
) => Promise<void> = async (req, res) => {
  logger.info(
    `Passing through at ${new Date()} for ${req.sessionID}`,
    req.body,
  );

  logger.info(`request body ${JSON.stringify(req.body)}`);
  let url = '';
  switch (req.url) {
    case '/calibrate':
      url = `${OCPU_API_HOST}/ocpu/library/fhpredict/R/${FHpredictFunctions.calibrate}/json`;
      break;
    case '/predict':
      url = `${OCPU_API_HOST}/ocpu/library/fhpredict/R/${FHpredictFunctions.predict}/json`;
      break;
    case '/model':
      url = `${OCPU_API_HOST}/ocpu/library/fhpredict/R/${FHpredictFunctions.model}/json`;
      break;
    case '/sleep':
      url = `${OCPU_API_HOST}/ocpu/library/fhpredict/R/${FHpredictFunctions.sleep}/json`;
      break;
  }
  res.status(201).json({
    success: true,
    message: `Your request to ${req.url} is beeing processed`,
    version: VERSION,
    sessionID: req.sessionID,
  });
  broadcaster.emit('passthrough', {
    event: 'start',
    sessionID: req.sessionID,
  });
  postPassThrough(url, req.body)
    .then((body) => {
      broadcaster.emit('passthrough', {
        event: 'response',
        payload: body,
        sessionID: req.sessionID,
      } as IBroadcastData);
      broadcaster.emit('passthrough', {
        event: 'end',
        sessionID: req.sessionID,
      } as IBroadcastData);
    })
    .catch((error) => {
      broadcaster.emit('passthrough', {
        event: 'response',
        payload: error,
        sessionID: req.sessionID,
      } as IBroadcastData);
      broadcaster.emit('passthrough', {
        event: 'end',
        sessionID: req.sessionID,
      } as IBroadcastData);
    });
};
