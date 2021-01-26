const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = Schema({
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

module.exports = model("Order", orderSchema);
