import { buildReport } from "./../report";
import got, { Response } from "got";
import {
  IMeasurement,
  IEndpoints,
  IMeasurementConc,
  Spot,
} from "../../common/interfaces";
import { DB } from "../DB";
import shortid from "shortid";
import { unique } from "../../utils/unique-values";

const db = DB.getInstance();

export const getApiEndpointsData: (spots: Spot[]) => Promise<void> = async (
  spots,
) => {
  // try {
  for (const spot of spots) {
    const data: IEndpoints = {
      id: shortid.generate(),
      user: { id: spot.userId as number, email: spot.email as string },
      spot: { id: spot.spotId as number, name: spot.spotName as string },
      discharges: [],
      measurements: [],
      globalIrradiances: [],
    };
    const report = buildReport({
      id: data.id,
      source: data,
      message: "",
      type: "dataget",
      email: spot.email,
    });
    if (spot.apiEndpoints.hasOwnProperty("measurementsUrl")) {
      data.measurementsUrl = spot.apiEndpoints.measurementsUrl;
      let m: IMeasurementConc[] = [];
      let measurements: Response<string>;

      try {
        measurements = await got(spot.apiEndpoints.measurementsUrl!);
        try {
          m = JSON.parse(measurements.body).data;
        } catch (eParse) {
          report.message = `Data from endpoint measurementsUrl ${spot.apiEndpoints.measurementsUrl} could not be parsed. Messag: " ${eParse.message}"`;
          report.stack = JSON.stringify(eParse);
          report.type = "dataparse";
          db.addReports({ ...report });
          // throw eParse;
        }
      } catch (eRead) {
        report.message = `Endpoint for measurementsUrl could not be read. Message "${eRead.message}"`;
        report.stack = JSON.stringify(eRead);
        report.type = "dataget";
        db.addReports({ ...report });
        // throw e;
      }
      // console.log(JSON.parse(measurements.body));
      data.measurements = unique(
        m.map((elem) => {
          elem.comment = "cronbot";
          return elem;
        }),
        "date",
      );
    }
    if (spot.apiEndpoints.hasOwnProperty("globalIrradianceUrl")) {
      let measurements: Response<string>;

      data.globalIrradianceUrl = spot.apiEndpoints.globalIrradianceUrl;
      let g: IMeasurement[] = [];
      try {
        measurements = await got(spot.apiEndpoints.globalIrradianceUrl!); // TODO: Could throw
        try {
          g = JSON.parse(measurements!.body).data; // TODO: Could throw
        } catch (eParse) {
          report.message = `Data from endpoint globalIrradianceUrl ${spot.apiEndpoints.globalIrradianceUrl} could not be parsed. Message: "${eParse.message}"`;
          report.stack = JSON.stringify(eParse);
          report.type = "dataparse";
          db.addReports({ ...report });
        }
      } catch (eRead) {
        report.message = `Endpoint for globalIrradianceUrl could not be read Message: "${eRead.message}"`;
        report.type = "dataget";
        report.stack = JSON.stringify(eRead);
        db.addReports({ ...report });
      }
      // console.log(JSON.parse(measurements.body));
      data.globalIrradiances = unique(
        g.map((elem) => {
          elem.comment = "cronbot";
          return elem;
        }),
        "date",
      );
    }
    if (spot.apiEndpoints.hasOwnProperty("dischargesUrl")) {
      let measurements: Response<string>;

      data.dischargesUrl = spot.apiEndpoints.dischargesUrl;
      let d: IMeasurement[] = [];
      try {
        measurements = await got(spot.apiEndpoints.dischargesUrl!); // TODO: Could throw
        try {
          d = JSON.parse(measurements.body).data; // TODO: Could throw
        } catch (eParse) {
          report.message = `Data from endpoint dischargesUrl ${spot.apiEndpoints.dischargesUrl} could not be parsed. Messag: " ${eParse.message}"`;
          report.stack = JSON.stringify(eParse);
          report.type = "dataparse";
          db.addReports({ ...report });
          // throw eParse;
        }
      } catch (eRead) {
        report.message = `Endpoint for dischargesUrl could not be read. Message "${eRead.message}"`;
        report.type = "dataget";
        report.stack = JSON.stringify(eRead);
        db.addReports({ ...report });
        // throw eRead;
      } // console.log(JSON.parse(measurements.body));
      data.discharges = unique(
        d.map((elem) => {
          elem.comment = "cronbot";
          return elem;
        }),
        "date",
      );
    }
    db.addEndpoints(data);
  }
  // } catch (error) {
  //   console.error(error);

  //   throw error;
  // }
};
