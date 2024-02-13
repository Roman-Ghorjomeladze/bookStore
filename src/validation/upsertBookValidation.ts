import { formatError } from "@src/utils/responseFormatter";
import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateUpsertBook = [
  body("authorId")
    .optional()
    .isNumeric()
    .withMessage("authorId should be number"),
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .withMessage("title should be string"),
  body("description")
    .notEmpty()
    .withMessage("description is required")
    .isString()
    .withMessage("description should be string"),
  body("isOutOfStock")
    .optional()
    .isBoolean()
    .withMessage("isOutOfStock should be boolean"),
  body("price")
    .notEmpty()
    .withMessage("price is required")
    .isNumeric()
    .withMessage("price should be number"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isNumeric()
    .withMessage("quantity should be integer"),
  body("author")
    .optional()
    .isObject()
    .custom((author: { name: string }, { req }) => {
      if (!author?.name) {
        throw new Error("author object must have name property");
      }
      return true;
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(formatError("Invalid request", errors.array()));
    }
    if (!req.body.authorId && !req.body.author) {
      return res
        .status(400)
        .json(
          formatError("Invalid request", [
            "At least one from author and authorId properties should be present in request!",
          ])
        );
    }
    return next();
  },
];
