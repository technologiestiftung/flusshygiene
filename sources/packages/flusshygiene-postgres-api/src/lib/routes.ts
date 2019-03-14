import Router from 'express-promise-router';
// import { defaultGetResponse, defaultPostResponse } from './request-handlers/default-requests';
import {
  getUser,
  getUsers,
  addUser,
  updateUser,
  deleteUser,
  getUserBathingspots,
  getOneUserBathingspotById,
  addBathingspotToUser
} from './request-handlers/users/';
import { getBathingspot, getBathingspots } from './request-handlers/bathingspots';

const router = Router();


router.get('/users', getUsers);
// get user by id
router.get('/users/:userId([0-9]+)', getUser);

router.get('/users/:userId([0-9]+)/bathingspots', getUserBathingspots);

router.get('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)', getOneUserBathingspotById);

// add new spot to user

router.post('/users/:userId([0-9]+)/bathingspots', addBathingspotToUser);
// add new user
router.post('/users', addUser);
// update user
router.put('/users/:userId([0-9]+)', updateUser);
// delete user
router.delete('/users/:userId([0-9]+)', deleteUser)

// get all bathingspots
router.get('/bathingspots', getBathingspots);

router.get('/bathingspots/:id([0-9]+)', getBathingspot);

export default router;
