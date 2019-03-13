import Router from 'express-promise-router';
import { getBathingspots, getBathingspot } from './requests/bathingspots';
// import { defaultGetResponse, defaultPostResponse } from './requests/default-requests';
import { getUsers, getUser, addUser, updateUser, deleteUser, getUserBathingspots, getOneUserBathingspotById } from './requests/users';

const router = Router();


// router.get('/read/:id', defaultGetResponse);

// router.post('/write', defaultPostResponse);

// router.post('/patch/:id', defaultPostResponse);

// router.post('/remove/:id', defaultPostResponse);


// router.get('/find', defaultGetResponse);

//  U S E R S
// get all users

router.get('/users', getUsers);
// get user by id
router.get('/users/:userId([0-9]+)', getUser);

router.get('/users/:userId([0-9]+)/bathingspots', getUserBathingspots);
router.get('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)', getOneUserBathingspotById);
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
