import { IGeneric, Spot } from "../../common/interfaces";
import got from "got";
import { gotOptionsFactory } from "../../utils/got-util";
import { API_URL } from "../../common/env";
import { DB } from "../DB";
import shortid from "shortid";
import { GenericType } from "../../common/types";
import { unique } from "../../utils/unique-values";

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
      // console.log(opts);
      const res = await got(opts); // TODO: Could throw
      // console.log(res.body);
      const json = JSON.parse(res.body); // TODO: Could throw
      for (const item of json.data) {
        if (item.url !== undefined && item.url !== null) {
          const response = await got(item.url); // TODO: Could throw
          if (response.statusCode !== 200) {
            throw new Error(`could not get ${item.url}`);
          }

          // console.log(response.body);
          const jdata = JSON.parse(response.body); // TODO: Could throw
          const uniqueData = unique(jdata.data, "date");
          const data: IGeneric = {
            type: type === "genericInputs" ? "Generische Werte" : "Klärwerk",
            pgId: item.id,
            name: item.name,
            id: shortid.generate(),
            user: { id: spot.userId, email: spot.email },
            spot: { id: spot.spotId, name: spot.spotName },
            url: item.url,
            data: uniqueData.map((elem: any) => {
              elem.comment = "cronbot";
              return elem;
            }),
          };
          db.addGenerics(type, data);
        }
      }
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};
