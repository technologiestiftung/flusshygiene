import "jest";
jest.useFakeTimers();
jest.setTimeout(10000);
import { config } from "dotenv";
import path from "path";
import { getTokenOnce } from "../auth/token";
config({ path: path.resolve(__dirname, "../../.env") });
module.exports = async () => {
  await getTokenOnce(path.resolve(process.cwd(), ".token"));
};
