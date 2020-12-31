const mongoose = require("mongoose");
const Book = require("./bookModel");
const Comment = require("./commentModel");

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

const connectDB = () => mongoose.connect(process.env.DATABASE_URL);

const models = { Book, Comment };

module.exports = { connectDB, models };
