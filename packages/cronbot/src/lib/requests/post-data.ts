import { logger } from "./../../utils/logger";
import { IGeneric, IEndpoints } from "../../common/interfaces";
import { GenericType } from "../../common/types";
import { gotOptionsFactory } from "../../utils/got-util";
import { API_URL } from "../../common/env";
import got, { HTTPError, Response } from "got";
import { buildReport } from "../report";
import { DB } from "../DB";
const db = DB.getInstance();

function postErrorReport(
  item: IGeneric | IEndpoints,
  type: string,
  postError: HTTPError,
) {
  const report = buildReport({
    id: item.id,
    source: item,
    message: `Could not post ${type} data to flusshygiene API`,
    type: "datapost",
    email: item.user.email,
    stack: JSON.stringify(postError.stack),
    specifics: `spot: ${item.spot.id} user: ${item.user.id} mail: ${item.user.email} type: ${type}`,
  });
  logger.error(JSON.stringify(postError));
  db.addReports(report);
}

function responseParseAndReport(
  response: Response<string>,
  item: IGeneric | IEndpoints,
  type: string,
) {
  try {
    const json = JSON.parse(response.body);
    // console.log(json);
    if (json.success === false) {
      json.data.forEach((elem: any) => {
        if (
          elem.hasOwnProperty("name") === true &&
          elem.name === "DuplicateError"
        ) {
        }
        // console.log(elem);
        const report = buildReport({
          id: item.id,
          source: item,
          message: `"DuplicateError". Some elements could not be inserted into the database`,
          type: "datapost",
          email: item.user.email,
          stack: elem.duplicates,
          specifics: `spot: ${item.spot.id} user: ${item.user.id} mail: ${item.user.email} type: ${type}`,
        });
        logger.error(JSON.stringify(elem));
        db.addReports(report);
      });
    }
  } catch (resParseError) {
    const report = buildReport({
      id: item.id,
      source: item,
      message: `Could not parse ${type} response from flusshygiene API`,
      type: "admin",
      email: "admin",
      stack: JSON.stringify(resParseError.stack),
      specifics: `spot: ${item.spot.id} user: ${item.user.id} mail: ${item.user.email} type: ${type}`,
    });
    logger.error(JSON.stringify(resParseError));
    db.addReports(report);
  }
}

export const postGenerics: (
  type: GenericType,
  data: IGeneric[],
) => Promise<void> = async (type, data) => {
  try {
    // console.log("postdata");
    for (const item of data) {
      const opts = await gotOptionsFactory({
        url: `${API_URL}/users/${item.user.id}/bathingspots/${item.spot.id}/${type}/${item.pgId}/measurements`,
        json: item.data,
      });
      // console.log(opts);
      try {
        const response = await got.post(opts as any); // TODO: Could throw
        responseParseAndReport(response, item, type);
      } catch (postError) {
        postErrorReport(item, type, postError);
      }
      // console.log(JSON.parse(res.body));
    }
  } catch (error) {
    console.error(JSON.stringify(error));
    throw error;
  }
};

export const postApiEndpoints: (
  data: IEndpoints[],
) => Promise<boolean> = async (data) => {
  try {
    // console.log(data.length, "data.length");
    // let count = 0;

    for (const item of data) {
      const BASE_URL = `${API_URL}/users/${item.user.id}/bathingspots/${item.spot.id}`;
      if (item.discharges.length > 0) {
        // console.log("posting discharges");
        // console.log(item.discharges);
        const opts = await gotOptionsFactory({
          url: `${BASE_URL}/discharges`,
          json: item.discharges,
        });
        try {
          const response = await got.post(opts); // TODO: Could throw
          responseParseAndReport(response, item, "discharges");
        } catch (ePostDischarge) {
          if (ePostDischarge instanceof HTTPError) {
            // console.log(ePostDischarge.response.body);
          }
          // delete item.discharges;
          // delete item.measurements;
          // delete item.globalIrradiances;
          postErrorReport(item, "discharges", ePostDischarge);
        }
        // console.log(response.body);
      }

      if (item.measurements.length > 0) {
        const opts = await gotOptionsFactory({
          url: `${BASE_URL}/measurements`,
          json: item.measurements,
        });
        try {
          const response = await got.post(opts); // TODO: Could throw
          responseParseAndReport(response, item, "measurements");
        } catch (ePostMeasurements) {
          postErrorReport(item, "measurements", ePostMeasurements);
        }

        // console.log(response.body);
      }
      if (item.globalIrradiances.length > 0) {
        const opts = await gotOptionsFactory({
          url: `${BASE_URL}/globalIrradiances`,
          json: item.globalIrradiances,
        });
        try {
          const response = await got.post(opts); // TODO: Could throw
          responseParseAndReport(response, item, "globalIrradiances");
        } catch (ePostGlobalIrradiance) {
          postErrorReport(item, "globalIrradiances", ePostGlobalIrradiance);
        }
        // console.log(response.body);
      }
      // console.log(count);
      // count++;
    }
    return true;
  } catch (error) {
    if (error instanceof HTTPError) {
      logger.error(error.response.body);
    }
    logger.error(JSON.stringify(error));
    logger.error(error.message);
    throw error;
  }
};
