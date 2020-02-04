import { DuplicateError } from '../../../errors/DuplicateError';
import {
  responderDuplicateValues,
  partialSuccessResponder,
} from '../../responders';
import {
  // apiVersion,
  HttpCodes,
  // IDefaultResponsePayload,
  postResponse,
} from '../../../common';
import {
  errorResponse,
  responder,
  responderWrongId,
  responderWrongRoute,
} from '../../responders';
import {
  collectionRepoMapping,
  getGIWithRelations,
  getPPlantWithRelations,
} from '../../../utils/collection-repo-helpers';
import { getRepository } from 'typeorm';
import {
  GenericInput,
  GInputMeasurement,
  PurificationPlant,
  PPlantMeasurement,
} from '../../../../orm/entity';
import { unique } from '../../../utils/unique-values';
import { formatDateToString } from '../../../utils/format-dates';
export const postCollectionsSubItem: postResponse = async (
  request,
  response,
) => {
  try {
    const itemId = request.params.itemId;
    let bulkPost = false;
    const responseMessages: DuplicateError[] = [];
    let success = true;
    const collectionName = response.locals.collectionName;
    const repoName = collectionRepoMapping[collectionName];
    let res;
    let inData: any = [];
    if (Array.isArray(request.body) === false) {
      inData.push(request.body);
    } else {
      inData = request.body;
      bulkPost = true;
    }
    if (bulkPost === true) {
      if (unique(inData, 'date').length !== inData.length) {
        responderDuplicateValues(response);
        return;
      }
    }
    switch (repoName) {
      case 'GenericInput': {
        const gi = await getGIWithRelations(itemId);
        if (gi === undefined) {
          responderWrongId(response);
          return;
        }
        const repoGInputMeasurement = getRepository(GInputMeasurement);
        const insertRes = await repoGInputMeasurement
          .createQueryBuilder()
          .insert()
          .into(GInputMeasurement)
          .values(inData)
          .onConflict(
            `("date", "genericInputId") DO UPDATE SET "value" = "excluded"."value"`,
          )
          .execute();
        const repoGenericInput = getRepository(GenericInput);
        for (const item of insertRes.identifiers) {
          try {
            await repoGenericInput
              .createQueryBuilder()
              .relation(GenericInput, 'measurements')
              .of(gi)
              .add(item);
          } catch (error) {
            const entity = await repoGInputMeasurement.findOne(item.id);
            if (entity !== undefined) {
              responseMessages.push(
                new DuplicateError([
                  `date: ${formatDateToString(new Date(entity.date))}`,
                  `value: ${entity.value}`,
                ]),
              );
              await repoGInputMeasurement.remove(entity);
            }
          }
        }
        const inserted = await repoGInputMeasurement.findByIds(
          insertRes.identifiers.map((e) => e.id),
        );
        res = [...inserted, ...responseMessages];
        // const measurements = repoGInputMeasurement.create(inData);
        // res = await repoGInputMeasurement.save(measurements);
        // if (gi.measurements === undefined) {
        //   gi.measurements = measurements;
        // } else {
        //   gi.measurements.push(...measurements);
        // }
        // await repoGenericInput.save(gi);
        break;
      }
      case 'PurificationPlant': {
        const pp = await getPPlantWithRelations(itemId);
        if (pp === undefined) {
          responderWrongId(response);
          return;
        }
        const repoPPlantMeasurement = getRepository(PPlantMeasurement);
        const insertRes = await repoPPlantMeasurement
          .createQueryBuilder()
          .insert()
          .into(PPlantMeasurement)
          .values(inData)
          .onConflict(
            `("date", "purificationPlantId") DO UPDATE SET "value" = "excluded"."value"`,
          )
          .execute();
        const repoPPlant = getRepository(PurificationPlant);
        for (const item of insertRes.identifiers) {
          try {
            await repoPPlant
              .createQueryBuilder()
              .relation(PurificationPlant, 'measurements')
              .of(pp)
              .add(item);
          } catch (error) {
            const entity = await repoPPlantMeasurement.findOne(item.id);
            if (entity !== undefined) {
              responseMessages.push(
                new DuplicateError([
                  `date: ${formatDateToString(new Date(entity.date))}`,
                  `value: ${entity.value}`,
                ]),
              );
              await repoPPlantMeasurement.remove(entity);
            }
          }
        }
        const inserted = await repoPPlantMeasurement.findByIds(
          insertRes.identifiers.map((e) => e.id),
        );
        res = [...inserted, ...responseMessages];
        // res = await repoPPlantMeasurement.save(measurements);
        // console.log(measurements);
        // if (pp.measurements === undefined) {
        //   pp.measurements = measurements;
        // } else {
        //   pp.measurements.push(...measurements);
        // }
        // res = measurements;
        break;
      }
      default: {
        responderWrongRoute(response);
        return;
      }
    }
    success = responseMessages.length > 0 ? false : true;
    responder(
      response,
      HttpCodes.successCreated,
      partialSuccessResponder({
        message: `${repoName} measurement posted.`,
        data: bulkPost === true ? res : [res[0]],
        success,
      }),
    );
    // }
    // }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
