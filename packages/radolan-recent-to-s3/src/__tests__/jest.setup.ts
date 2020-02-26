import "jest";
import { config } from "dotenv";
import path from "path";
config({ path: path.resolve(__dirname, "../../.env") });
module.exports = async () => {
  // eslint-disable-next-line no-console
  console.info("jest setup");
};
