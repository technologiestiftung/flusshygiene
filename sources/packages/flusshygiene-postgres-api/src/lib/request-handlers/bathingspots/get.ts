import { Bathingspot } from '../../../orm/entity/Bathingspot';
import { getRepository } from 'typeorm';
import { errorResponse, responder, responderWrongId } from '../responders';
import { getResponse, HttpCodes } from '../../types-interfaces';

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
    } catch (e) {
        response.status(HttpCodes.internalError).json(errorResponse(e));
    }
}
export const getBathingspot: getResponse = async (request, response) => {
    let spot: Bathingspot|undefined;
    if(request.params.id === undefined){
        throw new Error('id is not defined');
    }
    try {
        spot = await getRepository(Bathingspot).findOne(request.params.id);
        if(spot === undefined){
            responderWrongId(response, request.params.id);
        }else{
            responder(response, HttpCodes.success, [spot]);
        }
    } catch (e) {
        response.status(HttpCodes.internalError).json(errorResponse(e));
    }
}
