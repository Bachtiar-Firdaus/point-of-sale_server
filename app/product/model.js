const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang nama minimal 3 karakter"],
      maxlength: [255, "Panjang nama maksimal 255 karakter"],
      required: [true, "Nama harus diisi"],
    },
    description: {
      type: String,
      minlength: [3, "Panjang Deskripsi minimal 3 karakter"],
      maxlength: [10000, "Panjang Deskripsi maksimal 10.000 karakter"],
      required: [true, "Deskripsi harus diisi"],
    },

    price: {
      type: Number,
      default: 0,
      required: [true, "Price harus diisi"],
    },

    image_url: String,

    //relational collection
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    variant: {
      type: Schema.Types.ObjectId,
      ref: "Variant",
    },

    discount: {
      type: Schema.Types.ObjectId,
      ref: "Discount",
    },
  },
  { timestamps: true }
);
module.exports = model("Product", productSchema);
