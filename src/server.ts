import express, { NextFunction, Request, Response } from "express";
import http from "http";
import prisma from "../prisma";
import helmet from "helmet";
import cors from "cors";

import { config } from "./config/config";

import Logging from "./library/logging";

import { AppRoutes } from "./routes";

import { errorHandler } from "./middleware/errorHandler";

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

  /** Cors */
  router.use(cors());

  /** Helmet */
  router.use(helmet());

  /** Routes */
  router.use("/api", AppRoutes);

  /**
   * Error Handler
   */
  router.use(errorHandler);

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
