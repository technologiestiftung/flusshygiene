"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIDErrorResponse = (id) => {
    const res = {
        success: true,
        message: `requst received but user with id: "${id}" does not exist`,
    };
    return res;
};
exports.errorResponse = (error) => {
    const res = {
        success: false,
        message: process.env.NODE_ENV === 'development' ? error.message : 'internal server error'
    };
    return res;
};
exports.successResponse = (message) => {
    const res = {
        success: true,
        message: message
    };
    return res;
};
