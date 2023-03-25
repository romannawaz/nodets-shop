import { Request, Response } from 'express';
import prisma from '../../prisma';
import { CustomRequest } from '../middleware/auth';

const add = async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { token } = req as CustomRequest;

    // TODO
    if (typeof token == 'string') return;

    try {
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

        return res.status(201).json({ message: 'Success' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const readByUserId = async (req: Request, res: Response) => {
    const { token } = req as CustomRequest;

    // TODO
    if (typeof token == 'string') return;

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: token.userId },
        });

        if (!cart?.products)
            return res.status(404).json({ message: 'Cart is empty' });

        const products = await prisma.product.findMany({
            where: {
                id: { in: cart.products },
            },
        });

        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const removeProduct = async (req: Request, res: Response) => {
    const { token } = req as CustomRequest;

    // TODO
    if (typeof token == 'string') return;

    const { productId } = req.params;

    try {
        const cart = await prisma.cart.findUnique({
            where: { userId: token.userId },
        });

        if (!cart?.products)
            return res.status(404).json({ message: 'Cart is empty' });

        const products = cart.products;
        delete products[cart.products.indexOf(productId)];

        await prisma.cart.update({
            where: {
                userId: cart?.userId,
            },
            data: {
                products,
            },
        });

        return res.status(201).json({ message: 'Success' });
    } catch (error) {
        return res.status(500).json(error);
    }
};

const clear = async (req: Request, res: Response) => {
    const { token } = req as CustomRequest;

    // TODO
    if (typeof token == 'string') return;

    try {
        await prisma.cart.update({
            where: { userId: token.userId },
            data: {
                products: [],
            },
        });

        return res.status(201).json({ message: 'Success' });
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
