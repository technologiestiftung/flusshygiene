import { User } from './../../orm/entity/User';
import { Bathingspot } from './../../orm/entity/Bathingspot';
import { getResponse, HttpCodes, postResponse, UserRole, putResponse, deleteResponse } from '../types-interfaces';
import { getRepository, getManager } from 'typeorm';
import { validate } from 'class-validator';
import { errorResponse, responder, responderMissingId, responderWrongId, responderSuccess, responderSuccessCreated, responderMissingBodyValue, successResponse } from './response-builders';

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
    if (request.params.userId === undefined) {
      responderMissingId(response);
      // throw new Error('mssing id paramter');
    }
    user = await getRepository(User).findOne(request.params.userId);
    if (user === undefined) {
      responderWrongId(response, request.params.userId);

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
    if (request.params.userId === undefined) {
      responderMissingId(response);
      // responder(
      //   response,
      //   HttpCodes.badRequest,
      //   errorResponse(new Error('Missing ID paramter'))
      // );
      // throw new Error('Missing id paramater');
    }
    const user: User | undefined = await getRepository(User).findOne(request.params.userId);
    if (user === undefined) {

      responderWrongId(response, request.params.userId);

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
    const user = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
    if (user === undefined) {
      responderWrongId(response, request.params.userId);

      // responder(
      //   response,
      //   HttpCodes.badRequestNotFound,
      //   userIDErrorResponse(request.params.userId)
      // );
    } else {
      if (user.protected === true) {
        responder(response, HttpCodes.badRequestForbidden, errorResponse(new Error('You cannot delete a protected User')));
      } else {
        if (user.bathingspots.length !== 0) {
          const protectedUser = await getRepository(User).findOne({ where: { protected: true }, relations: ['bathingspots'] });
          if (protectedUser === undefined) {
            throw new Error('No protected user found!');
          } else {
            const spots: Bathingspot[] = [];
            user.bathingspots.forEach((spot) => {
              // we must retain all the public bathingspots
              // or not?
              if (spot.isPublic === true) {
                spot.isPublic = false; // keep them for moderation
                spots.push(spot);
              }
            });
            protectedUser.bathingspots = protectedUser.bathingspots.concat(spots);
            const manager = getManager();
            const res = await manager.save(protectedUser);
            if (process.env.NODE_ENV === 'development') {
              process.stdout.write(JSON.stringify(res));
              process.stdout.write('\n');
            }
          }
        }
        await getRepository(User).remove(user);
        responderSuccess(response, 'deleted user');
      }
    }

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

/**
 * Gets single bathingspot of user by id
 * @param request
 * @param response
 */
export const getOneUserBathingspotById: getResponse = async (request, response) => {
  try {
    const user: User | undefined = await getRepository(User).findOne(request.params.userId,{relations:['bathingspots']});
    if (user === undefined) {
      // throw new Error('user undefined or 0');
      responderWrongId(response, request.params.userId);
    }else{
      const spots: Bathingspot[] = user.bathingspots.filter(spot => spot.id === parseInt(request.params.spotId, 10));
      if(spots.length >0){
        responder(response, HttpCodes.success, [spots[0]]);
      }else{
        responderWrongId(response, 'Wrong bathingspot id');
      }
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
}


/**
 * Gets all the bathingspots of the user
 * @param request
 * @param response
 */
export const getUserBathingspots: getResponse = async (request, response) => {
  try {
    const user: User | undefined = await getRepository(User).findOne(request.params.userId,{relations:['bathingspots']});
    if (user === undefined) {
      // throw new Error('user undefined or 0');
      responderWrongId(response, request.params.userId);
    }else{
      responder(response, HttpCodes.success, successResponse('all bathingspots', user.bathingspots));
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
}
