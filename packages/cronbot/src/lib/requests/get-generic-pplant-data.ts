import { logger } from "./../../utils/logger";
import { buildReport } from "./../report";
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
  for (const spot of spots) {
    const opts = await gotOptionsFactory({
      url: `${API_URL}/users/${spot.userId}/bathingspots/${spot.spotId}/${type}`,
    });
    // console.log(opts);
    try {
      const res = await got(opts);
      try {
        const json = JSON.parse(res.body);
        for (const item of json.data) {
          if (item.url !== undefined && item.url !== null) {
            const data: IGeneric = {
              type: type === "genericInputs" ? "Generische Werte" : "Klärwerk",
              pgId: item.id,
              name: item.name,
              id: shortid.generate(),
              user: { id: spot.userId, email: spot.email },
              spot: { id: spot.spotId, name: spot.spotName },
              url: item.url,
              data: [],
            };
            try {
              const response = await got(item.url);

              try {
                const jdata = JSON.parse(response.body);
                const uniqueData = unique(jdata.data, "date");
                data.data = uniqueData.map((elem: any) => {
                  elem.comment = "cronbot";
                  return elem;
                });
                // woohoo! \o/ success!
                db.addGenerics(type, data);
              } catch (eParse) {
                const report = buildReport({
                  id: data.id,
                  message: `Could not parse ${type} data from ${item.url}. Message: "${eParse.message}"`,
                  source: data,
                  stack: JSON.stringify(eParse.stack),
                  email: spot.email,
                  type: "dataparse",
                });
                logger.err(eParse);
                db.addReports(report);
              } // Done! woohoo! \o/
            } catch (eGetItemData) {
              const report = buildReport({
                id: data.id,
                message: `Could not get ${type} from ${item.url}. Message: "${eGetItemData.message}"`,
                source: data,
                stack: JSON.stringify(eGetItemData.stack),
                email: spot.email,
                type: "dataget",
              });
              logger.err(eGetItemData);
              db.addReports(report);
            }
          }
        }
      } catch (eParsePGApi) {
        // parsing data from pgapi did not work
        const report = buildReport({
          id: "",
          message: `${type} Message: "${eParsePGApi.message}"`,
          source: spot,
          type: "admin",
          stack: JSON.stringify(eParsePGApi.stack),
          email: "admin",
        });
        logger.err(eParsePGApi);
        db.addReports(report);
      }
    } catch (eGetGeneric) {
      // get GI or PP from postgres api did not work
      const report = buildReport({
        id: "",
        message: `${type} Message: "${eGetGeneric.message}"`,
        source: spot,
        type: "admin",
        stack: JSON.stringify(eGetGeneric.stack),
        email: "admin",
      });
      logger.err(eGetGeneric);
      db.addReports(report);
    }
  } // end of for loop
};
