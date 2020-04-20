/* eslint-disable no-console */
/**
 * ██▄   ▄███▄      ▄   ████▄
 * █  █  █▀   ▀      █  █   █
 * █   █ ██▄▄    ██   █ █   █
 * █  █  █▄   ▄▀ █ █  █ ▀████
 * ███▀  ▀███▀   █  █ █
 *               █   ██
 * This script uses deno as runtime not node
 * curl -fsSL https://deno.land/x/install/install.sh | sh
 * deno ./filename
 */

import { readJson } from "https://deno.land/std/fs/read_json.ts";
interface IObject {
  [key: string]: any;
}
const json: IObject = (await readJson("./db.json")) as IObject;

console.log(json.spots);
