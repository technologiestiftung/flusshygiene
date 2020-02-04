import { IGlobals } from "./interfaces";

export const globals: IGlobals = {
  PREDICT: undefined,
  setPredict: function(value) {
    this.PREDICT = value;
  },
  ADMIN_ONLY: undefined,
  setAdminOnly: function(value) {
    this.ADMIN_ONLY = value;
  },
  VERBOSE: undefined,
  setVerbose: function(value) {
    this.VERBOSE = value;
  },
  SKIP_MAIL: undefined,
  setSkipMail: function(value) {
    this.SKIP_MAIL = value;
  },
};
