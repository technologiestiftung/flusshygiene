import { postResponse, UserRole, HttpCodes } from '../../types-interfaces';
import { User } from '../../../orm/entity/User';
import { responderMissingBodyValue, responderSuccessCreated, responder, errorResponse, } from '../responders';
import { validate } from 'class-validator';
import { getRepository } from 'typeorm';
import { getEntityFields } from '../../utils/get-entity-fields';

//  █████╗ ██████╗ ██████╗
// ██╔══██╗██╔══██╗██╔══██╗
// ███████║██║  ██║██║  ██║
// ██╔══██║██║  ██║██║  ██║
// ██║  ██║██████╔╝██████╔╝
// ╚═╝  ╚═╝╚═════╝ ╚═════╝



export const addUser: postResponse = async (request, response) => {
  const user: User = new User();
  try {
    const example = await getEntityFields('User');
    if (request.body.role === undefined) {
      responderMissingBodyValue(response, example);
    }
    if (!(request.body.role in UserRole)) {
      responderMissingBodyValue(response, example);
    }

    if (request.body.firstName === undefined) {
      responderMissingBodyValue(response, example);
    }
    if (request.body.lastName === undefined) {
      responderMissingBodyValue(response, example);
    }
    if (request.body.email === undefined) {
      responderMissingBodyValue(response, example);
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
