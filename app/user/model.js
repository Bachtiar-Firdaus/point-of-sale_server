const mongoose = require("mongoose");
const { model, Schema } = mongoose.set("useCreateIndex", true);
const path = require("path");
const bcrypt = require("bcrypt");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { Timestamp } = require("mongodb");

const hashRound = 10;
let userSchema = Schema(
  {
    fullName: {
      type: String,
      required: [true, "Nama Harus di isi"],
      minlength: [3, "panjang karakter nama minimal 3"],
      maxlength: [255, "panjang karakter nama maxsimal 255"],
    },
    customerId: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "email wajib di isi"],
      maxlength: [255, "panjang karakter email minimal 255"],
    },
    password: {
      type: String,
      required: [true, "password wajib di isi"],
      maxlength: [255, "panjang karakter Password minimal 255"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

userSchema.path("email").validate(
  function (value) {
    const emailRe = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRe.test(value);
  },
  (attr) => `${attr.value} harus merupakan email yang valid`
);

userSchema.path("email").validate(async function (value) {
  try {
    const count = await this.model("user").count({ email: value });
    return !count;
  } catch (error) {
    (attr) => `${attr.value} Email Telah Terdaftar!!`;
  }
});

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, hashRound);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customerId" });

module.exports = model("User", userSchema);
