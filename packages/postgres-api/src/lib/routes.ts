import jwtAuthz from 'express-jwt-authz';
import Router from 'express-promise-router';
import { checkJwt } from './auth';

import {
  addBathingspotToUser,
  deleteBathingspotOfUser,
  getOneUserBathingspotById,
  getUserBathingspots,
  updateBathingspotOfUser,
} from './request-handlers/bathingspots/';

import {
  deleteCollectionItem,
  deleteSubItemMeasurement,
} from './request-handlers/bathingspots/collections/delete';
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
import {
  getOneUsersBathingspotsByRegion,
  getSpotsCount,
} from './request-handlers/bathingspots/get';

import { defaultGetResponse } from './request-handlers/defaults';
import {
  deleteRegion,
  postRegion,
  putRegion,
} from './request-handlers/regions';
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
import {
  putCollectionItem,
  putCollectionSubItem,
} from './request-handlers/bathingspots/collections/put';
import { checkUserAndSpot, checkUser } from './middleware/user-spot-check';
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
  '/users/:userId([0-9]+)/bathingspots/count',
  checkJwt,
  checkScopes,
  checkUser,
  getSpotsCount,
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
  checkUserAndSpot,
  collectionCheck,
  getCollectionsSubItem,
);

router.post(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)',
  checkJwt,
  checkScopes,
  checkUserAndSpot,
  postCollection,
);

// get subitems of collection
router.get(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/measurements',
  checkJwt,
  checkScopes,
  checkUserAndSpot,
  collectionCheck,
  getGenericInputMeasurements,
);

// get subitems of collection
router.get(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/measurements/:subItemId([0-9]+)',
  checkJwt,
  checkScopes,
  checkUserAndSpot,
  collectionCheck,
  getGenericInputMeasurements,
);

// delete subitems of collection
router.delete(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/measurements/:subItemId([0-9]+)',
  checkJwt,
  checkScopes,
  checkUserAndSpot,
  collectionCheck,
  deleteSubItemMeasurement,
);

router.post(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/measurements',
  checkJwt,
  checkScopes,
  checkUserAndSpot,
  collectionCheck,
  postCollectionsSubItem,
);

router.put(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)',
  checkJwt,
  checkScopes,
  checkUserAndSpot,
  collectionCheck,
  putCollectionItem,
);

router.put(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)/measurements/:subItemId([0-9])+',
  checkJwt,
  checkScopes,
  checkUserAndSpot,
  collectionCheck,
  putCollectionSubItem,
);

router.delete(
  '/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)/:collectionName([A-Za-z]+)/:itemId([0-9]+)',
  checkJwt,
  checkScopes,
  checkUserAndSpot,
  collectionCheck,
  deleteCollectionItem,
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
