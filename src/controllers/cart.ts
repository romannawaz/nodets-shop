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
    // You can avoid all of this by using upsert https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#upsert
    const cart = await prisma.cart.findUnique({
      where: { userId: token.userId },
    });

    if (!cart) {
      await prisma.cart.create({
        data: {
          userId: token.userId,
          products: [productId],
        },
      });
    } else {
      const products = [...cart.products, productId];

      await prisma.cart.update({
        where: { id: cart.id },
        data: { products },
      });
    }

    return res.status(201).json({ message: "Success" });
  } catch (error) {
    return res.status(500).json(error);
  }
};
//same as before
const readByUserId = async (req: Request, res: Response) => {
  const { token } = req as CustomRequest;

  // TODO
  if (typeof token == "string") return;

  try {
    // You can include both cart and products in one query https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#including-relations
    const cart = await prisma.cart.findUnique({
      where: { userId: token.userId },
    });

    if (!cart?.products)
      return res.status(404).json({ message: "Cart is empty" });

    const products = await prisma.product.findMany({
      where: {
        id: { in: cart.products },
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

    if (!cart?.products)
      return res.status(404).json({ message: "Cart is empty" });

    const products = cart.products;
    //don't use delete, use filter
    delete products[cart.products.indexOf(productId)];

    await prisma.cart.update({
      where: {
        userId: cart?.userId,
      },
      data: {
        products,
      },
    });

    return res.status(201).json({ message: "Success" });
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
        products: [],
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
