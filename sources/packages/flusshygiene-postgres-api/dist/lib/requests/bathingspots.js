"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bathingspot_1 = require("../../orm/entity/Bathingspot");
const typeorm_1 = require("typeorm");
const response_builders_1 = require("./response-builders");
const types_interfaces_1 = require("../types-interfaces");
// interface IfindParams extends FindOneOptions {
//     where: {
//         isPublic: boolean;
//     };
//     select: string[];
// }
/**
 * Todo: Which properties should be returned
 */
exports.getBathingspots = async (_request, response) => {
    let spots;
    try {
        spots = await typeorm_1.getRepository(Bathingspot_1.Bathingspot).find({
            where: { isPublic: true },
            select: ['name']
        });
        response_builders_1.responder(response, types_interfaces_1.HttpCodes.success, spots);
        // response.status(HttpCodes.success).json(spots);
    }
    catch (e) {
        response.status(types_interfaces_1.HttpCodes.internalError).json(response_builders_1.errorResponse(e));
    }
};
exports.getBathingspot = async (request, response) => {
    let spot;
    // let findParamters: FindOneOptions = {
    //     where: {
    //         isPublic: true
    //     },
    //     select: ['name']
    // }
    // if(!(Object.keys(request.query).length === 0)){
    //   if(request.query.hasOwnProperty('private') === true){
    //     findParamters.where.isPublic = false;
    //   }
    //   // if(request.hasOwnProperty('name')=== true){
    //   //   findParamters.select.push('name');
    //   // }
    // }
    if (request.params.id === undefined) {
        throw new Error('id is not defined');
    }
    try {
        spot = await typeorm_1.getRepository(Bathingspot_1.Bathingspot).findOne(request.params.id);
        if (spot === undefined) {
            response_builders_1.responderWrongId(response, request.params.id);
        }
        else {
            response_builders_1.responder(response, types_interfaces_1.HttpCodes.success, [spot]);
        }
        // response.status(HttpCodes.success).json(spots);
    }
    catch (e) {
        response.status(types_interfaces_1.HttpCodes.internalError).json(response_builders_1.errorResponse(e));
    }
};
