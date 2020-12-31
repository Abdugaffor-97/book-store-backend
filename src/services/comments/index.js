const express = require("express");
const uniqid = require("uniqid");
const { check, validationResult } = require("express-validator");

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

commentsRouter.get("/:bookId/comments", async (req, res, next) => {
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

commentsRouter.delete(
  "/:bookId/comments/:commentId",
  async (req, res, next) => {
    try {
      const books = await getBooks();
      const comments = await getComments();

      const newComments = comments.filter(
        // Remove spesific comment
        (comment) => comment.commentId !== req.params.commentId
      );
      const bookFound = books.find((book) => book.asin === req.params.bookId);
      bookFound.comments = bookFound.comments.filter(
        // Remove comment id from book
        (comment) => comment !== req.params.commentId
      );

      if (bookFound) {
        const filteredBooks = books.filter(
          (book) => book.asin !== req.params.asin
        );

        await writeBooks(filteredBooks);
        await writeComments(newComments);
        res.status(204).send();
      } else {
        const error = new Error();
        error.httpStatusCode = 404;
        next(error);
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

module.exports = commentsRouter;
