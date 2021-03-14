const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);

const variantSchema = Schema(
  {
    name: {
      type: String,
      minlength: [1, "Nama Variant minimal 1 karakter"],
      required: [true, "Nama Variant Wajib Di isi"],
    },
    option: [
      {
        name: {
          type: String,
          minlength: [1, "Nama Options Variant minimal 1 karakter"],
          required: [true, "Nama Options Variant Wajib Di isi"],
        },

        stock: {
          type: Number,
          minlength: [1, "Jumlah Stock minimal 1"],
          required: [true, "Stock Wajib Di Isi"],
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = model("Variant", variantSchema);
