import { putResponse, HttpCodes } from '../../../common';
import {
  responder,
  errorResponse,
  responderWrongId,
  successResponse,
  responderWrongRoute,
} from '../../responders';
import { getRepoByName } from '../../../utils/repo-helpers';
import { getRepository } from 'typeorm';
import { GInputMeasurement, PPlantMeasurement } from '../../../../orm/entity';

export const putCollectionSubItem: putResponse = async (request, response) => {
  try {
    // const spot = response.locals.spot;
    const collectionName = response.locals.collectionName;
    const itemId = parseInt(request.params.itemId, 10);
    const subItemId = parseInt(request.params.subItemId, 10);
    const relations = [];
    let res;
    switch (collectionName) {
      case 'genericInputs': {
        relations.push('measurements');
        const gimRepo = getRepository(GInputMeasurement);
        let item = await gimRepo.findOne({
          where: { id: subItemId, genericInputId: itemId },
        });
        if (item === undefined) {
          responderWrongId(response);
          return;
        } else {
          gimRepo.merge(item, request.body);
          res = await gimRepo.save(item);
          // res = await gimRepo.update(item.id, request.body);
        }
        break;
      }
      case 'purificationPlants': {
        relations.push('measurements');
        const ppmRepo = getRepository(PPlantMeasurement);
        let item = await ppmRepo.findOne({
          where: { id: subItemId, purificationPlantId: itemId },
        });
        if (item === undefined) {
          responderWrongId(response);
          return;
        } else {
          ppmRepo.merge(item, request.body);
          res = await ppmRepo.save(item);
        }
        break;
      }
      default:
        responderWrongRoute(response);
        return;
    }

    responder(
      response,
      HttpCodes.successCreated,
      successResponse(
        `${collectionName} element with id ${itemId} - measurement with id ${subItemId} updated.`,
        [res],
      ),
    );
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
export const putCollectionItem: putResponse = async (request, response) => {
  try {
    const spot = response.locals.spot;
    const collectionName = response.locals.collectionName;
    const itemId = parseInt(request.params.itemId, 10);

    // const repoName = collectionRepoMapping[collectionName];
    const repo = getRepoByName(collectionName);

    const res = await repo.findOne({
      where: { bathingspotId: spot.id, id: itemId },
    });

    if (res === undefined) {
      responderWrongId(response);
      return;
    }
    repo.merge(res, request.body);
    await repo.save(res);
    responder(
      response,
      HttpCodes.successCreated,
      successResponse(`${collectionName} element with ${itemId} updated.`, [
        res,
      ]),
    );
    // response.json({
    //   res,
    //   itemId,
    //   collectionName: response.locals.collectionName,
    // });
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
