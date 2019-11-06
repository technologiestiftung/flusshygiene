import { putResponse, HttpCodes } from '../../../common';
import {
  responder,
  errorResponse,
  responderWrongId,
  successResponse,
} from '../../responders';
import { getRepoByName } from '../../../utils/repo-helpers';

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
