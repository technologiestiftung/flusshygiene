"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const bathingspots_1 = require("./requests/bathingspots");
// import { defaultGetResponse, defaultPostResponse } from './requests/default-requests';
const users_1 = require("./requests/users");
const router = express_promise_router_1.default();
// router.get('/read/:id', defaultGetResponse);
// router.post('/write', defaultPostResponse);
// router.post('/patch/:id', defaultPostResponse);
// router.post('/remove/:id', defaultPostResponse);
// router.get('/find', defaultGetResponse);
//  U S E R S
// get all users
router.get('/users', users_1.getUsers);
// get user by id
router.get('/users/:userId([0-9]+)', users_1.getUser);
router.get('/users/:userId([0-9]+)/bathingspots', users_1.getUserBathingspots);
router.get('/users/:userId([0-9]+)/bathingspots/:spotId([0-9]+)', users_1.getUserBathingspot);
// add new user
router.post('/users', users_1.addUser);
// update user
router.put('/users/:userId([0-9]+)', users_1.updateUser);
// delete user
router.delete('/users/:userId([0-9]+)', users_1.deleteUser);
// get all bathingspots
router.get('/bathingspots', bathingspots_1.getBathingspots);
router.get('/bathingspots/:id([0-9]+)', bathingspots_1.getBathingspot);
exports.default = router;
