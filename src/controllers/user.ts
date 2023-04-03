import { compare, hash } from "bcryptjs";
import { Request, Response } from "express";

import prisma from "../../prisma";
import { CustomRequest } from "../middleware/auth";
import { generateTokens } from "../utils/jwt";
import { deleteTokens } from "../utils/refreshToken";

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (!existingUser) {
    return res.status(403).json({ message: "Invalid login credentials." });
  }

  const validPassword = await compare(password, existingUser.password);
  if (!validPassword) {
    return res.status(403).json({ message: "Invalid login credentials." });
  }

  const { accessToken, refreshToken } = await generateTokens(existingUser);

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

  const { accessToken, refreshToken } = await generateTokens(newUser);

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
