import "jest";
import { config } from "dotenv";
import path from "path";
import { getTokenOnce } from "../auth/token";
config({ path: path.resolve(__dirname, "../../.env") });
module.exports = async () => {
  const res = await getTokenOnce(path.resolve(process.cwd(), ".token"));
  console.log(res);
};
