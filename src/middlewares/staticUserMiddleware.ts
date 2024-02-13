import { Response, NextFunction } from "express";

import { IRequest } from "@src/interfaces/common";
import prisma from "@src/prisma/client";
import { NotFoundError } from "@src/utils/error/NotFoundError";
import { HTTP_CODES } from "@src/utils/error/errorTypes";

export const setStaticUser = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  const storeOwner = await prisma.user.findFirst({
    where: {
      username: "john_doe",
    },
  });
  if (storeOwner) {
    req.user = storeOwner;
    return next();
  }
  return res
    .status(HTTP_CODES.NOT_FOUND)
    .json(new NotFoundError("Default user not found").json());
};
