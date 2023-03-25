import { User } from '@prisma/client';

import { sign } from 'jsonwebtoken';
import { config } from '../config/config';

export const generateAccessToken = (user: User): string => {
    return sign({ userId: user.id }, config.token.access, {
        expiresIn: '5m',
    });
};

export const generateRefreshToken = (user: User, jti: string): string => {
    return sign(
        {
            userId: user.id,
            jti,
        },
        config.token.refresh,
        {
            expiresIn: '8h',
        },
    );
};

export const generateTokens = (user: User, jti: string) => {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user, jti);

    return {
        accessToken,
        refreshToken,
    };
};
