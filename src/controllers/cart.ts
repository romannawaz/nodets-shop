import { Request, Response } from "express";
import prisma from "../../prisma";
import { CustomRequest } from "../middleware/auth";
//req:CustomRequest
const add = async (req: Request, res: Response) => {
  const { productId } = req.params;
  //Why do we need to cast req to CustomRequest?
  const { token } = req as CustomRequest;

  // TODO
  //Why do we need token here?
  if (typeof token == "string") return;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product)
      return res
        .status(404)
        .json({ message: "Wrong id! Product does not exist!" });
  } catch (error) {
    return res.status(500).json(error);
  }

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: token.userId },
    });

    const products = cart ? [...cart.productsIds, productId] : [productId];

    const updatedCart = await prisma.cart.upsert({
      where: { userId: token.userId },
      update: {
        productsIds: products,
      },
      create: {
        userId: token.userId,
        productsIds: [productId],
      },
    });

    return res.status(201).json({ message: "Success", payload: updatedCart });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// same as before;
const readByUserId = async (req: Request, res: Response) => {
  const { token } = req as CustomRequest;

  // TODO
  if (typeof token == "string") return;

  try {
    // You can include both cart and products in one query https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#including-relations
    const cart = await prisma.cart.findUnique({
      where: { userId: token.userId },
    });

    if (!cart?.productsIds)
      return res.status(404).json({ message: "Cart is empty" });

    const products = await prisma.product.findMany({
      where: {
        id: { in: cart.productsIds },
      },
    });

    return res.status(200).json(products);
  } catch (error) {
    // You can use error handler middleware https://expressjs.com/en/guide/error-handling.html
    return res.status(500).json(error);
  }
};

// you can assign user into request in auth middleware and have something like  AuthenticatedRequest
const removeProduct = async (req: Request, res: Response) => {
  const { token } = req as CustomRequest;

  // TODO
  if (typeof token == "string") return;

  const { productId } = req.params;

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: token.userId },
    });

    if (!cart?.productsIds)
      return res.status(404).json({ message: "Cart is empty" });

    const products = cart.productsIds;
    //don't use delete, use filter
    delete products[cart.productsIds.indexOf(productId)];

    const updatedCart = await prisma.cart.update({
      where: {
        userId: cart?.userId,
      },
      data: {
        productsIds: products,
      },
    });

    return res.status(201).json({ message: "Success", payload: updatedCart });
  } catch (error) {
    return res.status(500).json(error);
  }
};

const clear = async (req: Request, res: Response) => {
  const { token } = req as CustomRequest;

  // TODO
  if (typeof token == "string") return;

  try {
    await prisma.cart.update({
      where: { userId: token.userId },
      data: {
        productsIds: [],
      },
    });

    return res.status(201).json({ message: "Success" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const CartController = {
  add,
  readByUserId,
  removeProduct,
  clear,
};
