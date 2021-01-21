const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);

const variantSchema = Schema(
  {
    //relational collection
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },

    name: [
      {
        type: String,
        minlength: [1, "Nama Variant minimal 1 karakter"],
        required: [true, "Nama Variant Wajib Di isi"],
      },
    ],
    stock: [
      {
        type: Number,
        minlength: [1, "Jumlah Stock minimal 1"],
        required: [true, "Stock Wajib Di Isi"],
      },
    ],
  },
  { Timestamp: true }
);

module.exports = model("Variant", variantSchema);
