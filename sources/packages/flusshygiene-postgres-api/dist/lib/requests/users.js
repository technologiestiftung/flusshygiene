"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_interfaces_1 = require("../types-interfaces");
const User_1 = require("../../orm/entity/User");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const response_builders_1 = require("./response-builders");
exports.getUsers = async (_request, response) => {
    let users;
    try {
        users = await typeorm_1.getRepository(User_1.User).find();
        response_builders_1.responder(response, types_interfaces_1.HttpCodes.success, users);
        // response.status(HttpCodes.success).json(users);
    }
    catch (e) {
        response_builders_1.responder(response, types_interfaces_1.HttpCodes.internalError, response_builders_1.errorResponse(e));
    }
};
exports.getUser = async (request, response) => {
    let user;
    try {
        if (request.params.id === undefined) {
            response_builders_1.responderMissingId(response);
            // throw new Error('mssing id paramter');
        }
        user = await typeorm_1.getRepository(User_1.User).findOne(request.params.id);
        if (user === undefined) {
            response_builders_1.responderWrongId(response, request.params.id);
        }
        else {
            response_builders_1.responder(response, types_interfaces_1.HttpCodes.success, [user]);
        }
    }
    catch (e) {
        response_builders_1.responder(response, types_interfaces_1.HttpCodes.internalError, response_builders_1.errorResponse(e));
    }
};
exports.addUser = async (request, response) => {
    const user = new User_1.User();
    try {
        if (request.body.role === undefined) {
            response_builders_1.responderMissingBodyValue(response, 'User "role" is not defined');
        }
        if (!(request.body.role in types_interfaces_1.UserRole)) {
            const types = Object.values(types_interfaces_1.UserRole).filter((v) => typeof v === 'string');
            response_builders_1.responderMissingBodyValue(response, `User "role" is none of type: ${types}`);
        }
        if (request.body.firstName === undefined) {
            response_builders_1.responderMissingBodyValue(response, 'User "firstName" is not defined');
        }
        if (request.body.lastName === undefined) {
            response_builders_1.responderMissingBodyValue(response, 'User "lastName" is not defined');
        }
        if (request.body.email === undefined) {
            response_builders_1.responderMissingBodyValue(response, 'User "email" is not defined');
        }
        user.firstName = request.body.firstName;
        user.lastName = request.body.lastName;
        user.role = request.body.role;
        user.email = request.body.email;
        const errors = await class_validator_1.validate(user);
        if (errors.length > 0) {
            throw new Error(`User validation failed ${JSON.stringify(errors)}`);
        }
        // could also be the below create event
        // but then we can't do the validation beforehand
        // const res = await getRepository(User).create(request.body);
        const res = await typeorm_1.getRepository(User_1.User).save(user); // .save(user);
        response_builders_1.responderSuccessCreated(response, 'User was created', res);
        // response.status(201).json(successResponse('User was created'));
    }
    catch (e) {
        response_builders_1.responder(response, types_interfaces_1.HttpCodes.internalError, response_builders_1.errorResponse(e));
        // response.status(HttpCodes.internalError).json(errorResponse(e));
    }
};
exports.updateUser = async (request, response) => {
    try {
        if (request.params.id === undefined) {
            response_builders_1.responderMissingId(response);
            // responder(
            //   response,
            //   HttpCodes.badRequest,
            //   errorResponse(new Error('Missing ID paramter'))
            // );
            // throw new Error('Missing id paramater');
        }
        const user = await typeorm_1.getRepository(User_1.User).findOne(request.params.id);
        if (user === undefined) {
            response_builders_1.responderWrongId(response, request.params.id);
        }
        else {
            const userRepository = typeorm_1.getRepository(User_1.User);
            userRepository.merge(user, request.body);
            userRepository.save(user);
            response_builders_1.responderSuccessCreated(response, 'updated user');
        }
    }
    catch (e) {
        response.status(types_interfaces_1.HttpCodes.internalError).json(response_builders_1.errorResponse(e));
    }
};
exports.deleteUser = async (request, response) => {
    try {
        // console.log('req id value',request.params.id);
        // if (request.params.hasOwnProperty('id') === false) {
        //   // throw new Error('Missing id paramter');
        //   responderMissingId(response);
        //   // responder(
        //   //   response,
        //   //   HttpCodes.badRequest,
        //   //   errorResponse(new Error('Missing ID paramter'))
        //   // );
        // }
        const user = await typeorm_1.getRepository(User_1.User).findOne(request.params.id);
        if (user === undefined) {
            response_builders_1.responderWrongId(response, request.params.id);
            // responder(
            //   response,
            //   HttpCodes.badRequestNotFound,
            //   userIDErrorResponse(request.params.id)
            // );
        }
        else {
            await typeorm_1.getRepository(User_1.User).remove(user);
        }
        response_builders_1.responderSuccess(response, 'deleted user');
        // responder(
        //   response,
        //   HttpCodes.success,
        //   successResponse('deleted user')
        // );
        // response.status(HttpCodes.success).json(successResponse('deleted user'));
    }
    catch (e) {
        response_builders_1.responder(response, types_interfaces_1.HttpCodes.internalError, response_builders_1.errorResponse(e));
        // response.status(HttpCodes.internalError).json(errorResponse(e));
    }
};
