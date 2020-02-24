import { IObject } from '../common/interfaces';

module.exports = async function postPassThrough(
  url: string,
  body: IObject,
): Promise<IObject> {
  return await new Promise((resolve) => {
    resolve(body);
  });
};
