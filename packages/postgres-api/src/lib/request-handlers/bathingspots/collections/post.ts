// import { PurificationPlant } from './../../../../orm/entity/PurificationPlant';
// import { GenericInput } from './../../../../orm/entity/GenericInput';
// import { buildPayload } from './../../responders';
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
  partialSuccessResponder,
  buildPayload,
} from '../../responders';

import { getSpotWithRelation } from '../../../utils/spot-repo-helpers';

import { collectionRepoMapping } from '../../../utils/collection-repo-helpers';

import { getConnection, getRepository, ObjectLiteral } from 'typeorm';

import {
  Bathingspot,
  BathingspotMeasurement,
  BathingspotModel,
  BathingspotPrediction,
  Discharge,
  GenericInput,
  // GInputMeasurement,
  GlobalIrradiance,
  ImageFile,
  PurificationPlant,
  Rain,
  // PPlantMeasurement,
} from '../../../../orm/entity';
import { DuplicateError } from '../../../errors/DuplicateError';

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

export const postCollection: postResponse = async (request, response) => {
  try {
    // const userId = parseInt(request.params.userId, 10);
    // const spotId = parseInt(request.params.spotId, 10);
    const collectionId: string = request.params.collectionName;
    const responseMessages: DuplicateError[] = [];

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

        // console.log('identifiersArray:', identifiersArray);
        for (const identifier of identifiersArray) {
          try {
            await getRepository(Bathingspot)
              .createQueryBuilder()
              .relation(Bathingspot, collectionId)
              .of(spotWithRelation)
              .add(identifier);
          } catch (e) {
            const faildEntity = await repo.findOne(identifier.id);
            responseMessages.push(
              new DuplicateError([
                `entity type: ${collectionId}`,
                JSON.stringify(faildEntity),
              ]),
            );
            // console.error('enitity', faildEntity, 'could not be inserted');
            if (faildEntity !== undefined) {
              await repo.remove(faildEntity);
            }
          }
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
        const inserted = await repo.findByIds(ids);
        // console.log(inserted, 'inserted');
        // console.log(responseMessages, 'responseMessages');

        const res = [...inserted, ...responseMessages];
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
          responder(
            response,
            HttpCodes.badRequestConflict,
            buildPayload(
              false,
              'Inserting measurements together with GenericInput or PurificationPlant is deprecated',
              [],
            ),
          );
          return;
          // // so we are in single PP or GI
          // switch (collectionId) {
          //   case 'genericInputs': {
          //     const repoGi = getRepository(GenericInput);
          //     const repoGiM = getRepository(GInputMeasurement);
          //     const gim = repoGiM.create(attachedMeasurements);
          //     // const gim = attachedMeasurements.map((elem) => {
          //     //   const measurement = repoGiM.create(elem);
          //     //   return measurement;
          //     // });
          //     const gi = await repoGi.findOne(res[0].id);
          //     if (gi === undefined)
          //       throw new Error(
          //         'Could not find newly created resource severe!!!',
          //       );
          //     gi.measurements = gim;
          //     await repoGiM.insert(gim);
          //     res = await repoGi.save(gi);
          //     break;
          //   }
          //   case 'purificationPlants': {
          //     // console.log('in PPlant measrements');
          //     const repoPP = getRepository(PurificationPlant);
          //     const repoPM = getRepository(PPlantMeasurement);
          //     // const ppm = repoPM.create(attachedMeasurements);
          //     // const gim = attachedMeasurements.map((elem) => {
          //     //   const measurement = repoGiM.create(elem);
          //     //   return measurement;
          //     // });
          //     const pp = await repoPP.findOne(res[0].id);
          //     if (pp === undefined)
          //       throw new Error(
          //         'Could not find newly created resource severe!!!',
          //       );
          //     const insertRes = await repoPM
          //       .createQueryBuilder()
          //       .insert()
          //       .into(PPlantMeasurement)
          //       .values(attachedMeasurements)
          //       .onConflict(`("date") DO NOTHING`)
          //       .execute();
          //     // pp.measurements = insertRes;
          //     // await repoPM.insert(ppm);
          //     // console.log(insertRes, 'insertRes');
          //     await repoPP
          //       .createQueryBuilder()
          //       .relation(PurificationPlant, 'measurements')
          //       .of(pp)
          //       .add(insertRes.identifiers);
          //     // res = await repoPP.save(pp);
          //     break;
          //   }
          //   default: {
          //     throw new Error(
          //       'No default case defined for attachedMeasurements posting. Needs to be PP or GI',
          //     );
          //   }
          // }
        }
        // console.log('post collection res', res);
        // try {
        // res = await repo.save(mergedEntities);
        // await getRepository(Bathingspot).save(spotWithRelation);
        const success = responseMessages.length > 0 ? false : true;
        responder(
          response,
          HttpCodes.successCreated,
          partialSuccessResponder({
            message: `${repoName} Posted.${
              success ? '' : 'Some values could not be inserted'
            }`,
            data: res,
            success,
          }),
          // successResponse(`${repoName} Posted`, res),
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
