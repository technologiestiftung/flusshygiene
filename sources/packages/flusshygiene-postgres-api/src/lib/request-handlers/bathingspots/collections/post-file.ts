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
    const spot = await getSpotWithRelation(spotId, collectionName);
    const repoName = collectionRepoMapping[collectionName];
    const rmodel = await getRModelWithRelation(modelId, 'RModelFiles');

    const repo: any = getRepository(repoName);
    const entity = repo.create();
    // console.log('url------->', request.file.location);
    const mergedEntity: ImageFile | RModelFile = repo.merge(entity, {
      metaData: request.file,
      url: request.file.location,
    });
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
          if (rmodel.rmodelFiles === undefined) {
            rmodel.rmodelFiles = [mEntity];
          } else {
            rmodel.rmodelFiles.push(mEntity);
          }
          res = await repo.save(mEntity);
          await getRepository(BathingspotModel).save(rmodel);
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
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
