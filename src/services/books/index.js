const express = require("express");
const { check, validationResult } = require("express-validator");
const BookModel = require("../../models/bookModel");

const { getBooks, writeBooks } = require("../../fsUtilities");

const booksRouter = express.Router();

booksRouter.get("/", async (req, res, next) => {
  try {
    console.log("Started");
    const books = await BookModel.find({});
    console.log(books);

    if (req.query && req.query.category) {
      const filteredBooks = books.filter(
        (book) =>
          book.hasOwnProperty("category") &&
          book.category === req.query.category
      );
      res.send(filteredBooks);
    } else if (req.query.preview === "all") {
      const categorySelected = [
        {
          category: "scifi",
          data: books.filter((book) => book.category === "scifi").slice(0, 8),
        },
        {
          category: "romance",
          data: books.filter((book) => book.category === "romance").slice(0, 8),
        },
        {
          category: "horror",
          data: books.filter((book) => book.category === "horror").slice(0, 8),
        },
        {
          category: "history",
          data: books.filter((book) => book.category === "history").slice(0, 8),
        },
        {
          category: "fantasy",
          data: books.filter((book) => book.category === "fantasy").slice(0, 8),
        },
      ];
      res.send(categorySelected);
    } else {
      res.send(books);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

booksRouter.get("/:asin", async (req, res, next) => {
  try {
    const books = await getBooks();

    const bookFound = books.find((book) => book.asin === req.params.asin);

    if (bookFound) {
      res.send(bookFound);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

booksRouter.post("/", async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error();
      error.message = errors;
      error.httpStatusCode = 400;
      next(error);
    } else {
      const newBook = new BookModel({
        ...req.body,
      });

      try {
        await newBook.save();
        res.status(201).send(newBook);
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

booksRouter.put("/:_id", async (req, res, next) => {
  try {
    const validatedData = matchedData(req);
    const books = await getBooks();

    const bookIndex = books.findIndex((book) => book._id === req.params._id);

    if (bookIndex !== -1) {
      // book found
      const updatedBooks = [
        ...books.slice(0, bookIndex),
        { ...books[bookIndex], ...validatedData },
        ...books.slice(bookIndex + 1),
      ];
      await writeBooks(updatedBooks);
      res.send(updatedBooks);
    } else {
      const err = new Error();
      err.httpStatusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log(error);
    const err = new Error("An error occurred while reading from the file");
    next(err);
  }
});

booksRouter.delete("/:_id", async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params._id);
    if (book) {
      try {
        await BookModel.deleteOne({ _id: req.params._id });
        res.send("deleted");
      } catch (error) {
        next(error);
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = booksRouter;
