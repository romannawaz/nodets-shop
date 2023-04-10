import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "../config/config";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  if (!authorization)
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });

  try {
    const token = authorization.split(" ")[1];
    const decoded = verify(token, config.token_key.refresh);

    req.token = decoded as JwtPayload;

    return next();
  } catch (error) {
    return res.status(401).json(error);
  }
};
