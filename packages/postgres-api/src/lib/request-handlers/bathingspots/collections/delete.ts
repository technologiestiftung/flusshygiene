import { HttpCodes, postResponse, deleteResponse } from '../../../common';
import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
  responderWrongRoute,
} from '../../responders';
import {
  collectionRepoMapping,
  getColletionItemById,
} from '../../../utils/collection-repo-helpers';
import { getRepository, getManager } from 'typeorm';
import { SUCCESS } from '../../../messages';
import { GInputMeasurement, PPlantMeasurement } from '../../../../orm/entity';

// delete

export const deleteSubItemMeasurement: deleteResponse = async (
  request,
  response,
) => {
  try {
    const itemId = parseInt(request.params.itemId, 10);
    const subItemId = parseInt(request.params.subItemId, 10);
    if (
      isNaN(subItemId) === true ||
      subItemId === undefined ||
      isNaN(itemId) === true ||
      itemId === undefined
    ) {
      throw new Error(
        `subItemId or itemId are not a number in this route itemId: ${itemId}, subItemId: ${subItemId}`,
      );
    }
    const entityManager = getManager(); // you can also get it via getConnection
    switch (response.locals.collectionName) {
      case 'genericInputs': {
        // console.log('gi');
        const opts = {
          where: { id: subItemId, genericInputId: itemId },
        };
        const item = await entityManager.findOne(GInputMeasurement, opts);
        // console.log(res);
        if (item === undefined) {
          responderWrongId(response);
          return;
        }
        await entityManager.remove(item);
        break;
      }
      case 'purificationPlants': {
        const opts = {
          where: { id: subItemId, purificationPlantId: itemId },
        };
        const item = await entityManager.findOne(PPlantMeasurement, opts);
        if (item === undefined) {
          responderWrongId(response);
          return;
        }
        await entityManager.remove(item);
        break;
      }
      default:
        responderWrongRoute(response);
        return;
    }

    responder(
      response,
      HttpCodes.success,
      successResponse(SUCCESS.successDelete200, []),
    );
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};

export const deleteCollectionItem: postResponse = async (request, response) => {
  try {
    const itemId = request.params.itemId;
    const collectionId = request.params.collectionName;
    const repoName = collectionRepoMapping[collectionId];
    const repo: any = getRepository(repoName);
    const entity = await getColletionItemById(itemId, repoName);
    if (entity !== undefined) {
      const res = await repo.remove(entity);
      responder(
        response,
        HttpCodes.success,
        successResponse(SUCCESS.successDelete200, [res]),
      );
    } else {
      responderWrongId(response);
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
