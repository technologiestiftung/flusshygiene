import express from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";
import http from "http";
import helmet from "helmet";
import { router } from "./router";

const app = express();
const whitelist = [
  "https://www.flusshygiene.xyz",
  "https://www.flussbaden.org",
  "https://flussbaden.org",
];
if (process.env.NODE_ENV === "development") {
  const locals = [
    "http://localhost:3000",
    "http://localhost:8888",
    "http://localhost:5004",
  ];
  whitelist.push(...locals);
}
const corsOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(origin, "Not allowed by CORS");
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
if (process.env.NODE_ENV === "development") {
  app.options("*", cors());
  app.use(morgan("combined"));
} else {
  app.use(helmet());
  app.use(morgan("combined"));
}

app.use("/helpdesk/v1", router);

const server = http.createServer(app);

export { server };
