import { IObject } from './common/interfaces';
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
