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

import { deleteCollectionSubItem } from './request-handlers/bathingspots/collections/delete';
import {
  getCollection,
  getCollectionsSubItem,
  getGenericInputMeasurements,
} from './request-handlers/bathingspots/collections/get';
import {
  postCollection,
  postCollectionsSubItem,
} from './request-handlers/bathingspots/collections/post';
import {
  postFile,
  upload,
  postPlot,
} from './request-handlers/bathingspots/collections/post-file';
import { postFileMiddleWare } from './middleware/post-file-mw';
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
import { s3 } from './s3';
import { putCollectionItem } from './request-handlers/bathingspots/collections/put';
import { checkUserAndSpot } from './middleware/user-spot-check';
import { collectionCheck } from './middleware/collection-check';
// import { getPredictions } from './request-handlers/users/bathingspots/prediction/get';

const checkScopes = jwtAuthz(['admin', 'read:bathingspots']);

const router = Router();

// endpoint for testing if API is live and tokens work
// const getPing : getResponse = async (request, response) =>{
//   response.status(200).json(request.body);
// }
router.get('/', checkJwt, checkScopes, defaultGetResponse);

// ┬ ┬┌─┐┌─┐┬─┐
// │ │└─┐├┤ ├┬┘
// └─┘└─┘└─┘┴└─

router.get('/users', checkJwt, checkScopes, getUsers);
// get user by id
router.get('/users/:userId([0-9]+)', checkJwt, checkScopes, getUser);

// ┬ ┬┌─┐┌─┐┬─┐  ┌─┐┌─┐┌─┐┌┬┐
// │ │└─┐├┤ ├┬┘  └─┐├─┘│ │ │
// └─┘└─┘└─┘┴└─  └─┘┴  └─┘ ┴
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

// ┌─┐┌─┐┬  ┬  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
// │  │ ││  │  ├┤ │   │ ││ ││││
// └─┘└─┘┴─┘┴─┘└─┘└─┘ ┴ ┴└─┘┘└┘

router.get(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)',
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
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)',
  checkJwt,
  checkScopes,
  postCollection,
);

router.put(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)',
  checkJwt,
  checkScopes,
  checkUserAndSpot,
  collectionCheck,
  putCollectionItem,
);

router.delete(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)',
  checkJwt,
  checkScopes,
  deleteCollectionSubItem,
);

// Model Reports

// router.get(
//   '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/report',
//   checkJwt,
//   checkScopes,
//   checkUserAndSpot,
//   getModelReport,
// );

// ╦ ╦╔═╗╦  ╔═╗╔═╗╔╦╗
// ║ ║╠═╝║  ║ ║╠═╣ ║║
// ╚═╝╩  ╩═╝╚═╝╩ ╩═╩╝
// ┌─┐┌─┐┬  ┬  ┌─┐┌─┐┌┬┐┬┌─┐┌┐┌
// │  │ ││  │  ├┤ │   │ ││ ││││
// └─┘└─┘┴─┘┴─┘└─┘└─┘ ┴ ┴└─┘┘└┘
const ul = upload(s3);
router.post(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/upload/',
  checkJwt,
  checkScopes,
  postFileMiddleWare,
  ul.single('upload'),
  postFile,
);

router.post(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:modelId([0-9]+)/upload/rmodel/',
  checkJwt,
  checkScopes,
  postFileMiddleWare,
  ul.single('upload'),
  postFile,
);

router.post(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:modelId([0-9]+)/upload/plot/',
  checkJwt,
  checkScopes,
  postFileMiddleWare,
  ul.single('upload'),
  postPlot,
);
//  ╦ ╦╔═╗╔═╗╦═╗
//  ║ ║╚═╗║╣ ╠╦╝
//  ╚═╝╚═╝╚═╝╩╚═

router.post('/users', checkJwt, checkScopes, postUser);
// update user
router.put('/users/:userId([0-9]+)', checkJwt, checkScopes, updateUser);
// delete user
router.delete('/users/:userId([0-9]+)', checkJwt, checkScopes, deleteUser);

// ┌─┐┌─┐┌─┐┌┬┐
// └─┐├─┘│ │ │
// └─┘┴  └─┘ ┴
// ┌─┐┬ ┬┌┐ ┬  ┬┌─┐
// ├─┘│ │├┴┐│  ││
// ┴  └─┘└─┘┴─┘┴└─┘
// get all bathingspots PUBLIC
router.get('/bathingspots', getBathingspots);

router.get('/bathingspots/:id([0-9]+)', getSingleBathingspot);

router.get('/bathingspots/:region([a-z]+)', getBathingspotsByRegion);

router.get('/regions', getAllRegions);
router.get('/regions/:regionId([0-9]+)', getRegionById);

// ┬─┐┌─┐┌─┐┬┌─┐┌┐┌┌─┐
// ├┬┘├┤ │ ┬││ ││││└─┐
// ┴└─└─┘└─┘┴└─┘┘└┘└─┘
router.post('/regions', checkJwt, checkScopes, postRegion);
router.put('/regions/:regionId([0-9]+)', checkJwt, checkScopes, putRegion);
router.delete(
  '/regions/:regionId([0-9]+)',
  checkJwt,
  checkScopes,
  deleteRegion,
);

export default router;
