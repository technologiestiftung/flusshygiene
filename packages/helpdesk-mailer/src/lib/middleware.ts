import { Request, Response, NextFunction } from "express";
export function propertyCheckMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  let hasEmail = false;
  let hasName = false;
  let hasText = false;
  if (Object.prototype.hasOwnProperty.call(req.body, "email") === true) {
    hasEmail = true;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "name") === true) {
    hasName = true;
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "text") === true) {
    hasText = true;
  }
  if (hasEmail === false || hasName === false || hasText === false) {
    const message = `Die folgenden Informationen fehlen:
    ${hasEmail ? "" : "E-Mail"}
    ${hasName ? "" : "Name"}
    ${hasText ? "" : "Text"}
    `;
    res.status(400).json({ message, success: false });
  } else {
    next();
  }
}
