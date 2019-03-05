"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const port = typeof process.env.PG_PORT === 'string' ? parseInt(process.env.PG_PORT, 10) : process.env.PG_PORT;
exports.pgOptions = {
    database: process.env.PG_DATABASE,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    port: port,
    user: process.env.PG_USER,
};
class PG {
    constructor() { }
    static getInstance() {
        if (!this.pgClient) {
            this.pgClient = new pg_1.Pool(exports.pgOptions);
        }
        this.pgClient.on('error', this.createErrorHandler('pgClient'));
        return this.pgClient;
    }
}
PG.createErrorHandler = (name) => {
    return (error) => {
        process.stderr.write(`${name} has ${error}`);
    };
};
exports.default = PG;
