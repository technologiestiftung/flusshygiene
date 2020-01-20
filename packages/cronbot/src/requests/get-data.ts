import { getToken } from "../auth/token";
import { API_URL } from "../common/env";
import got from "got";
import { IObject } from "../common/interfaces";
interface IApiResponse {
  data: any[];
  success: boolean;
  apiVersion: string;
}

interface IUser {
  id: number;
  email: string;
  spots: ISpot[];
}
interface IAPiEndpoints {
  [key: string]: any;
}
interface ISpot {
  id: number;
  apiEndpoints: IAPiEndpoints;
}
interface ISpotsCollection {
  users: IUser[];
}
export const getAllUsers: () => Promise<IApiResponse> = async () => {
  try {
    const token = await getToken();
    // console.log(token); // eslint-disable-line
    const userRes = await got({
      url: `${API_URL}/users`,
      headers: { authorization: token },
    }).json();
    // console.log(userRes.body); // eslint-disable-line
    // const res: IApiResponse = { data: [], success: true, apiVersion: "" };
    return userRes;
  } catch (error) {
    return error;
  }
};

export const getSpots: () => Promise<ISpotsCollection> = async () => {
  try {
    const users = await getAllUsers();
    const token = await getToken();

    const collection: ISpotsCollection = {
      users: [],
    };
    const getSpotsTasks = users.data.map(
      (user) =>
        new Promise(async (resolve, reject) => {
          try {
            const res = await got({
              url: `${API_URL}/users/${user.id}/bathingspots`,
              headers: { authorization: token },
            });
            const json = JSON.parse(res.body);

            // console.log(json);
            const u: IUser = {
              id: user.id,
              email: user.email,
              spots: json.data.map((spot: IObject) => {
                if (spot.id === 41) {
                  console.log(spot.apiEndpoints);
                }
                const s: ISpot = {
                  id: spot.id,
                  apiEndpoints: spot.apiEndpoints,
                };
                return s;
              }),
            };
            collection.users.push(u);
            resolve();
          } catch (error) {
            reject(error);
          }
        }),
    );
    await Promise.all(getSpotsTasks).catch((err) => {
      throw err;
    });
    return collection;
  } catch (error) {
    return error;
  }
};
