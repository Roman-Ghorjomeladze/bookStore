import prisma from "@src/prisma/client";

import { MockBook } from "../mocks/book/book";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
  updateBookQuantity,
} from "@src/controllers/books.controller";
import { BookNotFoundError } from "@src/utils/error/BookNotFoundError";
import { MockAuthor } from "../mocks/author/author";
import {
  MissingAuthorAndAuthorId,
  ValidCreateBookRequestBody,
} from "../mocks/book/createBookRequestBody";
import { MockUser } from "../mocks/user";
import {
  UPDATE_QUANTITY_OPERATION,
  UpsertBookRequest,
} from "@src/interfaces/book/request";
import { BadRequestError } from "@src/utils/error/BadRequestError";

describe("getAllBooks", () => {
  it(`Should return books`, async () => {
    const spy = jest
      .spyOn(prisma.book, "findMany")
      .mockResolvedValue([MockBook]);
    const books = await getAllBooks();
    expect(books).toEqual([MockBook]);
    spy.mockRestore();
  });
});

describe("getBookById", () => {
  it(`Should return book if book with id exists`, async () => {
    const spy = jest
      .spyOn(prisma.book, "findFirst")
      .mockResolvedValue(MockBook);
    const author = await getBookById(1);
    expect(author).toEqual(MockBook);
    spy.mockRestore();
  });
  it(`Should throw error if book with id doesn't exist`, async () => {
    const spy = jest.spyOn(prisma.book, "findFirst").mockResolvedValue(null);

    expect(getBookById(1)).rejects.toThrow(BookNotFoundError);
    spy.mockRestore();
  });
});

describe("createBook", () => {
  it(`Should create book and return`, async () => {
    const spy = jest.spyOn(prisma.book, "create").mockResolvedValue(MockBook);
    const authorSpy = jest
      .spyOn(prisma.author, "findFirst")
      .mockResolvedValue(MockAuthor);
    const book = await createBook(ValidCreateBookRequestBody.body, MockUser);
    expect(book).toEqual(MockBook);
    spy.mockRestore();
    authorSpy.mockRestore();
  });

  it(`Should throw error fi findAuthorOrCreate doesn't return author`, async () => {
    const spy = jest.spyOn(prisma.book, "create").mockResolvedValue(MockBook);
    const findAuthorSpy = jest
      .spyOn(prisma.author, "findFirst")
      .mockResolvedValue(null);

    expect(
      createBook(MissingAuthorAndAuthorId.body as UpsertBookRequest, MockUser)
    ).rejects.toThrow(BadRequestError);
    spy.mockRestore();
    findAuthorSpy.mockRestore();
  });
});

describe("updateBook", () => {
  it(`Should update book and return`, async () => {
    const spy = jest.spyOn(prisma.book, "update").mockResolvedValue(MockBook);
    const findBookSpy = jest
      .spyOn(prisma.book, "findFirst")
      .mockResolvedValue(MockBook);
    const authorSpy = jest
      .spyOn(prisma.author, "findFirst")
      .mockResolvedValue(MockAuthor);
    const book = await updateBook(1, ValidCreateBookRequestBody.body, 1);
    expect(book).toEqual(MockBook);
    spy.mockRestore();
    authorSpy.mockRestore();
    findBookSpy.mockRestore();
  });

  it(`Should throw error fi book with id doesn't exists`, async () => {
    const spy = jest.spyOn(prisma.book, "findFirst").mockResolvedValue(null);

    expect(
      updateBook(1, MissingAuthorAndAuthorId.body as UpsertBookRequest, 1)
    ).rejects.toThrow(BookNotFoundError);
    spy.mockRestore();
  });
});
describe("deleteAuthor", () => {
  it(`Should delete book if book with id exists`, async () => {
    const findSpy = jest
      .spyOn(prisma.book, "findFirst")
      .mockResolvedValue(MockBook);
    const deleteSpy = jest
      .spyOn(prisma.book, "delete")
      .mockResolvedValue(MockBook);
    const book = await deleteBook(1);
    expect(book).toEqual(MockBook);
    findSpy.mockRestore();
    deleteSpy.mockRestore();
  });
  it(`Should throw error if book with id doesn't exist`, async () => {
    const spy = jest.spyOn(prisma.book, "findFirst").mockResolvedValue(null);

    expect(deleteBook(1)).rejects.toThrow(BookNotFoundError);
    spy.mockRestore();
  });
});

describe("updateBookQuantity", () => {
  it(`Should throw an error if book with id doesn't exist`, async () => {
    const bookSpy = jest
      .spyOn(prisma.book, "findFirst")
      .mockResolvedValue(null);
    const updateSpy = jest
      .spyOn(prisma.book, "update")
      .mockImplementation(jest.fn());
    expect(
      updateBookQuantity(1, {
        quantity: 1,
        operation: UPDATE_QUANTITY_OPERATION.INCREMENT,
      })
    ).rejects.toThrow(BookNotFoundError);
    bookSpy.mockRestore();
    updateSpy.mockRestore();
  });

  it(`Should throw bad reqeust error if operation is decrement and requested quantity is more than book's quantity`, async () => {
    const bookSpy = jest
      .spyOn(prisma.book, "findFirst")
      .mockResolvedValue(MockBook);
    const updateSpy = jest
      .spyOn(prisma.book, "update")
      .mockResolvedValue(MockBook);
    const updated = await updateBookQuantity(1, {
      quantity: 10,
      operation: UPDATE_QUANTITY_OPERATION.INCREMENT,
    });
    expect(updated).toEqual(MockBook);
    bookSpy.mockRestore();
    updateSpy.mockRestore();
  });
});
