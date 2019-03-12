"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_interfaces_1 = require("../types-interfaces");
exports.userIDErrorResponse = (val) => {
    if (val === undefined) {
        val = 'NULL';
    }
    let msg = `request received but user with id: "${val}" does not exist`;
    if (typeof val === 'string') {
        msg = val;
    }
    const res = {
        success: false,
        message: msg,
    };
    return res;
};
exports.errorResponse = (error) => {
    if (process.env.NODE_ENV === 'development') {
        throw error;
    }
    const res = {
        success: false,
        message: process.env.NODE_ENV === 'development' ? error.message : 'internal server error'
    };
    return res;
};
exports.successResponse = (message, data) => {
    const res = {
        success: true,
        message: message,
        data: data
    };
    return res;
};
exports.responder = (response, statusCode, payload) => {
    response.status(statusCode).json(payload);
};
exports.responderMissingBodyValue = (response, message) => {
    return exports.responder(response, types_interfaces_1.HttpCodes.badRequest, exports.errorResponse(new Error(message)));
};
exports.responderSuccess = (response, message) => {
    return exports.responder(response, types_interfaces_1.HttpCodes.success, exports.successResponse(message));
};
exports.responderSuccessCreated = (response, message, data) => {
    return exports.responder(response, types_interfaces_1.HttpCodes.successCreated, exports.successResponse(message, data));
};
exports.responderMissingId = (response) => {
    return exports.responder(response, types_interfaces_1.HttpCodes.badRequest, exports.userIDErrorResponse());
};
exports.responderWrongId = (response, id) => {
    if (typeof id === 'number') {
        return exports.responder(response, types_interfaces_1.HttpCodes.badRequestNotFound, exports.userIDErrorResponse(id));
    }
    else {
        return;
    }
};
