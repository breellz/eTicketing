import "dotenv/config";
import express from "express";
import datasource from "./database/postgres";
import { limiter } from "./middleware/rateLimiter";
import { apiRouter } from "./routes/api.route";
import { errorHandler } from './utils/helpers/errorHandler';
import { populateDB } from "./utils/helpers/setup-database";

export const main = async (): Promise<express.Application> => {
  try {
    const app: express.Application = express();
    await datasource.initialize();
    await populateDB()

    app.use(express.json());
    app.use(limiter);

    app.use("/", apiRouter);
    app.use(errorHandler)

    return app;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to database");
  }
}
