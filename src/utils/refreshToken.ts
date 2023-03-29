import prisma from "../../prisma";
import { hashToken } from "./hashToken";
// Please add return type
export const addRefreshToken = (
  jti: string,
  refreshToken: string,
  userId: string
) => {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};

export const deleteTokens = (userId: string) => {
  return prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
};
