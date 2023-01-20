import { config } from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import logger from "./lib/config/logger.js";
import morganMiddleware from "./lib/config/morganMiddleware.js";
import router from "./lib/router/index.js";
// import cors from 'cors';


config();

process.on("uncaughtException", (err) => {
  logger.info("UncaughtException", err);
});

const app: Application = express();
app.use(morganMiddleware);
app.use((_req:Request, res: Response, next: NextFunction) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "*");
	next();
});
router(app);


app.get(["/", "/ping"], (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).send("Express server with TypeScript");
});

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
  });
}

export default app;
