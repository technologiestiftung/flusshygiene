import  lineByLine from 'n-readlines';
import { Bathingspot } from './../orm/entity/Bathingspot';
import { readdir, readFile, statSync } from 'fs';
import { extname, resolve } from 'path';
import proj4 from 'proj4';
import { promisify } from 'util';
import { IObject } from '../lib/common';
import { createSpotWithValues } from '../lib/utils/spot-helpers';
import { createMeasurementWithValues } from '../lib/utils/measurement-helpers';
import { createPredictionWithValues } from '../lib/utils/predictions-helpers';
import { BathingspotMeasurement } from '../orm/entity/BathingspotMeasurement';
import { BathingspotPrediction } from '../orm/entity/BathingspotPrediction';
import { getRepository } from 'typeorm';


const readFileAsync = promisify(readFile);
const readDirAsync = promisify(readdir);

console.info('You need to run this from a npm script in the root of the repo.');
const dataDirPath = resolve(process.cwd(), './data');
proj4.defs([
  [
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  [
    'EPSG:25833',
    '+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  ],
  [
    'ETRS89',
    "+proj=longlat +ellps=GRS80 +no_defs",
  ]
]);

const nameMappingPredictions: IObject = {
  badestellen_id: { type: 'number', parseTo: null, mapsTo: 'oldId' },
  date: { type: 'date', parseTo: null, mapsTo: 'date' },
  prediction: { type: 'string', parseTo: null, mapsTo: 'prediction' },
};

const nameMappingMeasurements: IObject = {
  algen: { type: 'boolean', parseTo: null, mapsTo: 'algen' }, /* might also be a number */
  algen_txt: { type: 'string', parseTo: null, mapsTo: 'algenTxt' },
  badestellen_id: { type: 'number', parseTo: null, mapsTo: 'detailId' },
  bsl: { type: 'string', parseTo: null, mapsTo: 'bsl' },
  cb: { type: 'number', parseTo: null, mapsTo: 'cb' },
  cb_txt: { type: 'string', parseTo: null, mapsTo: 'cbTxt' },
  date: { type: 'date', parseTo: null, mapsTo: 'date' },
  eco: { type: 'number', parseTo: null, mapsTo: 'conc_ec' },
  eco_txt: { type: 'string', parseTo: null, mapsTo: 'conc_ec_txt' },
  ente: { type: 'number', parseTo: null, mapsTo: 'conc_ie' },
  ente_txt: { type: 'string', parseTo: null, mapsTo: 'conc_ie_txt' },
  id: { type: 'number', parseTo: null, mapsTo: 'oldId' },
  sicht: { type: 'number', parseTo: null, mapsTo: 'sicht' },
  sicht_txt: { type: 'string', parseTo: null, mapsTo: 'sichtTxt' },
  state: { type: 'string', parseTo: null, mapsTo: 'state' },
  temp: { type: 'number', parseTo: null, mapsTo: 'temp' },
  temp_txt: { type: 'string', parseTo: null, mapsTo: 'tempTxt' },
  wasserqualitaet: { type: 'number', parseTo: null, mapsTo: 'wasserqualitaet' },
  wasserqualitaet_txt: { type: 'string', parseTo: null, mapsTo: 'wasserqualitaetTxt' },
};

export const nameMappingDEMeasurements: IObject = {
  SAMPLE_DATE: { type: 'date', parseTo: null, mapsTo: 'date' },
  CONC_EC: { type: 'string', parseTo: null, mapsTo: 'conc_ec' },
  CONC_IE: { type: 'string', parseTo: null, mapsTo: 'conc_ie' },
}

// special case category needs to be parsed to BSpotCat
export const nameMappingsDESpots: IObject = {
  BWID: { type: 'string', parseTo: null, mapsTo: 'bwId' },
  BW_NAME: { type: 'string', parseTo: null, mapsTo: 'nameLong' },
  SHORT_BW_NAME: { type: 'string', parseTo: null, mapsTo: 'name' },
  // LONGITUDE_BW: { type: 'number', parseTo: null, mapsTo: 'longitude' },
  // LATITUDE_BW: { type: 'number', parseTo: null, mapsTo: 'latitude' },
  COORDSYS_BW: { type: 'string', parseTo: null, mapsTo: 'coordinateSystem' },
  BW_TYPE: { type: 'number', parseTo: null, mapsTo: 'type' },
  // BWATER_CAT: { type: 'string', parseTo: null, mapsTo: 'coordinateSystem' },


}
const nameMappingSpots: IObject = {
  barrierefrei: { type: 'boolean', parseTo: null, mapsTo: 'disabilityAccess' },
  barrierefrei_wc: { type: 'boolean', parseTo: null, mapsTo: 'disabilityAccessBathrooms' },
  barrierefrei_zugang: { type: 'boolean', parseTo: null, mapsTo: 'hasDisabilityAccesableEntrence' },
  bezirk: { type: 'string', parseTo: null, mapsTo: 'district' },
  cyano_moeglich: { type: 'boolean', parseTo: null, mapsTo: 'cyanoPossible' },
  detail_id: { type: 'number', parseTo: null, mapsTo: 'detailId' },
  gesundheitsamt_mail: { type: 'string', parseTo: null, mapsTo: 'healthDepartmentMail' },
  gesundheitsamt_name: { type: 'string', parseTo: null, mapsTo: 'healthDepartment' },
  gesundheitsamt_plz: { type: 'string', parseTo: 'number', mapsTo: 'healthDepartmentPostalCode' },
  gesundheitsamt_stadt: { type: 'string', parseTo: null, mapsTo: 'healthDepartmentCity' },
  gesundheitsamt_strasse: { type: 'string', parseTo: null, mapsTo: 'healthDepartmentStreet' },
  gesundheitsamt_telefon: { type: 'string', parseTo: null, mapsTo: 'healthDepartmentPhone' },
  gesundheitsamt_zusatz: { type: 'string', parseTo: null, mapsTo: 'healthDepartmentAddition' },
  gewaesser: { type: 'string', parseTo: null, mapsTo: 'water' },
  hundeverbot: { type: 'boolean', parseTo: null, mapsTo: 'dogban' },
  id: { type: 'number', parseTo: null, mapsTo: 'oldId' },
  image: { type: 'string', parseTo: null, mapsTo: 'image' },
  imbiss: { type: 'boolean', parseTo: null, mapsTo: 'snack' },
  letzte_eu_einstufung: { type: 'string', parseTo: null, mapsTo: 'lastClassification' },
  lat: { type: 'string', parseTo: 'float', mapsTo: 'latitude' },
  lng: { type: 'string', parseTo: 'float', mapsTo: 'longitude' },
  messstelle: { type: 'string', parseTo: null, mapsTo: 'measuringPoint' },
  name: { type: 'string', parseTo: null, mapsTo: 'name' },
  name_lang: { type: 'string', parseTo: null, mapsTo: 'nameLong' },
  name_lang2: { type: 'string', parseTo: null, mapsTo: 'nameLong2' },
  parken: { type: 'boolean', parseTo: null, mapsTo: 'parkingSpots' },
  plz: { type: 'string', parseTo: 'number', mapsTo: 'postalCode' },
  prediction: { type: 'boolean', parseTo: null, mapsTo: 'hasPrediction' },
  restaurant: { type: 'boolean', parseTo: null, mapsTo: 'restaurant' },
  rettungsschwimmer: { type: 'boolean', parseTo: null, mapsTo: 'lifeguard' },
  stadt: { type: 'string', parseTo: null, mapsTo: 'city' },
  strasse: { type: 'string', parseTo: null, mapsTo: 'street' },
  // tslint:disable-next-line: max-line-length
  wasserrettung_durch_hilfsorganisationen_dlrg_oder_asb: { type: 'boolean', parseTo: null, mapsTo: 'waterRescueThroughDLRGorASB' },
  wc: { type: 'boolean', parseTo: null, mapsTo: 'bathrooms' },
  wc_mobil: { type: 'boolean', parseTo: null, mapsTo: 'bathroomsMobile' },
  webseite: { type: 'string', parseTo: null, mapsTo: 'website' },
};

export interface ILatestfileOptions {
  extension: string;
  prefix: string;
  dataDirPath: string;
}
export const getLatestFile: (opts: ILatestfileOptions) => Promise<string | undefined> = async (opts) => {
  try {
    // const filePath: string = '';
    const files = await readDirAsync(opts.dataDirPath, 'utf8');
    const filteredFiles = files.filter(file => extname(file) === opts.extension)
      .filter(file => file.indexOf(opts.prefix) !== -1)
      .map((fn) => {
        return {
          name: fn,
          time: statSync(`${opts.dataDirPath}/${fn}`).mtime.getTime(),
        };
      }).sort((a, b) => {
        return a.time - b.time;
      });
    if (filteredFiles.length === 0) {
      return undefined;
    } else {
      const fileName = filteredFiles[filteredFiles.length - 1].name;
      return `${opts.dataDirPath}/${fileName}`;
    }
  } catch (error) {
    throw error;
  }
};

export const mapObjects: (mappingObj: IObject, obj: IObject) => IObject = (mappingObj, obj) => {
  const keys: string[] = Object.keys(obj);
  const resItem: IObject = {};
  keys.forEach((key: string) => {
    if (obj.hasOwnProperty(key)) {

      if (obj[key] !== null && obj[key] !== undefined) {

        if (mappingObj.hasOwnProperty(key)) {
          // if (mappingObj[key].type === 'number' && typeof obj[key] !== 'number') {

          //   // console.log(key);
          //   // console.log(obj.name);
          //   // console.log('gotcha');
          // }
          switch (mappingObj[key].type) {
            case 'string':
              // this is for edge cases where we need to parse a value
              if (mappingObj[key].parseTo !== null) {
                switch (mappingObj[key].parseTo) {
                  case 'float':
                    resItem[mappingObj[key].mapsTo] = parseFloat(obj[key]);
                    break;
                  case 'number':
                    resItem[mappingObj[key].mapsTo] = parseInt(obj[key], 10);

                    break;
                }
              } else {
                resItem[mappingObj[key].mapsTo] = obj[key];
              }
              break;
            case 'boolean':
              // if (key === 'barrierefrei_zugang') {
              //   console.log(obj[key]);
              //   console.log(typeof obj[key]);
              // }
              if (typeof obj[key] === 'boolean') {
                resItem[mappingObj[key].mapsTo] = obj[key];
              } else if (typeof obj[key] === 'number') {
                switch (obj[key]) {
                  case 1:
                    resItem[mappingObj[key].mapsTo] = true;
                    break;
                  case 0:
                    resItem[mappingObj[key].mapsTo] = false;
                    break;
                }
              } else if (typeof obj[key] === 'string') {
                switch (obj[key]) {
                  case '1':
                    resItem[mappingObj[key].mapsTo] = true;
                    break;

                  case '0':
                    resItem[mappingObj[key].mapsTo] = false;
                    break;
                }
              }
              break;
            case 'number':
              resItem[mappingObj[key].mapsTo] = obj[key];
              break;
            case 'date':
              resItem[mappingObj[key].mapsTo] = new Date(obj[key]);
              break;
          }
        }
      }
    }
  });
  return resItem;
};

export const createPredictions: () => Promise<BathingspotPrediction[]> = async () => {
  try {
    const opts: ILatestfileOptions = {
      dataDirPath,
      extension: '.json',
      prefix: 'predictions',
    };
    const predictionsJsonPath = await getLatestFile(opts);
    if (predictionsJsonPath === undefined) {
      throw new Error(`Can not find measurement-[TIMESTAMP].json
  generated from manual export of sqlite3.db
  of badestellen/data-server app`);
    }
    const jsonString = await readFileAsync(predictionsJsonPath, 'utf8');
    const data = JSON.parse(jsonString);
    const res: IObject[] = [];
    data.forEach((datum: IObject) => {
      const predictionsObj = mapObjects(nameMappingPredictions, datum);
      res.push(predictionsObj);
    });
    const predictions: BathingspotPrediction[] = [];
    for (const obj of res) {
      const prediction = await createPredictionWithValues(obj);
      predictions.push(prediction);
    }
    return predictions;
  } catch (error) {
    throw error;
  }
};
export const createMeasurements: () => Promise<BathingspotMeasurement[]> = async () => {
  try {

    const opts: ILatestfileOptions = {
      dataDirPath,
      extension: '.json',
      prefix: 'measurements',
    };
    const measurementsJsonPath = await getLatestFile(opts);
    if (measurementsJsonPath === undefined) {
      throw new Error(
        `Can not find measurements-[TIMESTAMP].json
          generated from manual export of sqlite3.db
          of badestellen/data-server app`,
      );
    }
    const jsonString = await readFileAsync(measurementsJsonPath, 'utf8');
    const data = JSON.parse(jsonString);
    // clean the data
    const res: any[] = [];
    data.forEach((datum: IObject) => {
      // if (datum.hasOwnProperty('id')) {
      //   delete datum.id;
      // }

      const measurementObj = mapObjects(nameMappingMeasurements, datum);
      res.push(measurementObj);
    });
    const measurements: BathingspotMeasurement[] = [];
    for (const obj of res) {
      const measurement = await createMeasurementWithValues(obj);
      measurements.push(measurement);
    }
    return measurements;
  } catch (error) {
    throw error;
  }
};


export const createSpots: () => Promise<Bathingspot[]> = async () => {
  try {

    const opts: ILatestfileOptions = {
      dataDirPath,
      extension: '.json',
      prefix: 'bathingspots',
    };
    const spotsJsonPath = await getLatestFile(opts);
    if (spotsJsonPath === undefined) {
      throw new Error(
        `Can not find bathingspots-[TIMESTAMP].json
          generated from manual export of sqlite3.db
          of badestellen/data-server app`,
      );
    }
    const jsonString = await readFileAsync(spotsJsonPath, 'utf8');

    const data = JSON.parse(jsonString);
    const res: any[] = [];

    // clean the BathingspotRawModelData

    data.forEach((datum: any, i: number, arr: any[]) => {
      // const spot: IObject = {};
      // if (datum.hasOwnProperty('id')) {
      //   delete arr[i].id;
      // }
      let coord: any[];
      if (datum.hasOwnProperty('ost') && datum.hasOwnProperty('nord')) {
        try {
          coord = proj4('EPSG:25833', 'EPSG:4326', [datum.ost, datum.nord]);
          arr[i].latitude = parseFloat(coord[1].toFixed(5));
          arr[i].longitude = parseFloat(coord[0].toFixed(5));
        } catch (err) {
          console.log('err', err);
        }
      }
      const spot = mapObjects(nameMappingSpots, datum);
      // const keys: string[] = Object.keys(datum);
      // keys.forEach((key: string) => {
      //   if (datum.hasOwnProperty(key)) {
      //     if (nameMappingSpots.hasOwnProperty(key)) {
      //       switch (nameMappingSpots[key].type) {
      //         case 'string':
      //           spot[nameMappingSpots[key].parseTo:null,mapsTo] = datum[key];
      //           break;
      //         case 'boolean':
      //           spot[nameMappingSpots[key].parseTo:null,mapsTo] = datum[key];
      //           break;
      //         case 'number':
      //           spot[nameMappingSpots[key].parseTo:null,mapsTo] = datum[key];
      //           break;
      //       }
      //     }
      //   }
      // });
      spot.isPublic = true;
      const geojson: IObject = {
        geometry:
          { type: 'Point', coordinates: [datum.longitude, datum.latitude] }, properties: { name: datum.name },
        type: 'Feature',
      };

      spot.location = geojson;
      res.push(spot);
    });

    const spots: Bathingspot[] = [];
    for (const item of res) {
      const spot = await createSpotWithValues(item);
      spots.push(spot);
    }
    return spots;

  } catch (error) {
    throw error;
  }
};

export const createSpotsDE: ()=> Promise<Bathingspot[]> = async ()=>{
  try {
    const optsJsonl: ILatestfileOptions = {
      dataDirPath,
      extension: '.jsonl',
      prefix: 'badegewaesser'
    }
    // unhandled promise rejection
    const spotsJsonLPath = await getLatestFile(optsJsonl);
    // console.log(spotsJsonLPath);
    const deSpots: Bathingspot[] = [];
    if (spotsJsonLPath === undefined) {
      throw new Error(`Can not find badegewaesser-[TIMESTAMP].jsonl
      generated from manual export of @tsb/flusshygiene-badestellen-de/parsing
      of badegewaesser.csv`,);
    } else {
      const liner = new lineByLine(spotsJsonLPath);
      let line;
      let lineNumber = 0;
      const spotRepo = getRepository(Bathingspot);
      const measRepo = getRepository(BathingspotMeasurement);
      while (line = liner.next()) {
        console.log(`Line ${lineNumber} of jsonl`);
        const json = JSON.parse(line);
        const spot = new Bathingspot();
        let newSpot: Bathingspot;
        for (let i = 0; i < json.length; i++) {
          // needs to be sync
          if (json[i].BWID === null) {
            continue;
          }
          if (i === 0) {
            console.log(`creating spot ${json[i].BWID}`);
            const spotDataMapped = mapObjects(nameMappingsDESpots, json[i]);
            spotRepo.merge(spot, spotDataMapped);
            const latUnparsed = json[i].LATITUDE_BW;
            const lonUnparsed = json[i].LONGITUDE_BW;
            // const coords = proj4('ETRS89', 'EPSG:4326', [lonUnparsed, latUnparsed]);
            const coords = [lonUnparsed, latUnparsed];
            const geojson: IObject = {
              geometry:
                { type: 'Point', coordinates: [parseFloat(coords[1]), parseFloat(coords[0])] }, properties: { name: json[0].BWID },
              type: 'Feature',
            };
            spot.longitude = parseFloat(coords[1]);
            spot.latitude = parseFloat(coords[0]);
            spot.location = geojson.geometry;
            spot.isPublic = true;
            newSpot = await spotRepo.save(spot);
            deSpots.push(newSpot);

          } // end of first element
          const meas = new BathingspotMeasurement();
          // console.log(`creating measurement ${i} for spot ${json[i].BWID}`);
          process.stdout.write(' . ');
          const measurementDataMapped = mapObjects(nameMappingDEMeasurements, json[i]);
          measRepo.merge(meas, measurementDataMapped);
          if (newSpot!.measurements === undefined) {
            newSpot!.measurements = [meas];
          } else {
            newSpot!.measurements.push(meas);
          }


          measRepo.save(meas);
          await spotRepo.save(newSpot!);
          // await measRepo.save(meas);
          if(i === json.length -1){
            deSpots.push(newSpot!);
          }
        }
        lineNumber++;
      }
    }
    return deSpots;
  } catch (error) {
    throw error;
  }
}
