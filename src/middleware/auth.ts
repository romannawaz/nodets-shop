import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface CustomRequest extends Request {
  token: string | JwtPayload;
}

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
    const decoded = verify(token, config.token.access);
    (req as CustomRequest).token = decoded;

    return next();
  } catch (error) {
    console.log(4, error);

    return res.status(401).json(error);
  }
};
