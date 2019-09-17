import AWS from 'aws-sdk';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import mime from 'mime';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { getRepository } from 'typeorm';
import { RModelFile } from '../../../../orm/entity';
import { Bathingspot } from '../../../../orm/entity/Bathingspot';
import { ImageFile } from '../../../../orm/entity/ImageFile';
import { HttpCodes, postResponse } from '../../../common';
import { collectionRepoMapping } from '../../../utils/collection-repo-helpers';
import { getSpot, getSpotWithRelation } from '../../../utils/spot-repo-helpers';
import {
  errorResponse,
  responder,
  responderWrongId,
  successResponse,
} from '../../responders';
import { BathingspotModel } from './../../../../orm/entity/BathingspotModel';
import { getRModelWithRelation } from './../../../utils/rmodel-repo-helpers';

const ENV_SUFFIX = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';
const bucket: string = process.env[`AWS_BUCKET_${ENV_SUFFIX}`]!;

export const upload = (s3: AWS.S3) => {
  const storages3 = multerS3({
    acl: 'public-read',
    bucket,
    key: (
      req: Request,
      file: any,
      cb: (error: any, key?: string | undefined) => void,
    ) => {
      const folders = req.url.substring(1);
      crypto.pseudoRandomBytes(16, (_err, raw) => {
        cb(
          null,
          `${folders}/${raw.toString('hex')}-${Date.now()}.${mime.getExtension(
            file.mimetype,
          )}`,
        );
      });
    },
    metadata: (_req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    s3,
  });

  return multer({ storage: storages3 });
};

export const postFileMiddleWare = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const spotId = parseInt(request.params.spotId, 10);
    const userId = parseInt(request.params.userId, 10);
    const collectionName = request.params.collectionName;
    if (collectionName !== 'images' && collectionName !== 'models') {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionName}" can't process uploads`,
        success: false,
      });
    } else {
      const spot = await getSpot(userId, spotId);
      // console.log(spot);
      if (spot !== undefined) {
        // check user
        // check spot
        next();
      } else {
        responderWrongId(response);
      }
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};

export const postFile: postResponse = async (request, response) => {
  try {
    const spotId = parseInt(request.params.spotId, 10);
    const modelId = parseInt(request.params.modelId, 10);
    // const userId = parseInt(request.params.spotId, 10);
    const collectionName = request.params.collectionName;
    // console.log('modelId', modelId);
    // console.log('spotId', spotId);
    const spot = await getSpotWithRelation(spotId, collectionName);
    const repoName = collectionRepoMapping[collectionName];
    let rmodel: any;
    if (collectionName === 'models') {
      rmodel = await getRModelWithRelation(modelId);
    }
    if (collectionName === 'models' && rmodel === undefined) {
      responderWrongId(response);
    } else {
      // console.log('the r model', rmodel);
      let repo: any;
      if (collectionName === 'images') {
        repo = getRepository(repoName);
      } else {
        repo = getRepository(RModelFile);
      }
      const entity = repo.create();
      // console.log('url------->', request.file.location);
      const mergedEntity: ImageFile | RModelFile = repo.merge(entity, {
        metaData: request.file,
        url: request.file.location,
      });
      // console.log('mergedEntity', mergedEntity);
      let res: any;
      switch (collectionName) {
        case 'images':
          {
            const mEntity = mergedEntity as ImageFile;
            if (spot.images === undefined) {
              spot.images = [mEntity];
            } else {
              spot.images.push(mEntity);
            }
            res = await repo.save(mEntity);
            await getRepository(Bathingspot).save(spot);
          }
          break;
        case 'models':
          {
            const mEntity = mergedEntity as RModelFile;
            mEntity.type = 'rmodel';
            // console.log('mEntity', mEntity);
            if (rmodel.rmodelfiles === undefined) {
              rmodel.rmodelfiles = [mEntity];
            } else {
              rmodel.rmodelfiles.push(mEntity);
            }
            // if (spot.models === undefined) {
            //   spot.models = [rmodel];
            // } else {
            //   spot.models.push(rmodel);
            // }
            res = await repo.save(mEntity);
            // console.log(res);
            await getRepository(RModelFile).save(mEntity);
            // await getRepository(BathingspotModel).save(rmodel);
            await getRepository(BathingspotModel).save(rmodel);
            await getRepository(Bathingspot).save(spot);
          }
          break;
        default:
          throw new Error('Other file upload not yet implemented');
      }
      responder(
        response,
        HttpCodes.successCreated,
        successResponse(`${collectionName} file posted.`, [res]),
      );
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
