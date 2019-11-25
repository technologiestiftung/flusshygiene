import Router from 'express-promise-router';
import {
  getBathingspots,
  getSingleBathingspot,
} from './request-handlers/bathingspots';
import { getBathingspotsByRegion } from './request-handlers/bathingspots/public-get';
import { getAllRegions, getRegionById } from './request-handlers/regions';
import { buildPayload } from './request-handlers/responders';
const publicRoutes = Router();

publicRoutes.get('/bathingspots', getBathingspots);

publicRoutes.get('/bathingspots/:id([0-9]+)', getSingleBathingspot);

publicRoutes.get('/bathingspots/:region([a-z]+)', getBathingspotsByRegion);

publicRoutes.get('/regions', getAllRegions);
publicRoutes.get('/regions/:regionId([0-9]+)', getRegionById);
publicRoutes.get('/', (request, response) => {
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
    buildPayload(true, `Server is running. You called ${request.url}`, data),
  );
});

export default publicRoutes;
