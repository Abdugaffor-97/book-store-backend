const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new Schema(
  {
    username: { type: String, required: true },
    surname: { type: String, required: true },
    password: { type: String, required: true, minlength: 8 },
    email: { type: String, unique: true },
    role: { type: String, enum: ["Admin", "User"], required: true },
    purchaseHistory: [
      {
        asin: String,
        title: String,
        price: Number,
        category: String,
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();

  delete userObj.password;
  delete userObj.__v;

  return userObj;
};

UserSchema.pre("save", async function (next) {
  const user = this;
  const plainPassword = user.password;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(plainPassword, 10);
  }
  next();
});

UserSchema.statics.findByCredential = async function (email, password) {
  const user = await userModel.findOne({ email });

  if (user) {
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) return user;
    return null;
  }
  return null;
};

const userModel = model("User", UserSchema);

module.exports = userModel;
