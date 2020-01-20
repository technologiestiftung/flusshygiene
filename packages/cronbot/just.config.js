/* eslint-disable @typescript-eslint/no-var-requires */

// //
// // https://microsoft.github.io/just/docs/scripts-ts
// // https://microsoft.github.io/just/docs/scripts-jest
const {
  task,
  // option,
  logger,
  // argv,
  series,
  tscTask,
  jestTask,
  cleanTask,
  parallel,
} = require("just-scripts");
const nodemon = require("nodemon");
const nodemonConfig = require("./nodemon.json");
nodemon(nodemonConfig);

//  TS Tasks
task("ts", tscTask());
task("ts:watch", tscTask({ watch: true }));

// TEST Tasks
task("test", jestTask({ config: "jest.config.js", coverage: true }));

task(
  "jest:watch",
  jestTask({ watch: true, config: "jest.config.js", coverage: true }),
);

// Build Tasks
task("clean", cleanTask({ paths: ["coverage", "dist"] }));
task("build", series("clean", "ts"));

//  Dev tasks
task("nodemon", function() {
  logger.info("Start task");
  nodemon
    .on("start", function() {
      logger.info("App has started");
    })
    .on("quit", function() {
      logger.info("App has quit");
      process.exit();
    })
    .on("restart", function(files) {
      logger.info("App restarted due to: ", files);
    });
});
task("dev", series("clean", "ts", parallel("ts:watch", "nodemon")));
