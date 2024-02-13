import { NotFoundError } from "./NotFoundError";

export class BookNotFoundError extends NotFoundError {
  constructor(bookId: number) {
    super(`Book with id ${bookId} not found!`);
  }
}
