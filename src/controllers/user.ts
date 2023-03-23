import { hash } from 'bcryptjs';
import { Request, Response } from 'express';

import prisma from '../../prisma';

const create = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;

    if (!(email && name && password))
        return res.status(400).json({ message: 'All input is required' });

    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (isUserExist)
        return res
            .status(409)
            .json({ message: 'User Already Exist. Please Login' });

    try {
        const encryptedPassword = await hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: encryptedPassword,
            },
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json(error);
    }
};

const readById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id)
        return res
            .status(400)
            .json({ message: 'Where should be id in params' });

    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user)
            return res.status(404).json({ message: 'User does not exist' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id)
        return res
            .status(400)
            .json({ message: 'Where should be id in params' });

    const { password, ...userData } = req.body;

    try {
        const user = await prisma.user.update({
            where: { id },
            data: userData,
        });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id)
        return res
            .status(400)
            .json({ message: 'Where should be id in params' });

    try {
        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json(error);
    }
};

export const UserController = {
    create,
    readById,
    updateById,
    deleteById,
};
