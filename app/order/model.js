const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);
const Product = require("../product/model");
const Variant = require("../variant/model");
const Cart = require("../cart/model");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  date: {
    type: String,
  },

  orders: [
    {
      product: {
        type: String,
      },
      categoryName: {
        type: String,
      },
      variantName: {
        type: String,
      },
      variantOption: {
        type: String,
      },
      qty: {
        type: Number,
      },
      discount: {
        type: String,
      },
      price: {
        type: Number,
      },
      totalDiscount: {
        type: Number,
      },
      subTotalBelanja: {
        type: Number,
      },
    },
  ],
  amount: {
    type: Number,
  },
});

orderSchema.plugin(AutoIncrement, { inc_field: "orderNumber" });

orderSchema.post("save", async function () {
  let idUser = this.user;
  await Cart.find({ user: idUser }).then(async (dataCart) => {
    dataCart.forEach((data) => {
      Product.findOne({ _id: data.product }).then(async (res) => {
        Variant.findOne({ _id: res.variant }).then(async (variant) => {
          variant.option.forEach(async (option) => {
            if (data.variant.option === option.name) {
              option.stock = option.stock - data.qty;
            }
          });
          await variant.save();
        });
      });
    });
  });
});

module.exports = model("Order", orderSchema);
