
import { Request, Response, Router } from "express";

import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
} from "@src/controllers/author.controller";
import { IRequest } from "@src/interfaces/common";
import { GeneralResponse } from "@src/interfaces/httpResponseTypes";
import { setStaticUser } from "@src/middlewares/staticUserMiddleware";
import { UserNotFoundError } from "@src/utils/error/UserNotFoundError";
import { handleError } from "@src/utils/error/handler";
import { formatResponse } from "@src/utils/responseFormatter";
import { validateUpsertAuthor } from "@src/validation/upsertAuthorValidation";

const authorRouter = Router();

authorRouter.get(
  "/",
  async (req: Request, res: Response): Promise<GeneralResponse> => {
    try {
      const authors = await getAllAuthors();
      return res.json(formatResponse(authors));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

authorRouter.get(
  "/:id",
  async (req: Request, res: Response): Promise<GeneralResponse> => {
    try {
      const authors = await getAuthorById(Number(req.params.id));
      return res.json(formatResponse(authors));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

authorRouter.post(
  "/",
  validateUpsertAuthor,
  setStaticUser,
  async (req: IRequest, res: Response): Promise<GeneralResponse> => {
    try {
      if (!req.user)
        return res.status(404).json(new UserNotFoundError().json());
      const author = await createAuthor(req.body.name, req.user.id);
      return res.status(201).json(formatResponse(author));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

authorRouter.put(
  "/:id",
  validateUpsertAuthor,
  setStaticUser,
  async (req: IRequest, res: Response): Promise<GeneralResponse> => {
    try {
      if (!req.user)
        return res.status(404).json(new UserNotFoundError().json());
      const author = await updateAuthor(
        Number(req.params.id),
        req.body,
        req.user?.id
      );
      return res.json(formatResponse(author));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

authorRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<GeneralResponse> => {
    try {
      const result = await deleteAuthor(Number(req.params.id));
      return res.json(formatResponse(result));
    } catch (error) {
      return handleError(res, error);
    }
  }
);

export { authorRouter };
