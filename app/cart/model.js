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

    image_url: String,

    price: {
      type: Number,
      default: 0,
    },

    discount: {
      name: { type: String },
      type: {
        type: String,
        enum: ["%", "fixed"],
        default: "%",
      },
      value: { type: Number, default: 0 },
    },
    variant: {
      name: { type: String },
      option: { type: String },
      stock: { type: Number },
    },

    qty: {
      type: Number,
      required: [true, "qty harus di isi"],
      min: [1, "minimal qty adalah 1"],
    },

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
