import { Application, Request, Response, NextFunction } from "express";
import * as stockController from "../../controllers/stock.controller.js";

export default (app: Application, version: string) => {
  app.get(
    `/api/${version}/stocks`,
    (req: Request, res: Response, next: NextFunction) =>
      stockController.getStocksUsingSKUs(req, res, next)
  );
};
