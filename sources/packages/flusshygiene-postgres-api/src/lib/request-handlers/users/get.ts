import { getRepository } from 'typeorm';
import { User } from '../../../orm/entity/User';
import { SUCCESS } from '../../messages';
import { getResponse, HttpCodes } from '../../types-interfaces';
import { errorResponse, responder, responderWrongId, successResponse } from '../responders';

//  ██████╗ ███████╗████████╗
// ██╔════╝ ██╔════╝╚══██╔══╝
// ██║  ███╗█████╗     ██║
// ██║   ██║██╔══╝     ██║
// ╚██████╔╝███████╗   ██║
//  ╚═════╝ ╚══════╝   ╚═╝

export const getUsers: getResponse = async (_request, response) => {
  let users: User[];

  try {
    users = await getRepository(User).find();
    responder(
      response,
      HttpCodes.success,
      successResponse(SUCCESS.success200, users));

    // response.status(HttpCodes.success).json(users);
  } catch (e) {
    responder(response,
      HttpCodes.internalError,
      errorResponse(e));

  }
};

export const getUser: getResponse = async (request, response) => {
  let user: User | undefined;
  try {

    user = await getRepository(User).findOne(request.params.userId);
    if (user === undefined) {
      responderWrongId(response);

    } else {
      responder(
        response,
        HttpCodes.success,
        successResponse(SUCCESS.success200, [user]));
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};
