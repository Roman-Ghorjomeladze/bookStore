import request from "supertest";

import { app } from "@src/app";
import * as bookController from "@src/controllers/books.controller";
import {
  MinQuantityAlertResponse,
  MockBook,
  MockBookNotFoundResponse,
  MockCreateBookResponse,
  MockGetBookByIdResponse,
  MockGetBooksResponse,
  MockUpdateBookResponse,
  UpdateBookQuantitySuccessResponse,
} from "../mocks/book/book";
import { MockSomethingWrongResponse } from "../mocks/general";
import prisma from "@src/prisma/client";
import {
  InvalidUpsertBookRequestBodies,
  ValidCreateBookRequestBodies,
  ValidCreateBookRequestBody,
} from "../mocks/book/createBookRequestBody";
import { DefaultUserNotFoundError, MockUser } from "../mocks/user";

describe("GET /book", () => {
  // Happy path
  it(`Should return books and status code 200`, async () => {
    const spy = jest
      .spyOn(bookController, "getAllBooks")
      .mockResolvedValue([MockBook]);

    const res = await request(app).get("/book");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(MockGetBooksResponse);
    spy.mockRestore();
  });

  // Unhappy path
  it(`Should return bad request if database layer fails`, async () => {
    const mockError = new Error("Test error message");
    const spy = jest
      .spyOn(bookController, "getAllBooks")
      .mockRejectedValue(mockError);

    const response = await request(app).get("/book");
    expect(response.status).toBe(500);
    expect(response.body).toEqual(MockSomethingWrongResponse);
    spy.mockRestore();
  });
});

describe("GET /book/:id", () => {
  // Happy path
  it(`Should return books and status code 200`, async () => {
    const spy = jest
      .spyOn(bookController, "getBookById")
      .mockResolvedValue(MockBook);

    const res = await request(app).get("/book/2");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(MockGetBookByIdResponse);
    spy.mockRestore();
  });

  // Unhappy path
  it(`Should return something went wrong error when database layer fails`, async () => {
    const mockError = new Error("Test error message");
    const spy = jest
      .spyOn(bookController, "getBookById")
      .mockRejectedValue(mockError);

    const response = await request(app).get("/book/1");
    expect(response.status).toBe(500);
    expect(response.body).toEqual(MockSomethingWrongResponse);
    spy.mockRestore();
  });

  it(`Should return 404 not found response when book doesn't exists`, async () => {
    const spy = jest.spyOn(prisma.book, "findFirst").mockResolvedValue(null);

    const response = await request(app).get("/book/1");
    expect(response.status).toBe(404);
    expect(response.body).toEqual(MockBookNotFoundResponse);
    spy.mockRestore();
  });
});

describe("POST /book", () => {
  // Happy path
  describe.each(ValidCreateBookRequestBodies)(
    `Should create a book when request body is valid`,
    ({ body, scenario }) => {
      test(`When ${scenario}`, async () => {
        const spy = jest
          .spyOn(bookController, "createBook")
          .mockResolvedValue(MockBook);
        const res = await request(app).post("/book").send(body);
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual(MockCreateBookResponse);
        spy.mockRestore();
      });
    }
  );

  // Unhappy path
  describe.each(InvalidUpsertBookRequestBodies)(
    `It should throw an error when request body is invalid`,
    ({ body, scenario }) => {
      test(`When ${scenario}`, async () => {
        const res = await request(app).post("/book").send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("ok", false);
        expect(res.body).toHaveProperty("errors");
        expect(res.body).toHaveProperty("errors.message");
        expect(res.body).toHaveProperty("errors.all");
      });
    }
  );
  describe(`Further error handling`, () => {
    it(`Should throw an error when there is no Default user in database`, async () => {
      const userSpy = jest
        .spyOn(prisma.user, "findFirst")
        .mockResolvedValue(null);
      const bookSpy = jest
        .spyOn(bookController, "createBook")
        .mockResolvedValue(MockBook);
      const res = await request(app)
        .post("/book")
        .send(ValidCreateBookRequestBody.body);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual(DefaultUserNotFoundError);
      userSpy.mockRestore();
      bookSpy.mockRestore();
    });
  });
});

describe("PUT /book/:id", () => {
  // Happy path
  describe.each(ValidCreateBookRequestBodies)(
    `Should update a book when request body is valid`,
    ({ body, scenario }) => {
      test(`When ${scenario}`, async () => {
        const spy = jest
          .spyOn(bookController, "updateBook")
          .mockResolvedValue(MockBook);
        const res = await request(app).put("/book/1").send(body);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(MockUpdateBookResponse);
        spy.mockRestore();
      });
    }
  );

  // Unhappy path
  describe.each(InvalidUpsertBookRequestBodies)(
    `It should throw an error when request body is invalid`,
    ({ body, scenario }) => {
      test(`When ${scenario}`, async () => {
        const res = await request(app).put("/book/1").send(body);
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("ok", false);
        expect(res.body).toHaveProperty("errors");
        expect(res.body).toHaveProperty("errors.message");
        expect(res.body).toHaveProperty("errors.all");
      });
    }
  );
  describe(`Further error handling`, () => {
    it(`Should reutrn an error response when there is no Default user in database`, async () => {
      const userSpy = jest
        .spyOn(prisma.user, "findFirst")
        .mockResolvedValue(null);
      const bookSpy = jest
        .spyOn(bookController, "createBook")
        .mockResolvedValue(MockBook);
      const res = await request(app)
        .put("/book/1")
        .send(ValidCreateBookRequestBody.body);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual(DefaultUserNotFoundError);
      userSpy.mockRestore();
      bookSpy.mockRestore();
    });

    it(`Should return 404 error when there is no book with provided id`, async () => {
      const userSpy = jest
        .spyOn(prisma.user, "findFirst")
        .mockResolvedValue(MockUser);
      const bookSpy = jest
        .spyOn(prisma.book, "findFirst")
        .mockResolvedValue(null);
      const res = await request(app)
        .put("/book/1")
        .send(ValidCreateBookRequestBody.body);
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual(MockBookNotFoundResponse);
      userSpy.mockRestore();
      bookSpy.mockRestore();
    });

    it(`Should return something wrong response if database layer fails`, async () => {
      const mockError = new Error("Test error message");
      const spy = jest
        .spyOn(bookController, "updateBook")
        .mockRejectedValue(mockError);

      const response = await request(app)
        .put("/book/1")
        .send(ValidCreateBookRequestBody.body);
      expect(response.status).toBe(500);
      expect(response.body).toEqual(MockSomethingWrongResponse);
      spy.mockRestore();
    });
  });
});

describe("DELETE /book/:id", () => {
  // Happy path
  it(`Should delete book with id when book exists`, async () => {
    const spy = jest
      .spyOn(bookController, "deleteBook")
      .mockResolvedValue(MockBook);

    const res = await request(app).delete("/book/1");
    expect(res.statusCode).toBe(200);
    spy.mockRestore();
  });

  // Unhappy path
  it(`Should return not found error when book doesn't exists`, async () => {
    jest.spyOn(prisma.book, "findFirst").mockResolvedValue(null);

    const res = await request(app).delete("/book/1");
    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual(MockBookNotFoundResponse);
  });

  it(`Should return something wrong response if database layer fails`, async () => {
    const mockError = new Error("Test error message");
    const spy = jest
      .spyOn(bookController, "deleteBook")
      .mockRejectedValue(mockError);

    const response = await request(app).delete("/book/1");
    expect(response.status).toBe(500);
    expect(response.body).toEqual(MockSomethingWrongResponse);
    spy.mockRestore();
  });
});

describe("PUT /book/:id/quantity", () => {
  // Happy path
  it("Should return updated book when success", async () => {
    const userSpy = jest
      .spyOn(prisma.user, "findFirst")
      .mockResolvedValue(MockUser);
    const bookSpy = jest
      .spyOn(prisma.book, "findFirst")
      .mockResolvedValue(MockBook);
    const updateSpy = jest
      .spyOn(prisma.book, "update")
      .mockResolvedValue(MockBook);
    const response = await request(app)
      .put("/book/1/quantity")
      .send({ operation: "increment", quantity: 10 });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(UpdateBookQuantitySuccessResponse);
    bookSpy.mockRestore();
    updateSpy.mockRestore();
    userSpy.mockRestore();
  });

  const testBadScenario = async (body: Object) => {
    const spy = jest
      .spyOn(bookController, "updateBookQuantity")
      .mockResolvedValue(MockBook);
    const res = await request(app)
      .put("/book/1/quantity")
      .send({ operation: "decrement" });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("ok", false);
    expect(res.body).toHaveProperty("errors");
    expect(res.body).toHaveProperty("errors.message");
    expect(res.body).toHaveProperty("errors.all");
    spy.mockRestore();
  };
  // Unhappy path
  describe(`Should return bad response if request body is invalid`, () => {
    it(`Quantity is not in request body`, async () => {
      testBadScenario({ operation: "decrement" });
    });
    it(`Operation is not in request body`, async () => {
      testBadScenario({ quantity: 21 });
    });
    it(`Quantity is not integer`, async () => {
      testBadScenario({ quantity: "notInt", operation: "decrement" });
    });
    it(`Operation has invalid value`, async () => {
      testBadScenario({ quantity: 12, operation: "someValue" });
    });
    it(`Should return user not found error if default user doesn't exists`, async () => {
      const spy = jest.spyOn(prisma.user, "findFirst").mockResolvedValue(null);
      const res = await request(app)
        .put("/book/1/quantity")
        .send({ operation: "decrement", quantity: 10 });
      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual(DefaultUserNotFoundError);
      spy.mockRestore();
    });
    it(`Should return something wrong response if database layer fails`, async () => {
      const mockError = new Error("Test error message");
      const spy = jest
        .spyOn(bookController, "updateBookQuantity")
        .mockRejectedValue(mockError);

      const response = await request(app)
        .put("/book/1/quantity")
        .send({ operation: "decrement", quantity: 10 });
      expect(response.status).toBe(500);
      expect(response.body).toEqual(MockSomethingWrongResponse);
      spy.mockRestore();
    });
    it(`Should return bad response when decrement request is more than actual book quantity`, async () => {
      const userSpy = jest
        .spyOn(prisma.user, "findFirst")
        .mockResolvedValue(MockUser);
      const bookSpy = jest
        .spyOn(prisma.book, "findFirst")
        .mockResolvedValue(MockBook);
      const response = await request(app)
        .put("/book/1/quantity")
        .send({ operation: "decrement", quantity: 100 });
      expect(response.statusCode).toBe(400);
      expect(response.body).toEqual(MinQuantityAlertResponse);
      bookSpy.mockRestore();
      userSpy.mockRestore();
    });
  });
});
