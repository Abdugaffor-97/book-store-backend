const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    asin: { type: String, required: true },
    username: { type: String, required: true, maxlength: 64 },
    text: { type: String, required: true, maxlength: 512 },
    rate: { type: Number, required: true, maxlength: 1 },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("comment", commentsSchema);

module.exports = CommentModel;
