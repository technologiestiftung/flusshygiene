import { getRepository } from 'typeorm';
import { User } from '../../../orm/entity/User';
import { SUCCESS } from '../../messages';
import { getResponse, HttpCodes } from '../../common';
import { errorResponse, responder, responderWrongIdOrSuccess, successResponse } from '../responders';
import { getUserByAuth0id } from '../../utils/user-repo-helpers';

//  ██████╗ ███████╗████████╗
// ██╔════╝ ██╔════╝╚══██╔══╝
// ██║  ███╗█████╗     ██║
// ██║   ██║██╔══╝     ██║
// ╚██████╔╝███████╗   ██║
//  ╚═════╝ ╚══════╝   ╚═╝

export const getUsers: getResponse = async (request, response) => {
  try {
  let users: User[];
    if(request.query.auth0Id === undefined){
      users = await getRepository(User).find();
    }else{
      const user = await getUserByAuth0id(request.query.auth0Id);
      users = user === undefined ? [] : [user];
    }
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
    // if(request.query.auth0id === undefined){
      user = await getRepository(User).findOne(request.params.userId);
    // }else{
      // console.log(request.query.auth0id);
      // user = await getUserByAuth0id(request.query.auth0id);
    // }
    responderWrongIdOrSuccess(user, response);
    // if (user === undefined) {
    //   responderWrongId(response);

    // } else {
    //   responder(
    //     response,
    //     HttpCodes.success,
    //     successResponse(SUCCESS.success200, [user]));
    // }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
};
