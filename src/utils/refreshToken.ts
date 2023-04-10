import { Prisma, RefreshToken } from "@prisma/client";

import prisma from "../../prisma";

import { hashToken } from "./hashToken";
export const addRefreshToken = (
  jti: string,
  refreshToken: string,
  userId: string
): Promise<RefreshToken> => {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};

export const deleteTokens = (userId: string): Promise<Prisma.BatchPayload> => {
  return prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
};
