import { Request, Response } from "express";
import prisma from "../../prisma";

const create = async (req: Request, res: Response) => {
  const { title } = req.body;

  const newProduct = await prisma.product.create({ data: { title } });

  return res.status(201).json(newProduct);
};

const readById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    // User :) ?
    return res.status(404).json({ message: "User does not exist" });
  }

  return res.status(200).json(product);
};

const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: req.body,
  });
  return res.status(200).json(updatedProduct);
};

const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const deletedProduct = await prisma.product.delete({ where: { id } });

  return res.status(200).json(deletedProduct);
};

export const ProductController = {
  create,
  readById,
  updateById,
  deleteById,
};
