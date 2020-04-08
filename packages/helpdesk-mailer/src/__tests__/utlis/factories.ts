import { GenericObject } from "../../lib/common/interfaces";
import { Request, Response } from "express";

export function buildRes(overrides?: GenericObject): Response {
  const res: unknown = {
    setTimeout: jest.fn(() => res),
    json: jest.fn(() => res),
    status: jest.fn(() => res),
    statusCode: 200,
    ...overrides,
  };

  return res as Response;
}
export function buildReq(overrides?: GenericObject): Request {
  const req: unknown = {
    setTimeout: jest.fn(() => req),
    url: "/",
    ...overrides,
  };
  return req as Request;
}
export function buildNext(): jest.Mock<any, any> {
  return jest.fn().mockName("next");
}
