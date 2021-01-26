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
    type: Date,
  },
  orders: [
    {
      type: String,
    },
  ],
  amount: {
    type: Number,
  },
});

orderSchema.plugin(AutoIncrement, { inc_field: "order_number" });

orderSchema.post("save", async function () {
  // let idVariant = [];
  let idUser = this.user;
  // let valueCartVariantOption = [];
  // let valueQty = [];
  await Cart.find({ user: idUser }).then(async (dataCart) => {
    dataCart.forEach((data) => {
      Product.findOne({ _id: data._id }).then((res) => {
        Variant.findOne({ _id: res.variant[0] }).then(async (variant) => {
          variant.option.forEach((option) => {
            if (data.variant.option === option.name) {
              option.stock = option.stock - data.qty;
            }
          });

          console.log("variant >>>>>>>>>>>");
          console.log(variant);

          await variant.save();
        });
      });
    });
  });
  // await Product.find({ _id: this.orders }).then((dataProduct) => {
  //   dataProduct.map(async (itmProduct) => {
  //     idVariant.push(itmProduct.variant[0]);
  //   });
  // });
  // let idVariantOption = [];
  // await Variant.find({ _id: idVariant }).then((dataVariant) => {
  //   dataVariant.map((itmVariant) => {
  //     itmVariant.option.map(async (itmOption) => {
  //       valueCartVariantOption.forEach((dataOption) => {
  //         if (itmOption.name === dataOption) {
  //           idVariantOption.push(itmOption._id);
  //         }
  //       });
  //     });
  //   });
  // });
  // console.log(
  //   "idVariant :",
  //   idVariant,
  //   "idVariantOption :",
  //   idVariantOption,
  //   "valueCartVariantOption :",
  //   valueCartVariantOption,
  //   "valueQty :",
  //   valueQty
  // );
});

module.exports = model("Order", orderSchema);
