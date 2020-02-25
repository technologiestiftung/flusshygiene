#!/usr/bin/env node
import { logger } from "./utils/logger";
import { globals } from "./common/globals";
// should be able to call the cronbot manually
import meow from "meow";
// import { main } from ".";
import fs from "fs";
import { main } from ".";

const cli = meow(
  `
Usage
  $ cronbot <input> [flags]
  -p --predict   boolean default false         Runs prediction on spots with models
  -v --verbose   boolean default false         Turns on verbose logging
  -a --adminonly boolean default false         Sends mails only to admin mail address
  -s --skipmail  boolean default false         Skip mail entirely
     --diskToken string  default undefined     Point the tool to an existing token on disk (for dev purpose)
`,
  {
    flags: {
      predict: {
        type: "boolean",
        alias: "p",
        default: false,
      },
      verbose: {
        type: "boolean",
        alias: "V",
        default: false,
      },
      adminonly: {
        type: "boolean",
        alias: "a",
        default: false,
      },
      skipmail: {
        type: "boolean",
        alias: "s",
        default: false,
      },
      diskToken: {
        type: "string",
      },
    },
  },
);

globals.setAdminOnly(cli.flags.adminonly);
globals.setVerbose(cli.flags.verbose);
globals.setSkipMail(cli.flags.skipmail);
globals.setPredict(cli.flags.predict);
// console.log(cli.flags);
// process.exit();

if (cli.flags.diskToken !== undefined) {
  try {
    if (fs.existsSync(cli.flags.diskToken) === false) {
      throw new Error("Token path is wrong");
    }
    const token = fs.readFileSync(cli.flags.diskToken, "utf8");
    if (token.startsWith("Bearer") === false) {
      throw new Error("Token on disk is wrong");
    }
    // process.env.CRONBOT_API_TOKEN = token;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
if (globals.VERBOSE === true) logger.info(JSON.stringify(cli.flags));
main().catch((err) => {
  console.error(err);
  throw err;
});
