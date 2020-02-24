/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { IObject } from '../common/interfaces';

module.exports = async function postPassThrough(
  _url: string,
  body: IObject,
): Promise<IObject> {
  return await new Promise((resolve) => {
    resolve(body);
  });
};
