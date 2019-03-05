import { Pool, PoolConfig } from 'pg';

const port =  typeof process.env.PG_PORT === 'string' ? parseInt(process.env.PG_PORT, 10) : process.env.PG_PORT;

type errorHandlerCreator = (name: string) => (error: Error) => void;
export const pgOptions: PoolConfig = {
  database: process.env.PG_DATABASE,
  host: process.env.PG_HOST,
  password: process.env.PG_PASSWORD,
  port: port,
  user: process.env.PG_USER,
}
export default class PG {
  public static pgClient: Pool;
  public static getInstance(): Pool {
    if(!this.pgClient){
      this.pgClient = new Pool(pgOptions);
    }
    this.pgClient.on('error', this.createErrorHandler('pgClient'));

    return this.pgClient;
  }
  private static createErrorHandler: errorHandlerCreator = (name) => {
    return (error) => {
      process.stderr.write(`${name} has ${error}`);
    }
  }
  private constructor(){}
}