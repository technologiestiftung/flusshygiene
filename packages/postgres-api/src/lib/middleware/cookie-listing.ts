// connect.sid=s%3A28554d33-b610-45e9-ad7a-612c428b9051.xwLDwrIDbYYjKXMCnNpU6i8z31pn%2BrImaKPdNDIvQ1A; path=/; domain=localhost; HttpOnly;
import { NextFunction, Request, Response } from 'express';
import { logger } from '../logger';

export const cookieListing = async (
  request: Request,
  _response: Response,
  next: NextFunction,
) => {
  if (process.env.NODE_ENV === 'development') {
    logger.info(`Session ID ${request.sessionID}`);
  }
  next();
};
