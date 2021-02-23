const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);
const Product = require("../product/model");
const Variant = require("../variant/model");
const Cart = require("../cart/model");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = Schema({
  nama_lengkap: {
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
      Product: {
        type: String,
      },
      Category_Name: {
        type: String,
      },
      Variant_Name: {
        type: String,
      },
      VariantOption: {
        type: String,
      },
      Qty: {
        type: Number,
      },
      Discount: {
        type: String,
      },
      Price: {
        type: Number,
      },
      Total_Discount: {
        type: Number,
      },
      Sub_Total_Belanja: {
        type: Number,
      },
    },
  ],
  amount: {
    type: Number,
  },
});

orderSchema.plugin(AutoIncrement, { inc_field: "order_number" });

orderSchema.post("save", async function () {
  let idUser = this.user;
  await Cart.find({ user: idUser }).then(async (dataCart) => {
    dataCart.forEach((data) => {
      Product.findOne({ _id: data.product }).then(async (res) => {
        Variant.findOne({ _id: res.variant }).then(async (variant) => {
          variant.option.forEach(async (option) => {
            res.goods_sold = res.goods_sold + data.qty;
            if (data.variant.option === option.name) {
              option.stock = option.stock - data.qty;
            }
          });
          await variant.save();
          await res.save();
        });
      });
    });
  });
});

module.exports = model("Order", orderSchema);
