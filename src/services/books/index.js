const express = require("express");
const { check, validationResult } = require("express-validator");
const BookModel = require("../../models/bookModel");

const booksRouter = express.Router();

booksRouter.get("/", async (req, res, next) => {
  try {
    if (req.query && req.query.category) {
      const books = await BookModel.find({ category: req.query.category });
      console.log(books);
      res.send(books);
    } else if (req.query.preview === "all") {
      const scifi = await BookModel.find({ category: "scifi" });
      const romance = await BookModel.find({ category: "romance" });
      const horror = await BookModel.find({ category: "horror" });
      const history = await BookModel.find({ category: "history" });
      const fantasy = await BookModel.find({ category: "fantasy" });
      const categorySelected = [
        {
          category: "scifi",
          data: scifi.slice(0, 8),
        },
        {
          category: "romance",
          data: romance.slice(0, 8),
        },
        {
          category: "horror",
          data: horror.slice(0, 8),
        },
        {
          category: "history",
          data: history.slice(0, 8),
        },
        {
          category: "fantasy",
          data: fantasy.slice(0, 8),
        },
      ];
      res.send(categorySelected);
    } else {
      const books = await BookModel.find();
      res.send(books);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

booksRouter.get("/:_id", async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params._id);
    if (book) {
      res.status(200).send(book);
    } else {
      res.status(404);
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
      const newBook = new BookModel(req.body);
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

// booksRouter.put("/:_id", async (req, res, next) => {
//   try {
//     BookModel.findOneAndUpdate(req.params._id, { ...req.body });
//     // console.log(book);
//     res.send("Ksksks");
//   } catch (error) {
//     console.log(error);
//     const err = new Error("An error occurred while reading from the file");
//     next(err);
//   }
// });

booksRouter.delete("/:_id", async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params._id);
    if (book) {
      try {
        await BookModel.deleteOne({ _id: req.params._id });
        res.send("Deleted");
      } catch (error) {
        next(error);
      }
    } else {
      res.status(404).send("Not Found");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = booksRouter;
