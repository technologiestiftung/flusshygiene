import { Bathingspot } from '../../orm/entity/Bathingspot';
import { getRepository, FindOneOptions } from 'typeorm';
import { errorResponse, responder, responderWrongId } from './response-builders';
import { getResponse, HttpCodes } from '../types-interfaces';

interface IfindParams extends FindOneOptions {
  where: {
    isPublic:boolean;
  };
  select: string[];
}

/**
 * Todo: Which properties should be returned
 */
export const getBathingspots: getResponse = async (_request, response) => {
  let spots: Bathingspot[];

  try {
    spots = await getRepository(Bathingspot).find(
      {
        where: { isPublic: true },
        select: ['name']
      }
    );
    responder(response, HttpCodes.success, spots);
    // response.status(HttpCodes.success).json(spots);
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
}

export const getBathingspot: getResponse = async (request, response) => {
  let spot: Bathingspot|undefined;

  let findParamters: IfindParams = {
    where: {
      isPublic: true
    },
    select: ['name']
  }

  // if(!(Object.keys(request.query).length === 0)){
  //   if(request.query.hasOwnProperty('private') === true){
  //     findParamters.where.isPublic = false;
  //   }
  //   // if(request.hasOwnProperty('name')=== true){
  //   //   findParamters.select.push('name');
  //   // }
  // }

  if(request.params.id === undefined){
    throw new Error('id is not defined');
  }
  try {
    spot = await getRepository(Bathingspot).findOne(request.params.id, findParamters as FindOneOptions);
    if(spot === undefined){
      responderWrongId(response, request.params.id);
    }else{
      responder(response, HttpCodes.success, [spot]);
    }

    // response.status(HttpCodes.success).json(spots);
  } catch (e) {
    response.status(HttpCodes.internalError).json(errorResponse(e));
  }
}
