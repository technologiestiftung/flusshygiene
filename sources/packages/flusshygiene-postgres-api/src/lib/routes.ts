import Router from 'express-promise-router';
import { getRegionById } from './request-handlers/regions/index';
// import { defaultGetResponse, defaultPostResponse } from './request-handlers/default-requests';
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from './request-handlers/users/';

import {
  addBathingspotToUser,
  deleteBathingspotOfUser,
  getOneUserBathingspotById,
  getUserBathingspots,
  updateBathingspotOfUser,
} from './request-handlers/users/bathingspots/';

import {
  getBathingspots,
  getSingleBathingspot,
} from './request-handlers/bathingspots';
import { getBathingspotsByRegion } from './request-handlers/bathingspots/get';
import { deleteRegion, getAllRegions, postRegion, putRegion } from './request-handlers/regions';
import { getOneUsersBathingspotsByRegion } from './request-handlers/users/bathingspots/get';

const router = Router();

router.get('/users', getUsers);
// get user by id
router.get('/users/:userId([0-9]+)', getUser);

router.get('/users/:userId([0-9]+)/bathingspots', getUserBathingspots);

router.get('/users/:userId([0-9]+)/bathingspots/:region([a-z]+)', getOneUsersBathingspotsByRegion);

router.get('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)', getOneUserBathingspotById);

// add new spot to user

router.post('/users/:userId([0-9]+)/bathingspots', addBathingspotToUser);
// add new user

router.put('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)', updateBathingspotOfUser);

router.delete('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)', deleteBathingspotOfUser);
// add new user

router.post('/users', addUser);
// update user
router.put('/users/:userId([0-9]+)', updateUser);
// delete user
router.delete('/users/:userId([0-9]+)', deleteUser);

// get all bathingspots
router.get('/bathingspots', getBathingspots);

router.get('/bathingspots/:id([0-9]+)', getSingleBathingspot);

router.get('/bathingspots/:region([a-z]+)', getBathingspotsByRegion);

router.get('/regions', getAllRegions);
router.get('/regions/:regionId([0-9]+)', getRegionById);

router.post('/regions', postRegion);
router.put('/regions/:regionId([0-9]+)', putRegion);
router.delete('/regions/:regionId([0-9]+)', deleteRegion);

export default router;
