import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { v4 as uuidv4 } from "uuid";

import prisma from "../../prisma";
import { config } from "../config/config";
import { CustomRequest } from "../middleware/auth";
import { generateTokens } from "../utils/jwt";
import { addRefreshToken, deleteTokens } from "../utils/refreshToken";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // You can validate in middleware for more info please refer https://www.linkedin.com/pulse/dto-json-payload-expressjs-validation-middleware-imran-younas/
    if (!email || !password) {
      return res.status(400).json({
        message: "You must provide an email and a password.",
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(403).json({ message: "Invalid login credentials." });
    }

    const validPassword = await compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(403).json({ message: "Invalid login credentials." });
    }

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(existingUser, jti);
    await addRefreshToken(jti, refreshToken, existingUser.id);
    // Also here we can provide user object in response
    return res.json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};
// You decided to use session based authentication?
const logout = async (req: Request, res: Response) => {
  const { token } = req as CustomRequest;

  try {
    if (typeof token == "string") return;

    await deleteTokens(token.userId);

    return res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(403).json(error);
  }
};

const register = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  if (!(email && name && password))
    return res.status(400).json({ message: "All input is required" });

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (isUserExist)
    return res
      .status(409)
      .json({ message: "User Already Exist. Please Login" });

  try {
    const encryptedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: encryptedPassword,
      },
    });
    // i think we can move this logic to service and reuse in both login and register
    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(newUser, jti);
    await addRefreshToken(jti, refreshToken, newUser.id);
    //same as with login
    return res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(400).json(error);
  }
};

const readById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Where should be id in params" });

  try {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Where should be id in params" });

  const { password, ...userData } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id },
      data: userData,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Where should be id in params" });

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json(deletedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const authorization = req.headers.authorization;
  let decoded;
  try {
    decoded = verify(authorization as string, config.token.refresh);
  } catch (error) {
    console.log(error);

    return res.status(401).json(error);
  }

  if (typeof decoded == "string") return;

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) return res.status(404).json({ message: "User does not exist" });

    const jti = uuidv4();
    const { accessToken, refreshToken } = generateTokens(user, jti);
    await addRefreshToken(jti, refreshToken, user.id);

    return res.status(200).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const UserController = {
  login,
  logout,
  register,
  readById,
  updateById,
  deleteById,
  refreshToken,
};
