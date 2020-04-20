import { resolve } from "path";
import fs from "fs";
const packagejson = fs.readFileSync(
  resolve(__dirname, "../../package.json"),
  "utf8",
);
const pkg = JSON.parse(packagejson);
export const version = pkg.version;
