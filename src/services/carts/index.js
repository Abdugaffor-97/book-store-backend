const express = require("express");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");

const {
  getBooks,
  writeBooks,
  getComments,
  writeComments,
} = require("../../fsUtilities");

const cartsRouter = express.Router();

cartsRouter.get("/", async (req, res, next) => {
  try {
    const books = await getBooks();
    const comments = await getComments();

    const reqBook = books.find((book) => book.asin === req.params.bookId);
    const bookCoomments = reqBook.comments;

    const filteredComments = comments.filter((comment) =>
      bookCoomments.includes(comment)
    );
    console.log(filteredComments);

    if (filteredComments.length) {
      res.send(filteredComments);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});
