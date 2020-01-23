import { gotOptionsFactory } from "../utils/got";
import got from "got";
import { IApiResponse } from "../common/interfaces";
export const getUsersRequest: (url: string) => Promise<IApiResponse> = async (
  url,
) => {
  try {
    const opts = await gotOptionsFactory({ url: url });
    const res = await got(opts);
    return JSON.parse(res.body);
  } catch (error) {
    return error;
  }
};
export const getUsers: (url: string) => Promise<IApiResponse> = async (url) => {
  try {
    return await getUsersRequest(url);
  } catch (error) {
    return error;
  }
};
