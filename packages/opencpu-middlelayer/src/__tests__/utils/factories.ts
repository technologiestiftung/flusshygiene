interface GenericObject {
  [key: string]: any;
}
export function buildRes(overrides?: GenericObject): GenericObject {
  const res = {
    setTimeout: jest.fn(() => res),
    json: jest.fn(() => res),
    status: jest.fn(() => res),
    statusCode: 200,
    ...overrides,
  };

  return res;
}
export function buildReq(overrides?: GenericObject): GenericObject {
  const req = {
    setTimeout: jest.fn(() => req),
    url: '/',
    ...overrides,
  };
  return req;
}
export function buildNext(): jest.Mock<any, any> {
  return jest.fn().mockName('next');
}
