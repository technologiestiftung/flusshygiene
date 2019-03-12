import Router from 'express-promise-router';
import { getPublicBathingspots } from './requests/pg-requests';
import { defaultGetResponse, defaultPostResponse } from './requests/default-requests';
import { getUsers, getUser, addUser, updateUser, deleteUser } from './requests/users';

const router = Router();


router.get('/read/:id', defaultGetResponse);

router.post('/write', defaultPostResponse);

router.post('/patch/:id', defaultPostResponse);

router.post('/remove/:id', defaultPostResponse);


router.get('/find', defaultGetResponse);

//  U S E R S
// get all users
router.get('/users', getUsers);
// add new user
router.post('/users', addUser);
// get user by id
router.get('/users/:id([0-9]+)', getUser);
// update user
router.put('/users/:id([0-9]+)', updateUser);
// delete user
router.delete('/users/:id([0-9]+)', deleteUser)
// get all bathingspots
router.get('/find/publicbathingspots', getPublicBathingspots);


export default router;
