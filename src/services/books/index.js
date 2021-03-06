const express = require("express");
const BookModel = require("./schema");
const q2m = require("query-to-mongo");

const booksRouter = express.Router();

booksRouter.get("/", async (req, res, next) => {
  try {
    const query = q2m(req.query);

    const total = await BookModel.countDocuments(query.criteria);
    const books = await BookModel.find(query.criteria)
      .skip(query.options.skip)
      .limit(query.options.limit);

    res.send({ next: query.links("", total)["next"], books });
  } catch (error) {
    next(error);
  }
});

booksRouter.get("/preview", async (req, res, next) => {
  try {
    const history = await BookModel.find({ category: "history" }).limit(10);
    const romance = await BookModel.find({ category: "romance" }).limit(10);
    const horror = await BookModel.find({ category: "horror" }).limit(10);
    const fantasy = await BookModel.find({ category: "fantasy" }).limit(10);
    const scifi = await BookModel.find({ category: "scifi" }).limit(10);

    res.send([history, romance, horror, fantasy, scifi]);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

booksRouter.get("/:id", async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params.id);

    if (book) {
      res.send(book);
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

module.exports = booksRouter;
