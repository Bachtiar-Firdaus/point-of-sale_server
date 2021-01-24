const { policyFor } = require("../policy");
const Product = require("../product/model");
const Cart = require("./model");

async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.json({
        error: 1,
        message: "Anda Belum Login Atau Token Expired",
      });
    }
    let cart = await Cart.find().populate("product");
    return res.json(cart);
  } catch (error) {
    next(error);
  }
}

module.exports = { index };
