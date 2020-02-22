import { Request, Response, NextFunction } from 'express';

const apiTimeout = 900000; // 15 minutes
export type middlewareFunc = (
  request: Request,
  response: Response,
  next: NextFunction,
) => void;

export const timeoutMiddleware: middlewareFunc = (req, res, next) => {
  // Set the timeout for all HTTP requests
  req.setTimeout(apiTimeout, () => {
    const err = new Error('Request Timeout');
    res.statusCode = 408;
    next(err);
  });
  // Set the server response timeout for all HTTP requests
  res.setTimeout(apiTimeout, () => {
    const err = new Error('Service Unavailable');
    res.statusCode = 503;
    next(err);
  });
  next();
};

export const sleepFuncCheck: middlewareFunc = (req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.url === '/sleep') {
    const err = new Error('forbidden');
    res.statusCode = 403;
    next(err);
  }
  next();
};
