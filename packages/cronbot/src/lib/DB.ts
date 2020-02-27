import path from "path";
import fs from "fs";
// https://github.com/typicode/lowdb/tree/master/examples#in-memory
// https://github.com/typicode/lowdb/issues/349
// const lowdb = require("lowdb"); // eslint-disable-line
// const FileSync = require("lowdb/adapters/FileSync"); // eslint-disable-line

import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import Memory from "lowdb/adapters/Memory";
import { IEndpoints, IGeneric, IReport, Spot } from "../common/interfaces";
import { GenericType } from "../common/types";
import { logger } from "../utils/logger";

export type Schema = {
  spots: Spot[];
  endpoints: IEndpoints[];
  genericInputs: IGeneric[];
  purificationPlants: IGeneric[];
  reports: IReport[];
};

const defaultState = {
  endpoints: [],
  genericInputs: [],
  purificationPlants: [],
  reports: [],
  spots: [],
};
export class DB {
  public static getInstance() {
    if (!DB.instance) {
      DB.instance = new DB("Singleton");
    }
    return DB.instance;
  }
  private static instance: DB;
  private db!: lowdb.LowdbSync<Schema>;
  private init(): void {
    // console.log("init db"); // eslint-disable-line
    const dbFilePath = path.resolve(process.cwd(), "db.json");
    try {
      if (fs.existsSync(dbFilePath)) {
        logger.info("db.json exists");
      }
    } catch (err) {
      const fd = fs.openSync(dbFilePath, "w");
      logger.info(fd);
    }
    const adapter = new FileSync<Schema>("db.json");

    this.db = lowdb(
      process.env.NODE_ENV === "test" ? new Memory<Schema>("") : adapter,
    );
    if (this.db === undefined) throw new Error("DB not defined");
    this.db.setState(defaultState);
    this.db.defaults(defaultState).write();
    // this.db._.mixin({
    //   /**
    //    * batch insert
    //    * https://github.com/typicode/lowdb/issues/317#issuecomment-453256384
    //    * Batch example
    //    *
    //    * this.db.get('anArray').batch([{id: 1}, {id: 2}]);
    //    */
    //   batch: (array, items) => {
    //     return array.push(...items);
    //   },

    //   /**
    //    * unique batch insert
    //    * https://github.com/typicode/lowdb/issues/317#issuecomment-453256384
    //    * Batch Unique example
    //    *
    //    * this.db.get('anArray').batchUnique('id', [{id: 1}, {id: 2}]);
    //    */
    //   batchUnique: (array, key, items) => {
    //     const cleanItems = items.filter(
    //       (newEl: any) =>
    //         array.findIndex((el: any) => el[key] === newEl[key]) === -1,
    //     );
    //     return array.push(...cleanItems);
    //   },
    // });
  }
  private constructor(public readonly name: string) {
    this.init();
  }

  public getEndpoints(): IEndpoints[] {
    // const res = await this.db?.read();
    const res = this.db.get("endpoints").value();
    // console.log(res);
    return res;
  }
  public getGenerics(type: GenericType): IGeneric[] {
    return this.db.get(type).value();
  }
  /**
   * Adds data into the endpoints can be an Array or an object
   */
  public addEndpoints(data: IEndpoints | IEndpoints[]): void {
    if (Array.isArray(data)) {
      this.db
        .get("endpoints")
        .push(...data)
        .write();
    } else {
      this.db
        .get("endpoints")
        .push(data)
        .write();
    }
  }
  public addGenerics(type: GenericType, data: IGeneric | IGeneric[]): void {
    if (Array.isArray(data)) {
      this.db
        .get(type)
        .push(...data)
        .write();
    } else {
      this.db
        .get(type)
        .push(data)
        .write();
    }
  }
  public getReports(): IReport[] {
    return this.db.get("reports").value();
  }
  public getReportsSorted(): IReport[][] {
    return this.db
      .get("reports")
      .filter((elem) => elem.type !== "admin")
      .groupBy("email")
      .sortBy("email")
      .value();
  }
  public addReports(reports: IReport[] | IReport): void {
    if (Array.isArray(reports)) {
      this.db
        .get("reports")
        .push(...reports)
        .write();
    } else {
      this.db
        .get("reports")
        .push(reports)
        .write();
    }
  }
  public resetState(): void {
    this.db.setState({ ...defaultState });
  }
  public getSpots(): Spot[] {
    return this.db.get("spots").value();
  }
  public setSpots(spots: Spot[]): void {
    this.db
      .get("spots")
      .remove()
      .write();
    // console.log("setting spots");
    this.db
      .get("spots")
      .push(...spots)
      .write();
  }
  public updateSpot(id: number, value: boolean): void {
    this.db
      .get("spots")
      .find({ spotId: id })
      .assign({ hasModel: value })
      .write();
  }
  public getState(): Schema {
    const res = this.db.getState();
    return res;
  }
}
