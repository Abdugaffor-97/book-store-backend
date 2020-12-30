const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
  title: String,
  img: String,
  price: Number,
  category: String,
});

const BookModel = mongoose.model("book", booksSchema);

module.exports = BookModel;
