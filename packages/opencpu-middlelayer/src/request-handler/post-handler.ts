import { FHpredictFunctions } from './../common/enums';
import { OCPU_API_HOST, VERSION } from '../common/constants';
import postPassThrough from '../post-pass-through';
import { logger } from '../logger';
import { IBroadcastData } from '../common/interfaces';
import { Request, Response } from 'express';
// import { broadcaster } from '../http-router';
import broadcaster from '../broadcaster-instance';
export const postHandler: (
  req: Request,
  res: Response,
) => Promise<void> = async (req, res) => {
  logger.info(
    `Passing through at ${new Date()} for ${req.sessionID}`,
    req.body,
  );
  // console.log(req.sessionID);
  // if (req.body.payload === undefined) {
  //   res.status(400).json({
  //     success: false,
  //     message:
  //       'You need to pass the "payload" [Object] in the body of your POST request. The payload will be the body this module passes through',
  //     version: VERSION,
  //     sessionID: req.sessionID,
  //   });
  //   return;
  // }
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
  // const passThroughBody = { ...req.body };
  postPassThrough(url, req.body)
    .then((body) => {
      // console.log(body);
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
      // console.error(error);
      // throw error;
    });
  // const gres = await got.post('http://localhost:4444/process/300000', {
  //   json: true,
  //   body: passThroughBody,
  // });
  // console.log('response body', gres.body);
};
