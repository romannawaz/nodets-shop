import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(500).json(error);
};
