import { IGeneric } from "./common/interfaces";
import got from "got";
import { gotOptionsFactory } from "./utils/got";
import { Spot } from "./requests/get-spots";
import { API_URL } from "./common/env";
import { DB, GenericType } from "./DB";
import shortid = require("shortid");

const db = DB.getInstance();
export const getGenericData: (
  type: GenericType,
  spots: Spot[],
) => Promise<void> = async (type, spots) => {
  try {
    for (const spot of spots) {
      const opts = await gotOptionsFactory({
        url: `${API_URL}/users/${spot.userId}/bathingspots/${spot.spotId}/${type}`,
      });
      const res = await got(opts);
      const json = JSON.parse(res.body);
      for (const item of json.data) {
        if (item.url !== undefined && item.url !== null) {
          const response = await got(item.url);
          const jdata = JSON.parse(response.body);
          // console.log(jdata);
          const data: IGeneric = {
            id: shortid.generate(),
            user: { id: spot.userId, email: spot.email },
            spot: { id: spot.spotId, name: spot.spotName },
            url: item.url,
            data: jdata.data,
          };
          db.addGenenrics(type, data);
        }
      }
    }
  } catch (error) {
    return error;
  }
};
