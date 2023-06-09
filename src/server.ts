import express, { NextFunction, Request, Response } from "express";
import http from "http";
import prisma from "../prisma";

import { config } from "./config/config";

import Logging from "./library/logging";

import { AppRoutes } from "./routes";

const router = express();

prisma.$connect().then(() => {
  StartServer();
});

/**
 * Start server if any DB connects
 */
const StartServer = () => {
  router.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the Request */
    Logging.info(
      `Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    /** Log the Response */
    res.on("finish", () => {
      Logging.info(
        `Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  /** Routes of API */
  router.use((req: Request, res: Response, next: NextFunction) => {
    // there are libraries for this like https://www.npmjs.com/package/cors
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Origin",
      "Origin, X-Request-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
      );

      return res.status(200).json({});
    }

    next();
  });
  // also please add helmet for security https://www.npmjs.com/package/helmet

  /** Routes */
  router.use("/api", AppRoutes);

  /** Healthcheck */
  router.get("/ping", (req: Request, res: Response) =>
    res.status(200).json({ message: "Pong!" })
  );

  /** Error handling */
  router.use((req: Request, res: Response) => {
    const error = new Error("Not found");
    Logging.error(error);

    return res.status(404).json({ message: error.message });
  });

  http
    .createServer(router)
    .listen(config.server.port, () =>
      Logging.info(`Server is running on port ${config.server.port}.`)
    );
};
