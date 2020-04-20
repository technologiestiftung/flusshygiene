import { isPublicRoute, checkPublicSpot } from './middleware/public-data';
import Router from 'express-promise-router';
import {
  getBathingspots,
  getSingleBathingspot,
} from './request-handlers/bathingspots';
import {
  getBathingspotsByRegion,
  getPublicSpotsCount,
} from './request-handlers/bathingspots/public-get';
import { getAllRegions, getRegionById } from './request-handlers/regions';
import { buildPayload } from './request-handlers/responders';
import {
  getCollection,
  getCollectionsSubItem,
  getGenericInputMeasurements,
} from './request-handlers/bathingspots/collections/get';
import { collectionCheckPublic } from './middleware/collection-check';
import rateLimit from 'express-rate-limit';

const routesPublic = Router();

const EXPRESS_RATE_LIMIT_MINUTE = process.env.EXPRESS_RATE_LIMIT_MINUTE
  ? parseInt(process.env.EXPRESS_RATE_LIMIT_MINUTE, 10)
  : 5;
const EXPRESS_RATE_LIMIT_MAX_REQUEST_PER_IP = process.env
  .EXPRESS_RATE_LIMIT_MAX_REQUEST_PER_IP
  ? parseInt(process.env.EXPRESS_RATE_LIMIT_MAX_REQUEST_PER_IP, 10)
  : 100;
const limiter = rateLimit({
  windowMs: EXPRESS_RATE_LIMIT_MINUTE * 60 * 1000, // 5 minutes
  max: EXPRESS_RATE_LIMIT_MAX_REQUEST_PER_IP, // limit each IP to 100 requests per windowMs
});

routesPublic.use(limiter);
routesPublic.get('/bathingspots', isPublicRoute, getBathingspots);
routesPublic.get('/bathingspots/count', isPublicRoute, getPublicSpotsCount);

routesPublic.get(
  '/bathingspots/:spotId([0-9]+)',
  isPublicRoute,
  checkPublicSpot,
  getSingleBathingspot,
);

routesPublic.get(
  '/bathingspots/:region([a-z]+)',
  isPublicRoute,
  getBathingspotsByRegion,
);

routesPublic.get('/regions', isPublicRoute, getAllRegions);
routesPublic.get('/regions/:regionId([0-9]+)', isPublicRoute, getRegionById);
routesPublic.get('/', isPublicRoute, (request, response) => {
  const data = [
    '',
    '    _________________________',
    '    < Flusshygiene yeah baby! >',
    '     -------------------------',
    '            \\   ^__^',
    '             \\  (oo)_______',
    '                (__)\\       )\\/\\',
    '                    ||----w |',
    '                    ||     ||',
    '',
  ];
  response.json(
    buildPayload(
      true,
      `Server is running. You called ${request.url}`,
      data,
      false,
      undefined,
      undefined,
      EXPRESS_RATE_LIMIT_MINUTE,
      EXPRESS_RATE_LIMIT_MAX_REQUEST_PER_IP,
    ),
  );
});

routesPublic.get(
  '/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)',
  collectionCheckPublic,
  isPublicRoute,
  checkPublicSpot,
  getCollection,
);

// FIXME: Check if images work
routesPublic.get(
  '/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)',
  collectionCheckPublic,
  isPublicRoute,
  checkPublicSpot,
  getCollectionsSubItem,
);

routesPublic.get(
  '/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/measurements',
  collectionCheckPublic,
  isPublicRoute,
  checkPublicSpot,
  getGenericInputMeasurements,
);

// routesPublic.get(
//   '/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/measurements/:subItemId([0-9]+)',
//   collectionCheck,
//   isPublicRoute,
//   checkPublicSpot,
//   getGenericInputMeasurements,
// );
export default routesPublic;
