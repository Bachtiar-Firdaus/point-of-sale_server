const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);

const discountSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang Nama Discount Minimal 3 Karakter"],
      required: [true, "Nama Discount Wajib Di Isi"],
    },

    date: {
      type: Date,
    },

    type: {
      type: String,
      enum: ["%", "fixed"],
      default: "%",
    },

    value: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["y", "n"],
      default: "y",
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

module.exports = ("Discount", discountSchema);
