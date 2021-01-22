const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama makanan minimal 3 karakter"],
      maxlength: [255, "Panjang nama makanan maksimal 255 karakter"],
      required: [true, "Nama produk harus diisi"],
    },

    price: {
      type: Number,
      default: 0,
    },

    image_url: String,

    //relational collection
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    variant: [
      {
        type: Schema.Types.ObjectId,
        ref: "Variant",
      },
    ],
  },
  { timestamps: true }
);
module.exports = model("Product", productSchema);
