import { Request, Response, Router } from "express";

import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
  updateBookQuantity,
} from "@src/controllers/books.controller";
import { GeneralResponse } from "@src/interfaces/httpResponseTypes";
import { formatResponse } from "@src/utils/responseFormatter";
import { validateUpsertBook } from "@src/validation/upsertBookValidation";
import { handleError } from "@src/utils/error/handler";
import { setStaticUser } from "@src/middlewares/staticUserMiddleware";
import { IRequest } from "@src/interfaces/common";
import { validateBookQuantityUpdate } from "@src/validation/bookQuantityUpdateValidation";
import { UserNotFoundError } from "@src/utils/error/UserNotFoundError";

const booksRouter = Router();

booksRouter.get(
  "/",
  async (_: Request, res: Response): Promise<GeneralResponse> => {
    try {
      const result = await getAllBooks();
      return res.json(formatResponse(result));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

booksRouter.get(
  "/:id",
  async (req: Request, res: Response): Promise<GeneralResponse> => {
    try {
      const result = await getBookById(Number(req.params.id));
      return res.json(formatResponse(result));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

booksRouter.post(
  "/",
  validateUpsertBook,
  setStaticUser,
  async (req: IRequest, res: Response): Promise<GeneralResponse> => {
    try {
      if (!req.user)
        return res.status(404).json(new UserNotFoundError().json());
      const result = await createBook(req.body, req.user);
      return res.status(201).json(formatResponse(result));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

booksRouter.put(
  "/:id",
  validateUpsertBook,
  setStaticUser,
  async (req: IRequest, res: Response): Promise<GeneralResponse> => {
    try {
      if (!req.user)
        return res.status(404).json(new UserNotFoundError().json());
      const result = await updateBook(
        Number(req.params.id),
        req.body,
        req.user?.id
      );
      return res.json(formatResponse(result));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

booksRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<GeneralResponse> => {
    try {
      const result = await deleteBook(Number(req.params.id));
      return res.json(formatResponse(result));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

booksRouter.put(
  "/:id/quantity",
  validateBookQuantityUpdate,
  setStaticUser,
  async (req: IRequest, res: Response): Promise<GeneralResponse> => {
    try {
      if (!req.user)
        return res.status(404).json(new UserNotFoundError().json());
      const result = await updateBookQuantity(Number(req.params.id), req.body);
      return res.json(formatResponse(result));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

export { booksRouter };
