"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
;
const defaultPostResponse = (_request, response) => {
    response.status(201).json(defaultResponsePayload);
};
const defaultGetResponse = (request, response) => {
    response.status(200).json(request.body);
};
const defaultResponsePayload = { success: true };
router.get('/read/:id', defaultGetResponse);
router.post('/write', defaultPostResponse);
router.post('/patch/:id', defaultPostResponse);
router.post('/remove/:id', defaultPostResponse);
router.post('/find', defaultPostResponse);
// subClient.subscribe('read');
// subClient.subscribe('write');
exports.default = router;
