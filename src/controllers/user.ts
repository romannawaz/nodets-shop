import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

import prisma from "../../prisma";
import { CustomRequest } from "../middleware/auth";
import { generateTokens } from "../utils/jwt";
import { addRefreshToken, deleteTokens } from "../utils/refreshToken";

const login = async (req: Request, res: Response) => {
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

  return res.json({
    accessToken,
    refreshToken,
    existingUser,
  });
};
// You decided to use session based authentication?
const logout = async (req: Request, res: Response) => {
  const { token } = req as CustomRequest;

  await deleteTokens(token.userId);

  return res.status(200).json({ message: "Success" });
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

  return res.status(201).json({
    accessToken,
    refreshToken,
    newUser,
  });
};

const readById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Where should be id in params" });

  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) return res.status(404).json({ message: "User does not exist" });

  return res.status(200).json(user);
};

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Where should be id in params" });

  const { password, ...userData } = req.body;

  const user = await prisma.user.update({
    where: { id },
    data: userData,
  });

  return res.status(200).json(user);
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id)
    return res.status(400).json({ message: "Where should be id in params" });

  const deletedUser = await prisma.user.delete({
    where: { id },
  });

  return res.status(200).json(deletedUser);
};

export const UserController = {
  login,
  logout,
  register,
  readById,
  updateById,
  deleteById,
};
