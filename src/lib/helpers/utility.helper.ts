import { Response } from "express";

export const builtError = (
  res: Response,
  statusCode: number,
  error: string
) => {
  return res.status(statusCode).send(error);
};
