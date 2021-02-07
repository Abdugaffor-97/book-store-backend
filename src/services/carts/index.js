const express = require("express");
const CartSchema = require("./schema");

const cartsRouter = express.Router();

cartsRouter.get("/", async (req, res, next) => {
  const cart = await CartSchema.find();
  res.send(cart);
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
});

cartsRouter.post("/", async (req, res, next) => {
  try {
    const cart = await CartSchema.create(req.body);
    cart.save();
    res.send(cart);
  } catch (error) {
    next(error);
  }
});

module.exports = cartsRouter;
