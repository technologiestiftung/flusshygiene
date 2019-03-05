"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const flusshygiene_utils_1 = require("@tsb/flusshygiene-utils");
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const PORT = process.env.POSTGRES_EXPRESS_PORT || 5004;
const server = http_1.default.createServer(app_1.default);
const log = flusshygiene_utils_1.devlogGen(PORT);
server.listen(PORT, log);
