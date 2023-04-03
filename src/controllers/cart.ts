import { Request, Response } from "express";
import prisma from "../../prisma";
import { CustomRequest } from "../middleware/auth";
//req:CustomRequest
const add = async (req: Request, res: Response) => {
  const { productId } = req.params;
  //Why do we need to cast req to CustomRequest?
  /**
   * TODO: update Request type
   */
  const { token } = req as CustomRequest;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product)
    return res
      .status(404)
      .json({ message: "Wrong id! Product does not exist!" });

  const selectedProduct = await prisma.selectedProduct.upsert({
    where: {
      ids: {
        userId: token.userId,
        productId: productId,
      },
    },
    update: {
      amount: {
        increment: 1,
      },
    },
    create: {
      userId: token.userId,
      productId,
    },
  });

  return res.status(201).json({ message: "Success", payload: selectedProduct });
};

// same as before;
const readByUserId = async (req: Request, res: Response) => {
  const { token } = req as CustomRequest;

  const products = await prisma.selectedProduct.findMany({
    where: { userId: token.userId },
    select: {
      id: true,
      amount: true,
      product: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return res.status(200).json(products);
};

// you can assign user into request in auth middleware and have something like  AuthenticatedRequest
const removeProduct = async (req: Request, res: Response) => {
  const { token } = req as CustomRequest;
  const { productId } = req.params;

  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });

  if (!product)
    return res
      .status(404)
      .json({ message: "Product with such id does not exist!" });

  let selectedProduct = await prisma.selectedProduct.update({
    where: {
      ids: {
        userId: token.userId,
        productId,
      },
    },
    data: {
      amount: {
        decrement: 1,
      },
    },
  });

  if (selectedProduct.amount === 0) {
    selectedProduct = await prisma.selectedProduct.delete({
      where: {
        ids: {
          userId: token.userId,
          productId,
        },
      },
    });

    return res.status(201).json({
      message: "Product removed from cart!",
      payload: selectedProduct,
    });
  }

  return res
    .status(201)
    .json({ message: "Amount decreased!", payload: selectedProduct });
};

const clear = async (req: Request, res: Response) => {
  const { token } = req as CustomRequest;

  await prisma.selectedProduct.deleteMany({
    where: { userId: token.userId },
  });

  return res.status(201).json({ message: "Success" });
};

export const CartController = {
  add,
  readByUserId,
  removeProduct,
  clear,
};
