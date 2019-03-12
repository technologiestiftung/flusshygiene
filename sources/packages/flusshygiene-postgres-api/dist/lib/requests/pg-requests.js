"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bathingspot_1 = require("../../orm/entity/Bathingspot");
const typeorm_1 = require("typeorm");
const response_builders_1 = require("./response-builders");
const types_interfaces_1 = require("../types-interfaces");
/**
 * Todo: Which properties should be returned
 */
exports.getPublicBathingspots = async (_request, response) => {
    let spots;
    try {
        spots = await typeorm_1.getRepository(Bathingspot_1.Bathingspot).find({
            where: { isPublic: true },
            select: ['name']
        });
        response.status(types_interfaces_1.HttpCodes.success).json(spots);
    }
    catch (e) {
        response.status(types_interfaces_1.HttpCodes.internalError).json(response_builders_1.errorResponse(e));
    }
};
