"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const typeorm_1 = require("typeorm");
const User_1 = require("../orm/entity/User");
const router = express_promise_router_1.default();
;
const defaultPostResponse = async (_request, response) => {
    response.status(201).json(defaultResponsePayload);
};
const defaultGetResponse = async (request, response) => {
    response.status(200).json(request.body);
};
const getUsers = async (_request, response) => {
    let users;
    try {
        users = await typeorm_1.getRepository(User_1.User, 'getuser').find();
        response.json(users);
    }
    catch (e) {
        const res = {
            success: false,
            message: e.message
        };
        response.json(res);
    }
};
const defaultResponsePayload = { success: true };
router.get('/read/:id', defaultGetResponse);
router.post('/write', defaultPostResponse);
router.post('/patch/:id', defaultPostResponse);
router.post('/remove/:id', defaultPostResponse);
router.post('/find', defaultPostResponse);
router.post('/find/users', getUsers);
// subClient.subscribe('read');
// subClient.subscribe('write');
exports.default = router;
