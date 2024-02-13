import { formatError } from "@src/utils/responseFormatter";
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateUpsertAuthor = [
  body("name")
    .notEmpty()
    .withMessage("name is required")
    .isString()
    .withMessage("name should be string"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(formatError("Invalid request", errors.array()));
    }

    return next();
  },
];
