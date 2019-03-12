"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const bathingspots_1 = require("./requests/bathingspots");
const default_requests_1 = require("./requests/default-requests");
const users_1 = require("./requests/users");
const router = express_promise_router_1.default();
router.get('/read/:id', default_requests_1.defaultGetResponse);
router.post('/write', default_requests_1.defaultPostResponse);
router.post('/patch/:id', default_requests_1.defaultPostResponse);
router.post('/remove/:id', default_requests_1.defaultPostResponse);
router.get('/find', default_requests_1.defaultGetResponse);
//  U S E R S
// get all users
router.get('/users', users_1.getUsers);
// add new user
router.post('/users', users_1.addUser);
// get user by id
router.get('/users/:id([0-9]+)', users_1.getUser);
// update user
router.put('/users/:id([0-9]+)', users_1.updateUser);
// delete user
router.delete('/users/:id([0-9]+)', users_1.deleteUser);
// get all bathingspots
router.get('/bathingspots', bathingspots_1.getBathingspots);
router.get('/bathingspots/:id([0-9]+)', bathingspots_1.getBathingspot);
exports.default = router;
