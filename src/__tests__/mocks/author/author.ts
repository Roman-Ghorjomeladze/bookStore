import { Author } from ".prisma/client";

export const MockAuthor: Author = {
  id: 1,
  name: "James Jordan",
  userId: 1,
  createdAt: new Date("2024-02-12T20:56:35.323Z"),
  updatedAt: new Date("2024-02-12T20:56:35.323Z"),
};

export const MockAuthorTwo: Author = {
  ...MockAuthor,
  id: 2,
  userId: 2,
};

export const MockGetAuthorsResponse = {
  data: [
    {
      id: 1,
      name: "James Jordan",
      userId: 1,
      createdAt: "2024-02-12T20:56:35.323Z",
      updatedAt: "2024-02-12T20:56:35.323Z",
    },
  ],
  ok: true,
};

export const MockGetAuthorByIdResponse = {
  data: {
    id: 1,
    name: "James Jordan",
    userId: 1,
    createdAt: "2024-02-12T20:56:35.323Z",
    updatedAt: "2024-02-12T20:56:35.323Z",
  },
  ok: true,
};

export const MockAuthorNotFoundResponse = {
  data: null,
  ok: false,
  errors: {
    message: "Author with id 1 not found!",
    all: ["Author with id 1 not found!"],
  },
};

export const MockUpsertAuthorResponse = {
  data: {
    id: 1,
    name: "James Jordan",
    userId: 1,
    createdAt: "2024-02-12T20:56:35.323Z",
    updatedAt: "2024-02-12T20:56:35.323Z",
  },
  ok: true,
};
