import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

import { UPDATE_QUANTITY_OPERATION } from "@src/interfaces/book/request";
import { formatError } from "@src/utils/responseFormatter";


export const validateBookQuantityUpdate = [
  body("operation").notEmpty().isIn(Object.values(UPDATE_QUANTITY_OPERATION)),
  body("quantity")
    .notEmpty()
    .withMessage(`quantity can't be empty`)
    .isInt()
    .withMessage("quantity should be number"),
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
