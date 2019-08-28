import AWS from 'aws-sdk';
import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import mime from 'mime';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { getRepository } from 'typeorm';
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
    if (collectionName !== 'images') {
      responder(response, HttpCodes.badRequest, {
        message: `"${collectionName}" cant process uploads`,
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

      // responder(
      //   response,
      //   HttpCodes.successCreated,
      //   successResponse(`${collectionName} file posted.`, [request.file]),
      // );
    }
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};

export const postFile: postResponse = async (request, response) => {
  try {
    const spotId = parseInt(request.params.userId, 10);
    // const userId = parseInt(request.params.spotId, 10);
    const collectionName = request.params.collectionName;
    const spot = await getSpotWithRelation(spotId, collectionName);
    const repoName = collectionRepoMapping[collectionName];

    const repo: any = getRepository(repoName);
    const entity = repo.create();
    const mergedEntity: ImageFile = repo.merge(entity, {
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
        }
        break;
      default:
        throw new Error('Other file upload not yet implemented');
    }
    await getRepository(Bathingspot).save(spot);
    responder(
      response,
      HttpCodes.successCreated,
      successResponse(`${collectionName} file posted.`, [request.file, res]),
    );
  } catch (error) {
    responder(response, HttpCodes.internalError, errorResponse(error));
  }
};
