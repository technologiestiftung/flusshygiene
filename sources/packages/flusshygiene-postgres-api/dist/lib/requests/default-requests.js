"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_interfaces_1 = require("../types-interfaces");
const defaultResponsePayload = { success: true };
exports.defaultPostResponse = async (_request, response) => {
    response.status(201).json(defaultResponsePayload);
};
exports.defaultGetResponse = async (_request, response) => {
    response.status(200).json(defaultResponsePayload);
};
exports.wrongRoute = async (error, _request, response) => {
    response.status(types_interfaces_1.HttpCodes.badRequestNotFound).json(error);
};
