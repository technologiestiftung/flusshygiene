// https://github.com/typicode/lowdb/tree/master/examples#in-memory
// https://github.com/typicode/lowdb/issues/349
// const lowdb = require("lowdb"); // eslint-disable-line
// const FileSync = require("lowdb/adapters/FileSync"); // eslint-disable-line
import lowdb from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { IEndpoints, IGeneric, IError } from "./common/interfaces";
export type GenericType = "genericInputs" | "purificationPlants";
type Schema = {
  endpoints: IEndpoints[];
  genericInputs: IGeneric[];
  purificationPlants: IGeneric[];
  errors: IError[];
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
    console.log("init db"); // eslint-disable-line
    const adapter = new FileSync<Schema>("db.json");
    this.db = lowdb(adapter);
    this.db.setState({
      endpoints: [],
      genericInputs: [],
      purificationPlants: [],
      errors: [],
    });
    this.db
      .defaults({ endpoints: [], genericInputs: [], pplants: [], errors: [] })
      .write();
    if (this.db === undefined) throw new Error("DB not defiend");
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
  public addGenenrics(type: GenericType, data: IGeneric | IGeneric[]): void {
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

  public getState(): Schema {
    const res = this.db?.getState();
    return res;
  }
}
