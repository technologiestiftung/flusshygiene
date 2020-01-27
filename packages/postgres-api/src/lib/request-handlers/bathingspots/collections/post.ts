import {
  // apiVersion,
  HttpCodes,
  // IDefaultResponsePayload,
  postResponse,
} from '../../../common';

import { collectionNames } from './collections';

import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
  responderWrongRoute,
} from '../../responders';

import { getSpotWithRelation } from '../../../utils/spot-repo-helpers';

import {
  collectionRepoMapping,
  getGIWithRelations,
  getPPlantWithRelations,
} from '../../../utils/collection-repo-helpers';

import { getConnection, getRepository, ObjectLiteral } from 'typeorm';

import {
  Bathingspot,
  BathingspotMeasurement,
  BathingspotModel,
  BathingspotPrediction,
  Discharge,
  GenericInput,
  GInputMeasurement,
  GlobalIrradiance,
  ImageFile,
  PurificationPlant,
  Rain,
  PPlantMeasurement,
} from '../../../../orm/entity';

// interface IIdentifier {
//   id: number;
//   [key: string]: any;
// }

const insertUniqueOnly: (
  mEntity: any,
  entity: any,
) => Promise<ObjectLiteral[]> = async (mEntity, entity) => {
  const ires = await getConnection()
    .createQueryBuilder()
    .insert()
    .into(entity)
    .values(mEntity)
    .onConflict(`DO NOTHING`)
    .execute();
  return ires.identifiers;
};

export const postCollectionsSubItem: postResponse = async (
  request,
  response,
) => {
  try {
    // const repoName = collectionRepoMapping[request.params.collection];
    // const userId = parseInt(request.params.userId, 10);
    // const spotId = parseInt(request.params.spotId, 10);
    // const collectionName = request.params.collectionName;
    const itemId = request.params.itemId;
    let bulkPost = false;
    // const spot = response.locals.spot;
    const collectionName = response.locals.collectionName;

    const repoName = collectionRepoMapping[collectionName];
    // const repoPPlant = getRepository(PurificationPlant);
    // const repoPPlantMeasurement = getRepository(PPlantMeasurement);
    // let inData: GInputMeasurement[] = [];

    // let pp: PurificationPlant | undefined;
    let res;
    let inData: any = [];
    if (Array.isArray(request.body) === false) {
      inData.push(request.body);
    } else {
      inData = request.body;
      bulkPost = true;
    }
    switch (repoName) {
      case 'GenericInput': {
        const gi = await getGIWithRelations(itemId);
        if (gi === undefined) {
          responderWrongId(response);
          return;
        }
        const repoGInputMeasurement = getRepository(GInputMeasurement);
        const measurements = repoGInputMeasurement.create(inData);
        res = await repoGInputMeasurement.save(measurements);
        if (gi.measurements === undefined) {
          gi.measurements = measurements;
        } else {
          gi.measurements.push(...measurements);
        }
        const repoGenericInput = getRepository(GenericInput);
        await repoGenericInput.save(gi);
        // res = measurements;
        break;
      }
      case 'PurificationPlant': {
        const pp = await getPPlantWithRelations(itemId);
        if (pp === undefined) {
          responderWrongId(response);
          return;
        }
        const repoPPlantMeasurement = getRepository(PPlantMeasurement);
        const measurements = repoPPlantMeasurement.create(inData);
        res = await repoPPlantMeasurement.save(measurements);
        // console.log(measurements);
        if (pp.measurements === undefined) {
          pp.measurements = measurements;
        } else {
          pp.measurements.push(...measurements);
        }
        const repoPPlant = getRepository(PurificationPlant);
        await repoPPlant.save(pp);
        // res = measurements;
        break;
      }
      default: {
        responderWrongRoute(response);
        return;
      }
    }
    // const repoGInputMeasurement = getRepository(GInputMeasurement);
    // const repoPPlantMeasurement = getRepository(PPlantMeasurement);
    // else
    // {

    // const mergedEntities: GInputMeasurement[] = [];
    // let mergedEntity: GInputMeasurement | undefined;

    // if (Array.isArray(request.body) === false) {
    //   inData.push(request.body);
    // } else {
    //   inData = request.body;
    // }
    // const repo: any = getRepository(repoName);
    // let res;
    // for (const datum of inData) {

    //   switch (repoName) {
    //     case 'GenericInput': {
    //       const measurement = repoGInputMeasurement.create(datum);
    //       // mergedEntity = repoGInputMeasurement.merge(measurement, datum);
    //       if (gi!.measurements === undefined) {
    //         gi!.measurements = [];
    //       }
    //       // } else {
    //       gi!.measurements.push(
    //         measurement as GInputMeasurement,
    //       );
    //       // }
    //       mergedEntities.push(measurement);
    //       break;
    //     }
    //     case 'PurificationPlant': {
    //       const measurement = repoPPlantMeasurement.create(datum);
    //       if (pp!.measurements === undefined) {
    //         pp!.measurements = [];
    //       }
    //       pp!.measurements.push(
    //         measurement as PPlantMeasurement,
    //       );
    //       break;
    //     }
    //   }
    // }

    // console.log(res);
    // res = await repoGInputMeasurement.save(mergedEntities);
    // await repoGenericInput.save(gi as GenericInput);
    responder(
      response,
      HttpCodes.successCreated,
      successResponse(
        `${repoName} measurement posted.`,
        bulkPost === true ? res : [res[0]],
      ),
    );
    // }
    // }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};

export const postCollection: postResponse = async (request, response) => {
  try {
    // const userId = parseInt(request.params.userId, 10);
    // const spotId = parseInt(request.params.spotId, 10);
    const collectionId: string = request.params.collectionName;
    if (collectionNames.includes(collectionId) === false) {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionId}" not included in "${JSON.stringify(
          collectionNames,
        )}"`,
        success: false,
      });
    } else {
      // const spot = await getSpot(userId, spotId);
      // if (spot === undefined) {
      // responderWrongId(response);
      // {
      const spotWithRelation = await getSpotWithRelation(
        response.locals.spot.id,
        collectionId,
      );
      if (spotWithRelation === undefined) {
        throw new Error(
          `Could not load Bathingspot with relation ${collectionId} even though it exists`,
        );
      } else {
        // console.log('body', request.body);

        const repoName = collectionRepoMapping[collectionId];
        const repo: any = getRepository(repoName);
        let attachedMeasurements: any[];
        let inData: Array<
          | BathingspotPrediction
          | BathingspotMeasurement
          | PurificationPlant
          | BathingspotModel
          | GenericInput
          | GlobalIrradiance
          | Rain
          | ImageFile
        > = [];
        const mergedEntities: Array<
          | BathingspotPrediction
          | BathingspotMeasurement
          | PurificationPlant
          | BathingspotModel
          | GenericInput
          | GlobalIrradiance
          | Rain
          | ImageFile
        > = [];

        if (Array.isArray(request.body) === false) {
          if (request.body.hasOwnProperty('measurements') === true) {
            attachedMeasurements = request.body.measurements;
            // console.log('attachedMeasurements:', attachedMeasurements);
          }
          inData.push(request.body);
        } else {
          inData = request.body;
        }
        const identifiersArray: ObjectLiteral[] = [];
        for (const datum of inData) {
          const entity = repo.create();
          const mergedEntity:
            | BathingspotPrediction
            | BathingspotMeasurement
            | PurificationPlant
            | BathingspotModel
            | GenericInput
            | GlobalIrradiance
            | Rain
            | ImageFile = repo.merge(entity, datum);

          switch (collectionId) {
            case 'predictions':
              {
                const mEntity = mergedEntity as BathingspotPrediction;
                if (spotWithRelation.predictions === undefined) {
                  spotWithRelation.predictions = [mEntity];
                } else {
                  spotWithRelation.predictions.push(mEntity);
                }
                const ires = await insertUniqueOnly(
                  mEntity,
                  BathingspotPrediction,
                );
                identifiersArray.push(...ires);
              }
              break;
            case 'measurements':
              {
                const mEntity = mergedEntity as BathingspotMeasurement;
                if (spotWithRelation.measurements === undefined) {
                  spotWithRelation.measurements = [mEntity];
                } else {
                  spotWithRelation.measurements.push(mEntity);
                }
                const ires = await insertUniqueOnly(
                  mEntity,
                  BathingspotMeasurement,
                );
                identifiersArray.push(...ires);
                // const ires = await getConnection()
                //   .createQueryBuilder()
                //   .insert()
                //   .into(BathingspotMeasurement)
                //   .values(mEntity)
                //   .onConflict(`DO NOTHING`)
                //   .execute();
                // console.log(ires);
              }
              break;
            case 'purificationPlants':
              {
                const mEntity = mergedEntity as PurificationPlant;
                if (spotWithRelation.purificationPlants === undefined) {
                  spotWithRelation.purificationPlants = [mEntity];
                } else {
                  spotWithRelation.purificationPlants.push(mEntity);
                }
                const ires = await insertUniqueOnly(mEntity, PurificationPlant);
                identifiersArray.push(...ires);
              }
              break;
            case 'models':
              {
                const mEntity = mergedEntity as BathingspotModel;
                if (spotWithRelation.models === undefined) {
                  spotWithRelation.models = [mEntity];
                } else {
                  spotWithRelation.models.push(mEntity);
                }
                const ires = await insertUniqueOnly(mEntity, BathingspotModel);
                identifiersArray.push(...ires);
              }
              break;
            case 'genericInputs':
              {
                const mEntity = mergedEntity as GenericInput;
                if (spotWithRelation.genericInputs === undefined) {
                  spotWithRelation.genericInputs = [mEntity];
                } else {
                  spotWithRelation.genericInputs.push(mEntity);
                }
                const ires = await insertUniqueOnly(mEntity, GenericInput);
                identifiersArray.push(...ires);
              }
              break;
            case 'globalIrradiances':
              {
                const mEntity = mergedEntity as GlobalIrradiance;
                if (spotWithRelation.globalIrradiances === undefined) {
                  spotWithRelation.globalIrradiances = [mEntity];
                } else {
                  spotWithRelation.globalIrradiances.push(mEntity);
                }
                const ires = await insertUniqueOnly(mEntity, GlobalIrradiance);
                identifiersArray.push(...ires);
              }
              break;
            case 'discharges':
              {
                const mEntity = mergedEntity as Discharge;
                if (spotWithRelation.discharges === undefined) {
                  spotWithRelation.discharges = [mEntity];
                } else {
                  spotWithRelation.discharges.push(mEntity);
                }
                const ires = await insertUniqueOnly(mEntity, Discharge);
                identifiersArray.push(...ires);
              }
              break;
            case 'rains':
              {
                const mEntity = mergedEntity as Rain;
                if (spotWithRelation.rains === undefined) {
                  spotWithRelation.rains = [mEntity];
                } else {
                  spotWithRelation.rains.push(mEntity);
                }
                const ires = await insertUniqueOnly(mEntity, Rain);
                identifiersArray.push(...ires);
              }
              break;
            case 'images':
              {
                const mEntity = mergedEntity as ImageFile;
                if (spotWithRelation.images === undefined) {
                  spotWithRelation.images = [mEntity];
                } else {
                  spotWithRelation.images.push(mEntity);
                }
                const ires = await insertUniqueOnly(mEntity, ImageFile);
                identifiersArray.push(...ires);
              }
              break;
          }
          mergedEntities.push(mergedEntity);
        }
        const ids = identifiersArray
          .filter((ele) => {
            if (ele === undefined) {
              return;
            }
            if (ele.id === undefined) {
              return;
            }
            return ele;
          })
          .map((ele) => ele.id);
        // console.log(ids);
        let res = await repo.findByIds(ids);
        /**
         * WE need to be able to post a GI or PP with measruements in attachedMeasurements
         * This is somekind of an edge case but makes creating those way faster
         * and easier for the frontend cms-createSpotWithValues
         *
         * So if
         * - it is only one thing that was posted
         * - it is a GI or PP
         * - we make another call and post measruments to them
         */
        if (
          attachedMeasurements! !== undefined &&
          (collectionId === 'genericInputs' ||
            collectionId === 'purificationPlants')
        ) {
          // so we are in single PP or GI
          switch (collectionId) {
            case 'genericInputs': {
              const repoGi = getRepository(GenericInput);
              const repoGiM = getRepository(GInputMeasurement);
              const gim = repoGiM.create(attachedMeasurements);
              // const gim = attachedMeasurements.map((elem) => {
              //   const measurement = repoGiM.create(elem);
              //   return measurement;
              // });
              const gi = await repoGi.findOne(res[0].id);
              if (gi === undefined)
                throw new Error(
                  'Could not find newly created resource severe!!!',
                );
              gi.measurements = gim;
              await repoGiM.insert(gim);
              res = await repoGi.save(gi);
              break;
            }
            case 'purificationPlants': {
              const repoPP = getRepository(PurificationPlant);
              const repoPM = getRepository(PPlantMeasurement);
              const ppm = repoPM.create(attachedMeasurements);
              // const gim = attachedMeasurements.map((elem) => {
              //   const measurement = repoGiM.create(elem);
              //   return measurement;
              // });
              const pp = await repoPP.findOne(res[0].id);
              if (pp === undefined)
                throw new Error(
                  'Could not find newly created resource severe!!!',
                );
              pp.measurements = ppm;
              await repoPM.insert(ppm);
              res = await repoPP.save(pp);
              break;
            }
            default: {
              throw new Error(
                'No default case defined for attachedMeasurements posting. Needs to be PP or GI',
              );
            }
          }
        }
        // console.log('post collection res', res);
        // try {
        // res = await repo.save(mergedEntities);
        await getRepository(Bathingspot).save(spotWithRelation);
        responder(
          response,
          HttpCodes.successCreated,
          successResponse(`${repoName} Posted`, res),
        );
        // } catch (e) {
        //   // console.error(e);
        //   if (e.code === '23505') {
        //     const payload: IDefaultResponsePayload = {
        //       apiVersion,
        //       data: e.parameters,
        //       message: e.detail,
        //       success: false,
        //     };
        //     responder(response, HttpCodes.badRequestConflict, payload);
        //   } else {
        //     throw e;
        //   }
        // }
        // const query = await repo.createQueryBuilder().insert().into(repo).c
      }
      // }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
