import { gotOptionsFactory } from "../utils/got";
import { API_URL } from "../common/env";
import got from "got";
import { IApiResponse, IApiEndpoints } from "../common/interfaces";
export const getSpotsRequest: (
  userId: string | number,
) => Promise<IApiResponse> = async (userId) => {
  try {
    const opts = await gotOptionsFactory({
      url: `${API_URL}/users/${userId}/bathingspots`,
    });
    const res = await got(opts).json();
    return res;
  } catch (error) {
    return error;
  }
};
export interface Spot {
  spotId: number;
  spotName: string;
  userId: number;
  email: string;
  apiEndpoints: IApiEndpoints;
}
export const getSpots: (users: IApiResponse) => Promise<Spot[]> = async (
  users,
) => {
  try {
    const result: Spot[] = [];
    // const collection: IUserCollection = {
    //   users: [],
    // };
    const getSpotsTasks = users.data.map(
      (user) =>
        new Promise(async (resolve, reject) => {
          try {
            const json = await getSpotsRequest(user.id); //  JSON.parse
            if (json.data.length <= 0) {
              resolve();
            }
            // console.log(json.data);
            for (const spot of json.data) {
              if (
                spot.apiEndpoints !== null &&
                Object.keys(spot.apiEndpoints).length > 0
              ) {
                // console.log(spot);
                result.push({
                  spotId: spot.id,
                  spotName: spot.name,
                  userId: user.id,
                  email: user.email,
                  apiEndpoints: spot.apiEndpoints,
                });
              }
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        }),
    );
    await Promise.all(getSpotsTasks).catch((err) => {
      throw err;
    });
    return result;
  } catch (error) {
    return error;
  }
};
