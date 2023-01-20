const apiVersion: string = process.env.API_VERSION || "v1";
import stockRouter from "./v1/stock.router.js";
import { Application } from "express";

export default (app: Application) => {
  stockRouter(app, apiVersion);
};
