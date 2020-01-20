// should be able to call the cronbot manually
import meow from "meow";

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
    },
  },
);

console.log(cli); // eslint-disable-line
