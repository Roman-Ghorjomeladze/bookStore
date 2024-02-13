import { Book } from ".prisma/client";

export const MockBook: Book = {
  id: 1,
  authorId: 1,
  description: "My book",
  title: "My book",
  isOutOfStock: true,
  price: 23,
  publisherId: 1,
  quantity: 20,
  createdAt: new Date("2024-02-12T17:35:32.697Z"),
  updatedAt: new Date("2024-02-12T17:35:32.697Z"),
  deletedAt: null,
};

export const MockGetBookByIdResponse = {
  data: {
    id: 1,
    authorId: 1,
    description: "My book",
    title: "My book",
    isOutOfStock: true,
    price: 23,
    publisherId: 1,
    quantity: 20,
    createdAt: "2024-02-12T17:35:32.697Z",
    updatedAt: "2024-02-12T17:35:32.697Z",
    deletedAt: null,
  },
  ok: true,
};

export const MockGetBooksResponse = {
  data: [
    {
      id: 1,
      authorId: 1,
      description: "My book",
      title: "My book",
      isOutOfStock: true,
      price: 23,
      publisherId: 1,
      quantity: 20,
      createdAt: "2024-02-12T17:35:32.697Z",
      updatedAt: "2024-02-12T17:35:32.697Z",
      deletedAt: null,
    },
  ],
  ok: true,
};

export const MockCreateBookResponse = {
  data: {
    id: 1,
    authorId: 1,
    description: "My book",
    title: "My book",
    isOutOfStock: true,
    price: 23,
    publisherId: 1,
    quantity: 20,
    createdAt: "2024-02-12T17:35:32.697Z",
    updatedAt: "2024-02-12T17:35:32.697Z",
    deletedAt: null,
  },
  ok: true,
};

export const MockUpdateBookResponse = {
  data: {
    id: 1,
    authorId: 1,
    description: "My book",
    title: "My book",
    isOutOfStock: true,
    price: 23,
    publisherId: 1,
    quantity: 20,
    createdAt: "2024-02-12T17:35:32.697Z",
    updatedAt: "2024-02-12T17:35:32.697Z",
    deletedAt: null,
  },
  ok: true,
};

export const MockBookNotFoundResponse = {
  data: null,
  ok: false,
  errors: {
    message: "Book with id 1 not found!",
    all: ["Book with id 1 not found!"],
  },
};

export const MinQuantityAlertResponse = {
  data: null,
  ok: false,
  errors: {
    message: "Result quantity can't be less than 0",
    all: ["Result quantity can't be less than 0"],
  },
};

export const UpdateBookQuantitySuccessResponse = {
  data: {
    id: 1,
    authorId: 1,
    description: "My book",
    title: "My book",
    isOutOfStock: true,
    price: 23,
    publisherId: 1,
    quantity: 20,
    createdAt: "2024-02-12T17:35:32.697Z",
    updatedAt: "2024-02-12T17:35:32.697Z",
    deletedAt: null,
  },
  ok: true,
};
