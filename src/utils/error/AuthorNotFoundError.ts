import { NotFoundError } from "./NotFoundError";

export class AuthorNotFoundError extends NotFoundError {
  constructor(authorId: number) {
    super(`Author with id ${authorId} not found!`);
  }
}
