const { Schema, model } = require("mongoose");

const BookSchema = new Schema(
  {
    asin: { type: String, required: true },
    surname: { type: String, required: true },
    email: String,
    age: { type: Number, min: [18, "Too young"], default: 18 },
  },
  { timestamps: true }
);

module.exports = model("Books", BookSchema); // Bounded to users collection
