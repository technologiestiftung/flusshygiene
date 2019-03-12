import { getResponse, HttpCodes, postResponse, UserRole, putResponse, deleteResponse } from '../types-interfaces';
import { User } from '../../orm/entity/User';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { errorResponse, responder, responderMissingId, responderWrongId, responderSuccess, responderSuccessCreated, responderMissingBodyValue } from './response-builders';

export const getUsers: getResponse = async (_request, response) => {
  let users: User[];

  try {
    users = await getRepository(User).find();
    responder(response, HttpCodes.success, users);

    // response.status(HttpCodes.success).json(users);
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));


  }
}

export const getUser: getResponse = async (request, response) => {
  let user: User | undefined;
  try {
    if (request.params.id === undefined) {
      responderMissingId(response);
      // throw new Error('mssing id paramter');
    }
    user = await getRepository(User).findOne(request.params.id);
    if (user === undefined) {
      responderWrongId(response, request.params.id);

    } else {
    responder(response, HttpCodes.success, [user]);
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
}



export const addUser: postResponse = async (request, response) => {
  const user: User = new User();
  try {
    if (request.body.role === undefined) {
      responderMissingBodyValue(response, 'User "role" is not defined');
    }
    if (!(request.body.role in UserRole)) {
      const types = Object.values(UserRole).filter((v: any) => typeof v === 'string');
      responderMissingBodyValue(response, `User "role" is none of type: ${types}`);
    }

    if (request.body.firstName === undefined) {
      responderMissingBodyValue(response, 'User "firstName" is not defined');
    }
    if (request.body.lastName === undefined) {
      responderMissingBodyValue(response, 'User "lastName" is not defined');
    }
    if (request.body.email === undefined) {
      responderMissingBodyValue(response, 'User "email" is not defined');
    }
    user.firstName = request.body.firstName;
    user.lastName = request.body.lastName;
    user.role = request.body.role;
    user.email = request.body.email;
    const errors = await validate(user);
    if (errors.length > 0) {
      throw new Error(`User validation failed ${JSON.stringify(errors)}`)
    }
    // could also be the below create event
    // but then we can't do the validation beforehand
    // const res = await getRepository(User).create(request.body);
    const res = await getRepository(User).save(user);// .save(user);
    responderSuccessCreated(response, 'User was created', res);
    // response.status(201).json(successResponse('User was created'));
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));

    // response.status(HttpCodes.internalError).json(errorResponse(e));
  }
}


export const updateUser: putResponse = async (request, response) => {
  try {
    if (request.params.id === undefined) {
      responderMissingId(response);
      // responder(
      //   response,
      //   HttpCodes.badRequest,
      //   errorResponse(new Error('Missing ID paramter'))
      // );
      // throw new Error('Missing id paramater');
    }
    const user: User | undefined = await getRepository(User).findOne(request.params.id);
    if (user === undefined) {

      responderWrongId(response, request.params.id);

    } else {
      const userRepository = getRepository(User);
      userRepository.merge(user, request.body);
      userRepository.save(user);
      responderSuccessCreated(response, 'updated user');
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};


export const deleteUser: deleteResponse = async (request, response) => {
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
    const user = await getRepository(User).findOne(request.params.id);
    if (user === undefined) {
      responderWrongId(response, request.params.id);

      // responder(
      //   response,
      //   HttpCodes.badRequestNotFound,
      //   userIDErrorResponse(request.params.id)
      // );
    } else {
      await getRepository(User).remove(user);
    }
    responderSuccess(response,'deleted user');

    // responder(
    //   response,
    //   HttpCodes.success,
    //   successResponse('deleted user')
    // );
    // response.status(HttpCodes.success).json(successResponse('deleted user'));
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
    // response.status(HttpCodes.internalError).json(errorResponse(e));
  }

}
