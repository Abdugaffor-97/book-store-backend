const express = require("express");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");

const {
  getBooks,
  writeBooks,
  getComments,
  writeComments,
} = require("../../fsUtilities");

const commentsRouter = express.Router();

commentsRouter.post("/:bookId/comments", async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.message = errors;
      error.httpStatusCode = 400;
      next(error);
    } else {
      const comments = await getComments();
      const books = await getBooks();

      const comment = {
        commentId: uniqid(),
        date: new Date(),
        ...req.body,
      };

      books.forEach((book) => {
        if (book.asin === req.params.bookId) {
          console.log(true);
          if (!book.comments) {
            book.comments = [];
            book.comments.push(comment.commentId);
          } else {
            book.comments.push(comment.commentId);
          }
        }
      });

      comments.push(comment);
      await writeComments(comments);
      await writeBooks(books);
      res.status(201).send(comment.commentId);
    }
  } catch (error) {
    console.log(error);
    const err = new Error("An error occurred while reading from the file");
    next(err);
  }
});

commentsRouter.get("/:bbokId/comments", async (req, res, next) => {
  try {
    const books = await getBooks();
    const comments = await getComments();

    if (req.query && req.query.category) {
      const filteredBooks = books.filter(
        (book) =>
          book.hasOwnProperty("category") &&
          book.category === req.query.category
      );
      res.send(filteredBooks);
    } else {
      res.send(books);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = commentsRouter;
