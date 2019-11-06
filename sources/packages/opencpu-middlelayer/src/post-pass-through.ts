import { IObject } from './common/interfaces';
import { OCPU_API_HOST } from './common/constants';
import got from 'got';
import { logger } from './logger';

/**
 * Pass POST Request through to another server
 */
const postPassThrough: (
  url: string,
  body: IObject,
) => Promise<IObject> = async (url, body) => {
  try {
    const gres = await got.post(url, {
      json: true,
      body,
      baseUrl: OCPU_API_HOST,
    });
    return gres.body;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    } else {
      logger.error(error);
    }
    return error;
  }
};

export { postPassThrough };
