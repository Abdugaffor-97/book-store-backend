const express = require("express");
const UserModel = require("./schema");

const userRouter = express.Router();

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

userRouter.post("/", async (req, res, next) => {
  try {
    // const newUser = new UserModel({ name: "Al", surname: "la" });
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
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
