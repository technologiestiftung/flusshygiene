import jwtAuthz from 'express-jwt-authz';
import Router from 'express-promise-router';
import { checkJwt } from './auth';
import {
  getBathingspots,
  getSingleBathingspot,
} from './request-handlers/bathingspots';
import {
  addBathingspotToUser,
  deleteBathingspotOfUser,
  getOneUserBathingspotById,
  getUserBathingspots,
  updateBathingspotOfUser,
} from './request-handlers/bathingspots/';
import {
  deleteCollectionSubItem,
  getCollection,
  getCollectionsSubItem,
  getGenericInputMeasurements,
  postCollection,
  postCollectionsSubItem,
} from './request-handlers/bathingspots/collections';
import { getOneUsersBathingspotsByRegion } from './request-handlers/bathingspots/get';
import { getBathingspotsByRegion } from './request-handlers/bathingspots/public-get';
import { defaultGetResponse } from './request-handlers/defaults';
import {
  deleteRegion,
  getAllRegions,
  postRegion,
  putRegion,
} from './request-handlers/regions';
import { getRegionById } from './request-handlers/regions/index';
// import { defaultGetResponse, defaultPostResponse } from './request-handlers/default-requests';
import {
  // addUser,
  deleteUser,
  getUser,
  getUsers,
  postUser,
  updateUser,
} from './request-handlers/users/';
// import { getPredictions } from './request-handlers/users/bathingspots/prediction/get';

const checkScopes = jwtAuthz(['admin', 'read:bathingspots']);

const router = Router();

// endpoint for testing if API is live and tokens work
// const getPing : getResponse = async (request, response) =>{
//   response.status(200).json(request.body);
// }
router.get('/', checkJwt, checkScopes, defaultGetResponse);

router.get('/users', checkJwt, checkScopes, getUsers);
// get user by id
router.get('/users/:userId([0-9]+)', checkJwt, checkScopes, getUser);

router.get(
  '/users/:userId([0-9]+)/bathingspots',
  checkJwt,
  checkScopes,
  getUserBathingspots,
);

router.get(
  '/users/:userId([0-9]+)/bathingspots/:region([a-z]+)',
  checkJwt,
  checkScopes,
  getOneUsersBathingspotsByRegion,
);

router.get(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)',
  checkJwt,
  checkScopes,
  getOneUserBathingspotById,
);

// add new spot to user

router.post(
  '/users/:userId([0-9]+)/bathingspots',
  checkJwt,
  checkScopes,
  addBathingspotToUser,
);

router.put(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)',
  checkJwt,
  checkScopes,
  updateBathingspotOfUser,
);

router.delete(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)',
  checkJwt,
  checkScopes,
  deleteBathingspotOfUser,
);

// POST and GET predictions from/to spot

// GET measurements, predictions from
// router.get('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/predictions', checkJwt, checkScopes, getPredictions);
router.get(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collection([A-Za-z]+)',
  checkJwt,
  checkScopes,
  getCollection,
);

// get subitems of collection
router.get(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)',
  checkJwt,
  checkScopes,
  getCollectionsSubItem,
);

// get subitems of collection
router.get(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/measurements',
  checkJwt,
  checkScopes,
  getGenericInputMeasurements,
);
router.post(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/measurements',
  checkJwt,
  checkScopes,
  postCollectionsSubItem,
);

router.post(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collection([A-Za-z]+)',
  checkJwt,
  checkScopes,
  postCollection,
);
router.delete(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collection([A-Za-z]+)/:itemId([0-9]+)',
  checkJwt,
  checkScopes,
  deleteCollectionSubItem,
);

// add new user

router.post('/users', checkJwt, checkScopes, postUser);
// update user
router.put('/users/:userId([0-9]+)', checkJwt, checkScopes, updateUser);
// delete user
router.delete('/users/:userId([0-9]+)', checkJwt, checkScopes, deleteUser);

// get all bathingspots PUBLIC
router.get('/bathingspots', getBathingspots);

router.get('/bathingspots/:id([0-9]+)', getSingleBathingspot);

router.get('/bathingspots/:region([a-z]+)', getBathingspotsByRegion);

router.get('/regions', getAllRegions);
router.get('/regions/:regionId([0-9]+)', getRegionById);

router.post('/regions', checkJwt, checkScopes, postRegion);
router.put('/regions/:regionId([0-9]+)', checkJwt, checkScopes, putRegion);
router.delete(
  '/regions/:regionId([0-9]+)',
  checkJwt,
  checkScopes,
  deleteRegion,
);

export default router;
