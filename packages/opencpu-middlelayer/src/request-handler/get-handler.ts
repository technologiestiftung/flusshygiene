import { VERSION } from '../common/constants';
import { Request, Response } from 'express';
export const defaultResJson = {
  success: true,
  message: 'Everything OK',
  version: VERSION,
};
export const getHandler: (
  req: Request,
  res: Response,
) => Promise<void> = async (_req, res) => {
  // req.session!.name = 'foo';
  // console.log(req.session);
  res.json(defaultResJson);
};
