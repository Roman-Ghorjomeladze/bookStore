import { User } from ".prisma/client";

export const MockUser: User = {
  id: 1,
  username: "john_doe",
  name: "John Doe",
  password: "password",
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const DefaultUserNotFoundError = {
  data: null,
  ok: false,
  errors: {
    message: "Default user not found",
    all: ["Default user not found"],
  },
};
