const express = require("express");
const UserModel = require("./schema");
const BookModel = require("../books/schema");
const mongoose = require("mongoose");
const { basic } = require("../auth");

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/me", basic, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/me", basic, async (req, res, next) => {
  try {
    await req.user.deleteOne();
    res.status(204).send("Deleted");
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id/purchaseHistory/:bookId", async (req, res, next) => {
  try {
    await UserModel.findByIdAndUpdate(req.params.id, {
      $pull: {
        purchaseHistory: { _id: mongoose.Types.ObjectId(req.params.bookId) },
      },
    });
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id/purchaseHistory", async (req, res, next) => {
  try {
    const { purchaseHistory } = await UserModel.findById(req.params.id);
    res.send(purchaseHistory);
  } catch (error) {
    next(error);
  }
});

userRouter.post("/:id/purchaseHistory", async (req, res, next) => {
  try {
    const bookId = req.body.bookId;

    const purchasedBook = await BookModel.findById(bookId, { _id: 0 });

    const bookToAdd = { ...purchasedBook.toObject(), date: new Date() };

    const modifiedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: { purchaseHistory: bookToAdd },
      },
      { runValidators: true, new: true }
    );
    res.send(modifiedUser);
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:id", async (req, res, next) => {
  try {
    await UserModel.findByIdAndDelete(req.params.id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.put("/:id", async (req, res, next) => {
  try {
    await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    res.send("ok");
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find({ role: "Admin" });
    res.send(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = userRouter;
