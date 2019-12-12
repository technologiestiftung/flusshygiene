import { PurificationPlant } from './../../../../orm/entity/PurificationPlant';
import { GenericInput } from './../../../../orm/entity/GenericInput';
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
    const collectionName: string = response.locals.collectionName;
    const itemId = parseInt(request.params.itemId, 10);

    // const repoName = collectionRepoMapping[collectionName];
    const repo = getRepoByName(collectionName);

    let res: any;
    const item = await repo.findOne({
      where: { bathingspotId: spot.id, id: itemId },
    });

    if (item === undefined) {
      responderWrongId(response);
      return;
    }
    repo.merge(item, request.body);
    res = await repo.save(item);
    if (request.body.hasOwnProperty('measurements') === true) {
      const attachedMeasurements = request.body.measurements;
      // console.log('attachedMeasurements:', attachedMeasurements);
      switch (collectionName) {
        case 'genericInputs': {
          const repoGi = getRepository(GenericInput);
          const repoGiM = getRepository(GInputMeasurement);
          const gim = repoGiM.create(attachedMeasurements);
          // const gim = attachedMeasurements.map((elem) => {
          //   const measurement = repoGiM.create(elem);
          //   return measurement;
          // });
          const gi = await repoGi.findOne(itemId);
          if (gi === undefined)
            throw new Error('Could not find newly created resource severe!!!');
          if (gi.measurements === undefined) {
            gi.measurements = gim;
          } else {
            gi.measurements.push(...gim);
          }
          await repoGiM.save(gim);
          try {
            res = await repoGi.save(gi);
          } catch (e) {
            await repoGiM.delete(gim.map((item) => item.id));
            throw e;
          }
          break;
        }
        case 'purificationPlants': {
          console.log('updating pplant');
          const repoPP = getRepository(PurificationPlant);
          const repoPM = getRepository(PPlantMeasurement);
          const ppm = repoPM.create(attachedMeasurements);
          // const gim = attachedMeasurements.map((elem) => {
          //   const measurement = repoGiM.create(elem);
          //   return measurement;
          // });
          const pp = await repoPP.findOne(itemId);
          if (pp === undefined) {
            throw new Error('Could not find newly created resource severe!!!');
          }
          if (pp.measurements === undefined) {
            pp.measurements = ppm;
          } else {
            pp.measurements.push(...ppm);
          }
          const ppmres = await repoPM.save(ppm);
          console.log('save res', ppmres);
          try {
            res = await repoPP.save(pp);
          } catch (e) {
            await repoPM.delete(ppmres.map((item) => item.id));
            throw e;
          }
          break;
        }
        default: {
          throw new Error(
            'No default case defined for attachedMeasurements putting. Needs to be PP or GI',
          );
        }
      }
    }
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
