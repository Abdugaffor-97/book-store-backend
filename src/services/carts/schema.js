const { Schema, model } = require("mongoose");

const CartSchema = new Schema({
  user_name: { type: String },
  book_id: { type: Schema.Types.ObjectId, required: true },
});

module.exports = model("Cart", CartSchema);
