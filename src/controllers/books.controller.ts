import { Book, User } from "@prisma/client";

import {
  UPDATE_QUANTITY_OPERATION,
  UpdateBookQuantityRequest,
  UpsertBookRequest,
} from "@src/interfaces/book/request";
import prisma from "@src/prisma/client";
import { BadRequestError } from "@src/utils/error/BadRequestError";
import { findAuthorOrCreate } from "./author.controller";
import { EnvManager } from "@src/config/EnvManager";
import { BookNotFoundError } from "@src/utils/error/BookNotFoundError";

export const getAllBooks = async (): Promise<Book[]> => {
  const books = await prisma.book.findMany();
  return books || [];
};

export const getBookById = async (id: number): Promise<Book> => {
  const book = await prisma.book.findFirst({ where: { id } });
  if (book === undefined || !book) throw new BookNotFoundError(id);
  return book;
};

export const deleteBook = async (id: number): Promise<Book> => {
  const book = await prisma.book.findFirst({ where: { id } });
  if (!book) throw new BookNotFoundError(id);
  const deleted = await prisma.book.delete({ where: { id } });
  return deleted;
};

export const createBook = async (
  body: UpsertBookRequest,
  user: User
): Promise<Book> => {
  const author = await findAuthorOrCreate(body, user.id);
  if (!author) {
    throw new BadRequestError(`Couldn't create author from provided data`);
  }
  const book = await prisma.book.create({
    data: {
      description: body.description,
      isOutOfStock: body.isOutOfStock != false,
      price: body.price,
      title: body.title,
      authorId: author.id,
      publisherId: user.id,
      quantity: body.quantity,
    },
  });
  return book;
};

export const updateBook = async (
  id: number,
  body: UpsertBookRequest,
  userId: number
): Promise<Book> => {
  const book = await prisma.book.findFirst({ where: { id } });
  if (!book) throw new BookNotFoundError(id);
  const author = await findAuthorOrCreate(body, userId);
  const updated = await prisma.book.update({
    where: { id },
    data: {
      authorId: author?.id || book.authorId,
      description: body.description,
      price: body.price,
      title: body.title,
      isOutOfStock: body.isOutOfStock != false,
      quantity: body.quantity,
    },
  });
  return updated;
};

export const updateBookQuantity = async (
  id: number,
  body: UpdateBookQuantityRequest
): Promise<Book> => {
  const bookQtyTreshold = EnvManager.getOrderBookTreshold();
  const book = await prisma.book.findFirst({ where: { id } });
  if (!book) throw new BookNotFoundError(id);
  const newQuantity =
    body.operation === UPDATE_QUANTITY_OPERATION.DECREMENT
      ? book.quantity - body.quantity
      : book.quantity + body.quantity;
  if (newQuantity < 0) {
    throw new BadRequestError(`Result quantity can't be less than 0`);
  }
  if (newQuantity < bookQtyTreshold) {
    // Here should send notification to order a book
  }
  const updated = await prisma.book.update({
    where: { id },
    data: {
      quantity: newQuantity,
      isOutOfStock: newQuantity === 0,
    },
  });
  return updated;
};
