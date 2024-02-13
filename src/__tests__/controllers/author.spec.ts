import prisma from "@src/prisma/client";
import { MockAuthor } from "../mocks/author/author";
import {
  createAuthor,
  deleteAuthor,
  findAuthorOrCreate,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
} from "@src/controllers/author.controller";
import { AuthorNotFoundError } from "@src/utils/error/AuthorNotFoundError";
import { UpsertBookRequest } from "@src/interfaces/book/request";

describe("getAllAuthors", () => {
  it(`Should return authors`, async () => {
    const spy = jest
      .spyOn(prisma.author, "findMany")
      .mockResolvedValue([MockAuthor]);
    const authors = await getAllAuthors();
    expect(authors).toEqual([MockAuthor]);
    spy.mockRestore();
  });
});

describe("getAuthorById", () => {
  it(`Should return author if author with id exists`, async () => {
    const spy = jest
      .spyOn(prisma.author, "findFirst")
      .mockResolvedValue(MockAuthor);
    const author = await getAuthorById(1);
    expect(author).toEqual(MockAuthor);
    spy.mockRestore();
  });
  it(`Should throw error if author with id doesn't exist`, async () => {
    const spy = jest.spyOn(prisma.author, "findFirst").mockResolvedValue(null);

    expect(getAuthorById(1)).rejects.toThrow(AuthorNotFoundError);
    spy.mockRestore();
  });
});

describe("createAuthor", () => {
  it(`Should create author and return`, async () => {
    const spy = jest
      .spyOn(prisma.author, "create")
      .mockResolvedValue(MockAuthor);
    const author = await createAuthor("James Jordan", 1);
    expect(author).toEqual(MockAuthor);
    spy.mockRestore();
  });
});

describe("updateAuthor", () => {
  it(`Should update author if author with id exists`, async () => {
    const findSpy = jest
      .spyOn(prisma.author, "findFirst")
      .mockResolvedValue(MockAuthor);
    const updateSpy = jest
      .spyOn(prisma.author, "update")
      .mockResolvedValue(MockAuthor);
    const author = await updateAuthor(1, { name: "James" }, 1);
    expect(author).toEqual(MockAuthor);
    findSpy.mockRestore();
    updateSpy.mockRestore();
  });
  it(`Should throw error if author with id doesn't exist`, async () => {
    const spy = jest.spyOn(prisma.author, "findFirst").mockResolvedValue(null);

    expect(updateAuthor(1, { name: "James" }, 1)).rejects.toThrow(
      AuthorNotFoundError
    );
    spy.mockRestore();
  });
});

describe("deleteAuthor", () => {
  it(`Should delete author if author with id exists`, async () => {
    const findSpy = jest
      .spyOn(prisma.author, "findFirst")
      .mockResolvedValue(MockAuthor);
    const deleteSpy = jest
      .spyOn(prisma.author, "delete")
      .mockResolvedValue(MockAuthor);
    const author = await deleteAuthor(1);
    expect(author).toEqual(MockAuthor);
    findSpy.mockRestore();
    deleteSpy.mockRestore();
  });
  it(`Should throw error if author with id doesn't exist`, async () => {
    const spy = jest.spyOn(prisma.author, "findFirst").mockResolvedValue(null);

    expect(deleteAuthor(1)).rejects.toThrow(AuthorNotFoundError);
    spy.mockRestore();
  });
});

describe("findAuthorOrCreate", () => {
  it(`Should find author if author with id exists`, async () => {
    const findSpy = jest
      .spyOn(prisma.author, "findFirst")
      .mockResolvedValue(MockAuthor);
    const createMock = jest.fn();
    const createSpy = jest
      .spyOn(prisma.author, "create")
      .mockImplementation(createMock);

    const result = await findAuthorOrCreate(
      { authorId: 1 } as UpsertBookRequest,
      1
    );
    expect(createMock).not.toHaveBeenCalled();
    expect(result).toBe(MockAuthor);
    findSpy.mockRestore();
    createSpy.mockRestore();
  });

  it(`Should create author if body has no author id`, async () => {
    const findSpy = jest
      .spyOn(prisma.author, "findFirst")
      .mockResolvedValue(null);

    const createSpy = jest
      .spyOn(prisma.author, "create")
      .mockResolvedValue(MockAuthor);

    const result = await findAuthorOrCreate(
      { author: { name: "John" } } as UpsertBookRequest,
      1
    );
    expect(prisma.author.create).toHaveBeenCalled();
    expect(result).toBe(MockAuthor);
    findSpy.mockRestore();
    createSpy.mockRestore();
  });
  it(`Should create author if body has no author id`, async () => {
    const findSpy = jest
      .spyOn(prisma.author, "findFirst")
      .mockResolvedValue(null);

    const createSpy = jest
      .spyOn(prisma.author, "create")
      .mockResolvedValue(MockAuthor);

    expect(
      findAuthorOrCreate({ authorId: 3 } as UpsertBookRequest, 1)
    ).rejects.toThrow(AuthorNotFoundError);
    findSpy.mockRestore();
    createSpy.mockRestore();
  });
});
