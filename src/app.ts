import express from "express";
import swaggerUi from "swagger-ui-express";

import { booksRouter } from "@src/routers/books.router";
import { authorRouter } from "./routers/author.router";
import { swaggerDocument } from "./config/swagger";
import { NotFoundError } from "./utils/error/NotFoundError";

const app = express();

app.use(express.json());
app.use("/book", booksRouter);
app.use("/author", authorRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("*", (req, res) => {
  return res.status(404).json(new NotFoundError("Unsupported API endpoint."));
});
export { app };
