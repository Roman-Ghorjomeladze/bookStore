import request from "supertest";

import { app } from "@src/app";
import * as authorController from "@src/controllers/author.controller";
import { MockSomethingWrongResponse } from "../mocks/general";
import prisma from "@src/prisma/client";
import {
  MockAuthor,
  MockAuthorNotFoundResponse,
  MockUpsertAuthorResponse,
  MockGetAuthorByIdResponse,
  MockGetAuthorsResponse,
} from "../mocks/author/author";
import { DefaultUserNotFoundError } from "../mocks/user";

describe("GET /author", () => {
  // Happy path
  it(`Should return books and status code 200`, async () => {
    const spy = jest
      .spyOn(authorController, "getAllAuthors")
      .mockResolvedValue([MockAuthor]);

    const res = await request(app).get("/author");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(MockGetAuthorsResponse);
    spy.mockRestore();
  });

  // Unhappy path
  it(`Should return bad request if database layer fails`, async () => {
    const mockError = new Error("Test error message");
    const spy = jest
      .spyOn(authorController, "getAllAuthors")
      .mockRejectedValue(mockError);

    const response = await request(app).get("/author");
    expect(response.status).toBe(500);
    expect(response.body).toEqual(MockSomethingWrongResponse);
    spy.mockRestore();
  });
});

describe("GET /author/:id", () => {
  // Happy path
  it(`Should return book and status code 200`, async () => {
    const spy = jest
      .spyOn(authorController, "getAuthorById")
      .mockResolvedValue(MockAuthor);

    const res = await request(app).get("/author/1");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(MockGetAuthorByIdResponse);
    spy.mockRestore();
  });

  // Unhappy path
  it(`Should return bad request if database layer fails`, async () => {
    const mockError = new Error("Test error message");
    const spy = jest
      .spyOn(authorController, "getAuthorById")
      .mockRejectedValue(mockError);

    const response = await request(app).get("/author/1");
    expect(response.status).toBe(500);
    expect(response.body).toEqual(MockSomethingWrongResponse);
    spy.mockRestore();
  });
  it(`Should return 404 not found if there is no author with provided id`, async () => {
    const spy = jest.spyOn(prisma.author, "findFirst").mockResolvedValue(null);

    const response = await request(app).get("/author/1");

    expect(response.status).toBe(404);
    expect(response.body).toEqual(MockAuthorNotFoundResponse);
    spy.mockRestore();
  });
});

describe("POST /author", () => {
  // Happy path
  it(`Should create author if request body is valid`, async () => {
    const spy = jest
      .spyOn(authorController, "createAuthor")
      .mockResolvedValue(MockAuthor);
    const res = await request(app)
      .post("/author")
      .send({ name: "James Jordan" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(MockUpsertAuthorResponse);
    spy.mockRestore();
  });

  const testBadScenario = async (body: Object) => {
    const spy = jest
      .spyOn(authorController, "createAuthor")
      .mockResolvedValue(MockAuthor);
    const res = await request(app).post("/author").send(body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toHaveProperty("errors.message");
    expect(res.body).toHaveProperty("errors.all");
    spy.mockRestore();
  };
  // Unhappy path
  describe(`Should throw an error if request body is invalid`, () => {
    it(`Fails when request body is empty`, async () => {
      testBadScenario({});
    });
    it(`Fails when request body has name with non string value`, async () => {
      testBadScenario({ name: null });
      testBadScenario({ name: 123 });
    });

    it(`Should return user not found error if default user doesn't exists`, async () => {
      const spy = jest.spyOn(prisma.user, "findFirst").mockResolvedValue(null);
      const res = await request(app)
        .post("/author")
        .send({ name: "James Jordan" });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual(DefaultUserNotFoundError);
      spy.mockRestore();
    });

    it(`Should return something wrong response if database layer fails`, async () => {
      const mockError = new Error("Test error message");
      const spy = jest
        .spyOn(authorController, "createAuthor")
        .mockRejectedValue(mockError);

      const res = await request(app)
        .post("/author")
        .send({ name: "James Jordan" });
      expect(res.status).toBe(500);
      expect(res.body).toEqual(MockSomethingWrongResponse);
      spy.mockRestore();
    });
  });
});

describe("PUT /author/id", () => {
  // Happy path
  it(`Should update author if request body is valid`, async () => {
    const spy = jest
      .spyOn(authorController, "updateAuthor")
      .mockResolvedValue(MockAuthor);
    const res = await request(app)
      .put("/author/1")
      .send({ name: "James Jordan" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(MockUpsertAuthorResponse);
    spy.mockRestore();
  });

  const testBadScenario = async (body: Object) => {
    const spy = jest
      .spyOn(authorController, "updateAuthor")
      .mockResolvedValue(MockAuthor);
    const res = await request(app).put("/author/id").send(body);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toHaveProperty("errors.message");
    expect(res.body).toHaveProperty("errors.all");
    spy.mockRestore();
  };
  // Unhappy path
  describe(`Should throw an error if request body is invalid`, () => {
    it(`Fails when request body is empty`, async () => {
      testBadScenario({});
    });
    it(`Fails when request body has name with non string value`, async () => {
      testBadScenario({ name: null });
      testBadScenario({ name: 123 });
    });

    it(`Should return author not found error if author doesn't exists`, async () => {
      const findSpy = jest
        .spyOn(prisma.author, "findFirst")
        .mockResolvedValue(null);
      const updateSpy = jest
        .spyOn(prisma.author, "update")
        .mockResolvedValue(MockAuthor);
      const res = await request(app)
        .put("/author/1")
        .send({ name: "James Jordan" });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual(MockAuthorNotFoundResponse);
      findSpy.mockRestore();
      updateSpy.mockRestore();
    });

    it(`Should return user not found error if default user doesn't exists`, async () => {
      const spy = jest.spyOn(prisma.user, "findFirst").mockResolvedValue(null);
      const res = await request(app)
        .put("/author/1")
        .send({ name: "James Jordan" });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual(DefaultUserNotFoundError);
      spy.mockRestore();
    });

    it(`Should return something wrong response if database layer fails`, async () => {
      const mockError = new Error("Test error message");
      const spy = jest
        .spyOn(authorController, "updateAuthor")
        .mockRejectedValue(mockError);

      const res = await request(app)
        .put("/author/id")
        .send({ name: "James Jordan" });
      expect(res.status).toBe(500);
      expect(res.body).toEqual(MockSomethingWrongResponse);
      spy.mockRestore();
    });
  });
});

describe("DELETE /author/:id", () => {
  // Happy path
  it(`Should delete author with id when author exists`, async () => {
    const spy = jest
      .spyOn(authorController, "deleteAuthor")
      .mockResolvedValue(MockAuthor);

    const res = await request(app).delete("/author/1");
    expect(res.statusCode).toBe(200);
    spy.mockRestore();
  });

  // Unhappy path
  it(`Should return not found error when author doesn't exists`, async () => {
    jest.spyOn(prisma.author, "findFirst").mockResolvedValue(null);

    const res = await request(app).delete("/author/1");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(MockAuthorNotFoundResponse);
  });

  it(`Should return something wrong response if database layer fails`, async () => {
    const mockError = new Error("Test error message");
    const spy = jest
      .spyOn(authorController, "deleteAuthor")
      .mockRejectedValue(mockError);

    const response = await request(app).delete("/author/1");
    expect(response.status).toBe(500);
    expect(response.body).toEqual(MockSomethingWrongResponse);
    spy.mockRestore();
  });
});
