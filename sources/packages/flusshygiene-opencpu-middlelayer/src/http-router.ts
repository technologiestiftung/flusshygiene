import { OCPU_API_HOST, VERSION } from './common/constants';

import { BroadCaster } from './events-broadcaster';
import Router from 'express-promise-router';
import { postPassThrough } from './post-pass-through';

enum FHpredictFunctions {
  calibrate = 'provide_rain_data_for_bathing_spot',
  model = 'simple',
  predict = 'simple',
}

// import got from 'got';
const router = Router();
const broadcaster = BroadCaster.getInstance();

router.get('/health', async (req, res) => {
  // req.session!.name = 'foo';
  console.log(req.session);
  res.json({
    success: true,
    message: 'Everything OK',
    version: VERSION,
  });
});

router.post(['/calibrate', '/predict', '/model'], async (req, res) => {
  if (req.body.payload === undefined) {
    res.status(404).json({
      success: false,
      message:
        'You need to pass the "url" [string] of the desired endpoint and the "payload" [Object] in the body of your POST request. The payload will be the body this module passes through',
      version: VERSION,
    });
    return;
  }
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
    default:
      res.status(404).json({
        success: false,
        message: 'Possible endpoints are "calibrate", "/predict" or "/model"',
        version: VERSION,
      });
      return;
  }

  res.status(201).json({
    success: true,
    message: `Your request to ${req.url} is beeing processed`,
    version: VERSION,
  });
  broadcaster.emit('passthrough', 'start');
  const passThroughBody = { ...req.body.payload };
  postPassThrough(url, passThroughBody)
    .then((body) => {
      // console.log(body);
      broadcaster.emit('passthrough', body);
      broadcaster.emit('passthrough', 'end');
    })
    .catch((error) => {
      broadcaster.emit('passthrough', error);
      broadcaster.emit('passthrough', 'end');
      // console.error(error);
      // throw error;
    });

  // const gres = await got.post('http://localhost:4444/process/300000', {
  //   json: true,
  //   body: passThroughBody,
  // });
  // console.log('response body', gres.body);
});
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
