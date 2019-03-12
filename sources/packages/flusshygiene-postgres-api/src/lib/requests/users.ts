import { getResponse, HttpCodes, postResponse, UserRole, putResponse, deleteResponse } from '../types-interfaces';
import { User } from '../../orm/entity/User';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { errorResponse, userIDErrorResponse, successResponse } from './response-builders';

export const getUsers: getResponse = async (_request, response) => {
  let users: User[];

  try {
    users = await getRepository(User).find();
    response.status(HttpCodes.success).json(users);
  } catch (e) {

    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
}



export const getUser: getResponse = async (request, response) => {
  let user: User | undefined;
  try {
    if (request.params.id === undefined) {
      throw new Error('mssing id paramter');
    }
    user = await getRepository(User).findOne(request.params.id);
    if (user === undefined) {
      response.status(HttpCodes.badRequest).json(userIDErrorResponse(request.params.id));
    } else {
      response.status(HttpCodes.success).json([user]);
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
}



export const addUser: postResponse = async (request, response) => {
  const user: User = new User();
  try {
    if (request.body.role === undefined) {
      throw Error('User "role" is not defined');
    }
    if (!(request.body.role in UserRole)) {
      const types = Object.values(UserRole).filter((v: any) => typeof v === 'string');
      throw Error(`User "role" is none of type: ${types}`);
    }

    if (request.body.firstName === undefined) {
      throw Error('User "firstName" is not defined');
    }
    if (request.body.firstName === undefined) {
      throw Error('User "lastName" is not defined');
    }
    if (request.body.email === undefined) {
      throw Error('User "email" is not defined');
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
    await getRepository(User).save(user);// .save(user);
    response.status(201).json(successResponse('User was created'));
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
}


export const updateUser: putResponse = async (request, response) => {
  try {
    if (request.params.id === undefined) {
      throw new Error('Missing id paramater');
    }
    const user: User | undefined = await getRepository(User).findOne(request.params.id);
    if (user === undefined) {
      response.status(HttpCodes.badRequest).json(userIDErrorResponse(request.params.id));
    } else {
      const userRepository = getRepository(User);
      userRepository.merge(user, request.body);
      userRepository.save(user);
      response.status(HttpCodes.successCreated).json(successResponse('updated user'));
    }
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
};


export const deleteUser: deleteResponse = async (request, response) => {
  try {
    if (request.params.id === undefined) {
      throw new Error('Missing id paramter');
    }
    const user = await getRepository(User).findOne(request.params.id);
    if (user === undefined) {
      response.status(HttpCodes.badRequest).json(userIDErrorResponse(request.params.id));
    } else {
      await getRepository(User).remove(user);
    }
    response.status(HttpCodes.success).json(successResponse('deleted user'));
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }

}
