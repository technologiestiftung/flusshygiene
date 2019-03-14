import { postResponse, UserRole, HttpCodes } from '../../types-interfaces';
import { User } from '../../../orm/entity/User';
import { responderMissingBodyValue, responderSuccessCreated, responder, errorResponse, responderWrongId, successResponse } from '../responders';
import { validate } from 'class-validator';
import { getRepository, getConnection, getManager } from 'typeorm';
import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { isObject } from 'util';

//  █████╗ ██████╗ ██████╗
// ██╔══██╗██╔══██╗██╔══██╗
// ███████║██║  ██║██║  ██║
// ██╔══██║██║  ██║██║  ██║
// ██║  ██║██████╔╝██████╔╝
// ╚═╝  ╚═╝╚═════╝ ╚═════╝



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



export const addBathingspotToUser: postResponse = async (request, response) => {
  try {
    const user = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
    if (user === undefined) {
      responderWrongId(response, request.params.userId);
    } else {
      if (request.body.hasOwnProperty('name') !== true) {

        responderMissingBodyValue(response, 'Bathingspot "name" is not defined');
      }

      if (request.body.hasOwnProperty('isPublic') !== true) {
        responderMissingBodyValue(response, 'Bathingspot "isPublic" is not defined');
      }
      //
      // get all the values we want from the request body
      // they are all nullable s owe just fetch them.
      // needs some typechecking though
      // https://stackoverflow.com/a/38750895/1770432//
      const spot = new Bathingspot();
      const propertyNames = await getConnection().getMetadata(Bathingspot).ownColumns.map(column => column.propertyName);
      // const propertyTypes = await getConnection().getMetadata(Bathingspot).ownColumns.map(column => column.type);
      const propertyTypeList = await getConnection().getMetadata(Bathingspot).ownColumns.map(column => [column.propertyName, column.type]);
      const lookupMap = new Map();
      propertyTypeList.forEach(ele => {
        lookupMap.set(ele[0], ele[1]);
      })
      // console.log(propertyTypeList);

      const notAllowed: string[] = ['id', 'name', 'isPublic', 'user', 'region'];
      const filteredPropNames = propertyNames.filter(ele => notAllowed.includes(ele) !== true);
      const providedValues = Object.keys(request.body)
        .filter(key => filteredPropNames.includes(key)).reduce((obj: any, key: string) => {
          obj[key] = request.body[key];
          return obj;
        }, {});

      try {
        // curently silently fails needs some smarter way to set values on entities
        if (isObject(providedValues['apiEndpoints'])) {
          spot.apiEndpoints = providedValues['apiEndpoints'];// 'json' ]
        }// 'json' ]
        if (isObject(providedValues['state'])) {
          spot.state = providedValues['state'];// 'json' ]

        }// 'json' ]
        if (isObject(providedValues['location'])) {
          spot.location = providedValues['location'];// 'json' ]

        }// 'json' ]
        if (typeof providedValues['latitde'] === 'number') {
          spot.latitde = providedValues['latitde'];// 'float8' ]

        }// 'float8' ]
        if (typeof providedValues['longitude'] === 'number') {
          spot.longitude = providedValues['longitude'];// 'float8' ]

        }// 'float8' ]
        if (typeof providedValues['elevation'] === 'number') {
          spot.elevation = providedValues['elevation'];// 'float8' ]
        }// 'float8' ]
      } catch (err) {
        throw err;
      }

      const isPublic: boolean = request.body.isPublic;
      const name: string = request.body.name;
      spot.name = name;
      spot.isPublic = isPublic;
      user.bathingspots.push(spot);
      await getManager().save(spot);
      await getManager().save(user);
      const userAgain = await getRepository(User).findOne(request.params.userId, { relations: ['bathingspots'] });
      if (userAgain !== undefined) {

        responder(response, HttpCodes.successCreated, successResponse('Bathingspot created', [userAgain.bathingspots[userAgain.bathingspots.length - 1]]))
      } else {
        throw Error('user id did change user does not exist anymore should never happen');
      }
    }
  } catch (e) {
    responder(response, HttpCodes.internalError, errorResponse(e));
  }
}
