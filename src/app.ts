import "dotenv/config";
import express from "express";
import datasource from "./database/postgres";
import { apiRouter } from "./routes/api.route";
import { errorHandler } from './utils/helpers/errorHandler';
import { populateDB } from "./utils/helpers/setup-database";
import { limiter } from "./middleware/rateLimiter";

export const main = async (): Promise<express.Application> => {
  try {
    const app: express.Application = express();
    await datasource.initialize();
    await populateDB()

    app.use(express.json());
    app.use(limiter); // rate limit requests to 30 requests per minute per Ip
    app.use("/", apiRouter);
    app.use(errorHandler)

    return app;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to database");
  }
}
