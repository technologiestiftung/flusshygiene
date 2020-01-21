import { IDataCollection, ISpotData } from "./../common/interfaces";
import { gotOptionsFactory } from "./../utils/got";
import { API_URL } from "../common/env";
import got from "got";
import {
  IObject,
  IApiResponse,
  IUserCollection,
  IUser,
  ISpot,
} from "../common/interfaces";

export const getUsersRequest: (url: string) => Promise<IApiResponse> = async (
  url,
) => {
  try {
    // console.log(API_URL);
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

export const getSubItemsRequest: (
  url: string,
) => Promise<IApiResponse> = async (url) => {
  try {
    const opts = await gotOptionsFactory({
      url,
    });
    const res = await got(opts).json();
    // const json = JSON.parse(res.body);
    return res;
  } catch (error) {
    return error;
  }
};

export const getSpots: (
  users: IApiResponse,
) => Promise<IUserCollection> = async (users) => {
  try {
    const collection: IUserCollection = {
      users: [],
    };
    const getSpotsTasks = users.data.map(
      (user) =>
        new Promise(async (resolve, reject) => {
          try {
            const json = await getSpotsRequest(user.id); //  JSON.parse
            if (json.data.length <= 0) {
              resolve();
            }
            const u: IUser = {
              id: user.id,
              email: user.email,
              spots: json.data.map((spot: IObject) => {
                const s: ISpot = {
                  id: spot.id,
                  apiEndpoints: spot.apiEndpoints,
                  purificationPlants: [],
                  genericInputs: [],
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
    for (let i = collection.users.length - 1; i >= 0; i--) {
      if (collection.users[i].spots.length === 0) {
        collection.users.splice(i, 1);
      }
    }
    return collection;
  } catch (error) {
    return error;
  }
};

export const getRemoteData: (
  collection: IUserCollection,
) => Promise<IDataCollection> = async (collection) => {
  try {
    const tasks: Promise<void>[] = [];
    const data: IDataCollection = { users: [] };
    collection.users.forEach((user, userIndex) => {
      data.users.push({ ...collection.users[userIndex], spots: [] });
      user.spots.forEach((spot, spotIndex) => {
        const spotData: ISpotData = {
          ...spot,
          apiEndpointsData: {
            dischargesData: [],
            globalIrradianceData: [],
            measurementsData: [],
          },
          purificationPlantsData: [],
          genericInputsData: [],
        };

        data.users[userIndex].spots.push(spotData);

        Object.keys(spot.apiEndpoints).forEach((key) => {
          // console.log(key); // eslint-disable-line
          // console.log((spot.apiEndpoints as any)[key]); // eslint-disable-line
          const task: Promise<void> = new Promise(async (resolve, reject) => {
            try {
              const reqUrl = (spot.apiEndpoints as any)[key] as string;
              const res = await got(reqUrl).json();
              data.users[userIndex].spots[spotIndex].apiEndpointsData[
                key.replace("Url", "Data")
              ] = res;
              resolve();
            } catch (e) {
              reject(e);
            }
          });
          tasks.push(task);
        });
      });
    });
    await Promise.all(tasks).catch((err) => {
      console.error(err);
      throw err;
    });
    // console.log("data", JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    return error;
  }
};
