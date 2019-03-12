"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultResponsePayload = { success: true };
exports.defaultPostResponse = async (_request, response) => {
    response.status(201).json(defaultResponsePayload);
};
exports.defaultGetResponse = async (_request, response) => {
    response.status(200).json(defaultResponsePayload);
};
