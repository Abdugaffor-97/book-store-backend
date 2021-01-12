const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: String,
    age: { type: Number, min: [18, "Too young"], default: 18 },
  },
  { timestamps: true }
);

module.exports = model("User", UserSchema); // Bounded to users collection
