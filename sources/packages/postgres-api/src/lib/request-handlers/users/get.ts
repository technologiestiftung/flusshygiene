import { getRepository } from 'typeorm';
import { User } from '../../../orm/entity/User';
import { getResponse, HttpCodes } from '../../common';
import { SUCCESS } from '../../messages';
import { getUserByAuth0id } from '../../utils/user-repo-helpers';
import {
  errorResponse,
  responder,
  responderWrongIdOrSuccess,
  successResponse,
} from '../responders';

//  ██████╗ ███████╗████████╗
// ██╔════╝ ██╔════╝╚══██╔══╝
// ██║  ███╗█████╗     ██║
// ██║   ██║██╔══╝     ██║
// ╚██████╔╝███████╗   ██║
//  ╚═════╝ ╚══════╝   ╚═╝

export const getUsers: getResponse = async (request, response) => {
  try {
    let users: User[];
    if (request.query.auth0Id === undefined) {
      users = await getRepository(User).find();
    } else {
      const user = await getUserByAuth0id(request.query.auth0Id);
      users = user === undefined ? [] : [user];
    }
    responder(
      response,
      HttpCodes.success,
      successResponse(SUCCESS.success200, users),
    );

    // response.status(HttpCodes.success).json(users);
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
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
