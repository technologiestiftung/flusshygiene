import { Request, Response } from "express";
import { mailer } from "./mailer";

export function getHandler(req: Request, res: Response): void {
  res.status(200).json({ url: req.url, type: req.method, secure: false });
}

export function postHandler(req: Request, res: Response): void {
  try {
    mailer(req.body);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
}
