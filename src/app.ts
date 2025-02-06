import "dotenv/config";
import express, { Request } from "express";
import morgan from "morgan";
import datasource from "./database/postgres";
import { limiter } from "./middleware/rateLimiter";
import { apiRouter } from "./routes/api.route";
import { errorHandler } from './utils/helpers/errorHandler';
import { populateDB } from "./utils/helpers/setup-database";
import fs from 'fs';
import path from 'path';

export const main = async (): Promise<express.Application> => {
  try {
    const app: express.Application = express();
    await datasource.initialize();
    await populateDB()
    morgan.token("type", function (req: Request) {
      return req.headers["content-type"];
    });

    // Create a write stream (in append mode)
    const accessLogStream = fs.createWriteStream(path.join(__dirname, '../access.log'), { flags: 'a' });
    app.use(express.json());
    app.use(limiter); // rate limit requests to 30 requests per minute per Ip

    if (process.env.NODE_ENV !== 'development') {
      app.use(
        morgan(
          ":method :url :status :res[content-length] :response-time ms :date[web] :type"
        )
      );
    } else {
      app.use(morgan(":method :url :status :res[content-length] :response-time ms :date[web] :type", { stream: accessLogStream }));
    }

    app.use("/", apiRouter);
    app.use(errorHandler)

    return app;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to database");
  }
}
