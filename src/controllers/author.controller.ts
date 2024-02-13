import { Author } from "@prisma/client";
import prisma from "@src/prisma/client";
import { UpsertAuthorRequest } from "@src/interfaces/author/request";
import { UpsertBookRequest } from "@src/interfaces/book/request";
import { AuthorNotFoundError } from "@src/utils/error/AuthorNotFoundError";

export const getAllAuthors = async () => {
  const authors = await prisma.author.findMany();
  return authors;
};

export const getAuthorById = async (id: number): Promise<Author> => {
  const author = await prisma.author.findFirst({ where: { id } });
  if (!author) throw new AuthorNotFoundError(id);
  return author;
};

export const createAuthor = async (
  name: string,
  userId: number
): Promise<Author> => {
  const author = await prisma.author.create({
    data: {
      name,
      userId,
    },
  });
  return author;
};

export const updateAuthor = async (
  id: number,
  body: UpsertAuthorRequest,
  userId: number
): Promise<Author> => {
  const author = await prisma.author.findFirst({ where: { id } });
  if (!author) throw new AuthorNotFoundError(id);
  const updated = await prisma.author.update({
    where: { id },
    data: {
      name: body.name,
    },
  });
  return updated;
};

export const deleteAuthor = async (id: number): Promise<Author> => {
  const author = await prisma.author.findFirst({ where: { id } });
  if (!author) throw new AuthorNotFoundError(id);
  await prisma.book.deleteMany({ where: { authorId: id } });
  const deleted = await prisma.author.delete({ where: { id } });
  return deleted;
};

export const findAuthorOrCreate = async (
  body: UpsertBookRequest,
  userId: number
): Promise<Author | undefined> => {
  let author: Author | undefined;
  if (body.authorId) {
    const authorExists = await prisma.author.findFirst({
      where: { id: body.authorId },
    });
    if (!authorExists) {
      throw new AuthorNotFoundError(body.authorId);
    }
    author = authorExists;
  } else if (body.author?.name) {
    author = await createAuthor(body.author?.name, userId);
  }
  return author;
};
