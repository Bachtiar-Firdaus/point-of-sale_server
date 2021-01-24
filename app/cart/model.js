const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);

const cartSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama makanan minimal 3 karakter"],
      maxlength: [255, "Panjang nama makanan maksimal 255 karakter"],
      required: [true, "Nama produk harus diisi"],
    },

    qty: {
      type: Number,
      required: [true, "qty harus di isi"],
      min: [1, "minimal qty adalah 1"],
    },

    price: {
      type: Number,
      default: 0,
    },

    image_url: String,

    //relational collection
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Cart", cartSchema);
