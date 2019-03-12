"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./../../orm/entity/User");
const types_interfaces_1 = require("../types-interfaces");
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
        if (request.params.userId === undefined) {
            response_builders_1.responderMissingId(response);
            // throw new Error('mssing id paramter');
        }
        user = await typeorm_1.getRepository(User_1.User).findOne(request.params.userId);
        if (user === undefined) {
            response_builders_1.responderWrongId(response, request.params.userId);
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
        if (request.params.userId === undefined) {
            response_builders_1.responderMissingId(response);
            // responder(
            //   response,
            //   HttpCodes.badRequest,
            //   errorResponse(new Error('Missing ID paramter'))
            // );
            // throw new Error('Missing id paramater');
        }
        const user = await typeorm_1.getRepository(User_1.User).findOne(request.params.userId);
        if (user === undefined) {
            response_builders_1.responderWrongId(response, request.params.userId);
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
        // console.log('req id value',request.params.userId);
        // if (request.params.hasOwnProperty('id') === false) {
        //   // throw new Error('Missing id paramter');
        //   responderMissingId(response);
        //   // responder(
        //   //   response,
        //   //   HttpCodes.badRequest,
        //   //   errorResponse(new Error('Missing ID paramter'))
        //   // );
        // }
        const user = await typeorm_1.getRepository(User_1.User).findOne(request.params.userId, { relations: ['bathingspots'] });
        if (user === undefined) {
            response_builders_1.responderWrongId(response, request.params.userId);
            // responder(
            //   response,
            //   HttpCodes.badRequestNotFound,
            //   userIDErrorResponse(request.params.userId)
            // );
        }
        else {
            if (user.protected === true) {
                response_builders_1.responder(response, types_interfaces_1.HttpCodes.badRequestForbidden, response_builders_1.errorResponse(new Error('You cannot delete a protected User')));
            }
            else {
                if (user.bathingspots.length !== 0) {
                    const protectedUser = await typeorm_1.getRepository(User_1.User).findOne({ where: { protected: true }, relations: ['bathingspots'] });
                    if (protectedUser === undefined) {
                        throw new Error('No protected user found!');
                    }
                    else {
                        const spots = [];
                        user.bathingspots.forEach((spot) => {
                            // we must retain all the public bathingspots
                            // or not?
                            if (spot.isPublic === true) {
                                spot.isPublic = false; // keep them for moderation
                                spots.push(spot);
                            }
                        });
                        protectedUser.bathingspots = protectedUser.bathingspots.concat(spots);
                        const manager = typeorm_1.getManager();
                        const res = await manager.save(protectedUser);
                        if (process.env.NODE_ENV === 'development') {
                            process.stdout.write(JSON.stringify(res));
                            process.stdout.write('\n');
                        }
                    }
                }
                await typeorm_1.getRepository(User_1.User).remove(user);
                response_builders_1.responderSuccess(response, 'deleted user');
            }
        }
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
/**
 * Gets single bathingspot of user by id
 * @param request
 * @param response
 */
exports.getUserBathingspot = async (request, response) => {
    try {
        const user = await typeorm_1.getRepository(User_1.User).findOne(request.params.userId, { relations: ['bathingspots'] });
        if (user === undefined) {
            // throw new Error('user undefined or 0');
            response_builders_1.responderWrongId(response, request.params.userId);
        }
        else {
            console.log(user.bathingspots);
            const spots = user.bathingspots.filter(spot => spot.id === parseInt(request.params.spotId, 10));
            response_builders_1.responder(response, types_interfaces_1.HttpCodes.success, spots);
        }
    }
    catch (e) {
        response_builders_1.responder(response, types_interfaces_1.HttpCodes.internalError, response_builders_1.errorResponse(e));
    }
};
/**
 * Gets all the bathingspots of the user
 * @param request
 * @param response
 */
exports.getUserBathingspots = async (request, response) => {
    try {
        const user = await typeorm_1.getRepository(User_1.User).findOne(request.params.userId, { relations: ['bathingspots'] });
        if (user === undefined) {
            // throw new Error('user undefined or 0');
            response_builders_1.responderWrongId(response, request.params.userId);
        }
        else {
            response_builders_1.responder(response, types_interfaces_1.HttpCodes.success, user.bathingspots);
        }
    }
    catch (e) {
        response_builders_1.responder(response, types_interfaces_1.HttpCodes.internalError, response_builders_1.errorResponse(e));
    }
};
