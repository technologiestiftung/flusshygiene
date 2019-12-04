import { ErrorRequestHandler } from 'express';
export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (process.env.NODE_ENV === 'development') {
    response.status(500).json({ error });
  } else {
    response.status(500).json({ message: error.message });
  }
};
