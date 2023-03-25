import { Request, Response } from 'express';
import prisma from '../../prisma';

const create = async (req: Request, res: Response) => {
    const { title } = req.body;

    try {
        const newProduct = await prisma.product.create({ data: { title } });

        return res.status(201).json(newProduct);
    } catch (error) {
        return res.status(400).json(error);
    }
};

const readById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product)
            return res.status(404).json({ message: 'User does not exist' });

        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const updateById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const updatedProduct = await prisma.product.update({
            where: { id },
            data: req.body,
        });
        return res.status(200).json(updatedProduct);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteById = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deletedProduct = await prisma.product.delete({ where: { id } });

        return res.status(200).json(deletedProduct);
    } catch (error) {
        return res.status(500).json(error);
    }
};

export const ProductController = {
    create,
    readById,
    updateById,
    deleteById,
};
