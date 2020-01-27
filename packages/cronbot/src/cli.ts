// should be able to call the cronbot manually
import meow from "meow";
// import { main } from ".";
import fs from "fs";
import { main } from ".";

const cli = meow(
  `
Usage
  $ cronbot <input> [flags]

`,
  {
    flags: {
      verbose: {
        type: "boolean",
        alias: "V",
      },
      diskToken: {
        type: "string",
      },
    },
  },
);

if (cli.flags.diskToken !== undefined) {
  try {
    if (fs.existsSync(cli.flags.diskToken) === false) {
      throw new Error("Token path is wrong");
    }
    const token = fs.readFileSync(cli.flags.diskToken, "utf8");
    // console.log(token); // eslint-disable-line
    if (token.startsWith("Bearer") === false) {
      throw new Error("Token on disk is wrong");
    }
    process.env.CRONBOT_API_TOKEN = token;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
console.log(cli.flags); // eslint-disable-line
main().catch((err) => {
  console.error(err);
  throw err;
});
