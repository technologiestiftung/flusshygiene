import { server } from "./lib/app";
const PORT = process.env.HELPDESK_EXPRESS_PORT || 6004;

//  BretFisher / node-docker-good-defaults
// see https://github.com/BretFisher/node-docker-good-defaults/blob/master/bin/www
// need this in docker container to properly exit since node doesn't handle SIGINT/SIGTERM
// this also won't work on using npm start since:
// https://github.com/npm/npm/issues/4603
// https://github.com/npm/npm/pull/10868
// https://github.com/RisingStack/kubernetes-graceful-shutdown-example/blob/master/src/index.js
// if you want to use npm then start with `docker run --init` to help, but I still don't think it's
// a graceful shutdown of node process
//

// TODO: Not strongly types
const sockets: { [key: string]: any } = {};
let nextSocketId = 0;
function waitForSocketsToClose(counter: number): any {
  if (counter > 0) {
    console.log(
      `Waiting ${counter} more ${
        counter === 1 ? "seconds" : "second"
      } for all connections to close...`
    );
    return setTimeout(waitForSocketsToClose, 1000, counter - 1);
  }

  console.log("Forcing all connections to close now");
  for (const socketId in sockets) {
    sockets[socketId].destroy();
  }
}
server.on("connection", function (socket) {
  const socketId = nextSocketId++;
  sockets[socketId] = socket;

  socket.once("close", function () {
    delete sockets[socketId];
  });
});

// shut down server
function shutdown(): void {
  waitForSocketsToClose(10);

  server.close(function onServerClosed(err) {
    if (err) {
      console.error(err);
      process.exitCode = 1;
    }
    process.exit();
  });
}

// quit on ctrl-c when running docker in terminal
process.on("SIGINT", function onSigint() {
  console.info(
    "Got SIGINT (aka ctrl-c in docker). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

// quit properly on docker stop
process.on("SIGTERM", function onSigterm() {
  console.info(
    "Got SIGTERM (docker container stop). Graceful shutdown ",
    new Date().toISOString()
  );
  shutdown();
});

server.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    process.stdout.write(`listening on http://localhost:${PORT}\n`);
  }
});
