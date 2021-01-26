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

async function cart(req, res, next) {
  try {
    if (!req.user) {
      return res.json({
        error: 1,
        message: "Anda Belum Login atau Token Expired",
      });
    }
    let { items } = req.body;
    const productId = items.map((itm) => itm._id);
    const products = await Product.find({ _id: { $in: productId } })
      .populate("variant")
      .populate("discount");

    let cartItems = items.map((item) => {
      let realtedProduct = products.find(
        (product) => product._id.toString() === item._id
      );
      let discount = {
        name: realtedProduct.discount ? realtedProduct.discount.name : "",
        type: realtedProduct.discount ? realtedProduct.discount.type : "",
        value: realtedProduct.discount ? realtedProduct.discount.value : "",
      };
      let variant = {
        name: item.variantName,
        option: item.variantOption,
        stock: item.variantStock,
      };
      return {
        _id: realtedProduct._id,
        product: realtedProduct._id,
        price: realtedProduct.price,
        image_url: realtedProduct.image_url,
        name: realtedProduct.name,
        user: req.user._id,
        qty: item.qty,
        discount,
        variant,
      };
    });

    await Cart.bulkWrite(
      cartItems.map((item) => {
        return {
          updateMany: {
            filter: { user: req.user._id, product: item.product },
            update: item,
            upsert: true,
          },
        };
      })
    );
    return res.json(cartItems);
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

module.exports = { index, cart };
