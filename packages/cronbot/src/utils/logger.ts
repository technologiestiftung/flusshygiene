import { globals } from "../common/globals";

export const logger = {
  error: (...args: any[]) => {
    if (globals.VERBOSE === true) {
      console.error("ERROR", ...args);
    }
  },
  warn: (...args: any[]) => {
    if (globals.VERBOSE === true) {
      console.warn("WARNING", ...args); // eslint-disable-line
    }
  },
  info: (...args: any[]) => {
    if (globals.VERBOSE === true) {
      console.info("INFO", ...args); // eslint-disable-line
    }
  },
};
