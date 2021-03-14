const moment = require("moment");
const mongoose = require("mongoose");
const { policyFor } = require("../policy");
const Order = require("./model");
const Cart = require("../cart/model");
const nodemailer = require("nodemailer");
const Product = require("../product/model");

async function index(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: "Anda Tidak Memiliki Akses Untuk Melihat History Order",
      });
    }
    let { limit = 10, skip = 0, date = "", fullName = "" } = req.query;
    let criteria = {};

    if (date.length) {
      criteria = {
        ...criteria,
        date: { $regex: `${date}`, $options: "i" },
      };
    }
    if (fullName.length) {
      criteria = {
        ...criteria,
        fullName: { $regex: `${fullName}`, $options: "i" },
      };
    }
    let dataOrder = await Order.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    let count = await Order.countDocuments(criteria);
    return res.json({ message: "succes", data: dataOrder, count });
  } catch (error) {
    next(error);
  }
}

async function creatOrder(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("create", "Order")) {
      return res.json({
        error: 1,
        message: "Anda Tidak Memiliki Akses Untuk Membuat Order",
      });
    }

    let { fullName, email } = req.body;
    let items = await Cart.find({ user: req.user._id })
      .populate("product")
      .populate("variant")
      .populate("category")
      .populate("discount");

    if (!items.length) {
      return res.json({
        error: 1,
        message: "Tidak Ditemukan Data Carts",
      });
    }

    let dataOrder = [];
    let dataAmount = [];
    let valueDiscount = 0;
    let valuePrice = 0;
    let valueQty = 0;
    let sigmaDiscount = 0;
    let valueAmount = 0;
    let sigmaAmount = 0;
    let faktur = [];
    let fakturDb = [];

    await Cart.find({ user: req.user._id }).then(async (dataCart) => {
      dataCart.map((itm) => {
        dataOrder.push(itm.product[0]);
        if (itm.discount.type === "%") {
          valueDiscount = parseInt(itm.discount.value);
          valuePrice = parseInt(itm.price);
          valueQty = parseInt(itm.qty);
          sigmaDiscount = (valueDiscount / 100) * valuePrice;
          valueAmount = (valuePrice - sigmaDiscount) * valueQty;
          dataAmount.push(valueAmount);
          faktur.push(
            `Product : ${itm.name} <br /> Discount : ${valueDiscount}% <br /> Price : ${valuePrice} <br /> Qty : ${valueQty} <br /> Total Discount : ${sigmaDiscount} <br /> Sub Total Belanja : ${valueAmount}`
          );
          fakturDb.push({
            product: itm.name,
            categoryName: itm.categoryName,
            variantName: itm.variant.name,
            variantOption: itm.variant.option,
            qty: valueQty,
            discount: valueDiscount + " %",
            price: valuePrice,
            totalDiscount: sigmaDiscount,
            subTotalBelanja: valueAmount,
          });
        } else if (itm.discount.type === "fixed") {
          valueDiscount = parseInt(itm.discount.value);
          valuePrice = parseInt(itm.price);
          valueQty = parseInt(itm.qty);
          sigmaDiscount = valueDiscount * valueQty;
          valueAmount = (valuePrice - valueDiscount) * valueQty;
          dataAmount.push(valueAmount);
          faktur.push(
            `Product : ${itm.name} <br /> Discount : ${valueDiscount} <br /> Price : ${valuePrice} <br /> Qty : ${valueQty} <br /> Total Discount : ${sigmaDiscount} <br /> Sub Total Belanja : ${valueAmount}`
          );
          fakturDb.push({
            product: itm.name,
            categoryName: itm.categoryName,
            variantName: itm.variant.name,
            variantOption: itm.variant.option,
            qty: valueQty,
            discount: valueDiscount,
            price: valuePrice,
            totalDiscount: sigmaDiscount,
            subTotalBelanja: valueAmount,
          });
        } else {
          valuePrice = parseInt(itm.price);
          valueQty = parseInt(itm.qty);
          valueAmount = valuePrice * valueQty;
          dataAmount.push(valueAmount);
          faktur.push(
            `Product : ${itm.name} <br /> Discount : - <br /> Price : ${valuePrice} <br /> Qty : ${valueQty} <br /> Total Discount : ${sigmaDiscount} <br /> Sub Total Belanja : ${valueAmount}`
          );
          fakturDb.push({
            product: itm.name,
            categoryName: itm.categoryName,
            variantName: itm.variant.name,
            variantOption: itm.variant.option,
            qty: valueQty,
            discount: "-",
            price: valuePrice,
            totalDiscount: sigmaDiscount,
            subTotalBelanja: valueAmount,
          });
        }
      });
    });
    dataAmount.forEach((sum) => {
      sigmaAmount += sum;
    });
    let postOrder = new Order({
      _id: new mongoose.Types.ObjectId(),
      fullName,
      orders: fakturDb,
      amount: sigmaAmount,
      email,
      user: req.user._id,
      date: moment().format("YYYY-MM-DD"),
    });
    await postOrder.save();

    await Cart.find({ user: req.user._id }).then(async (indicatorCart) => {
      result = indicatorCart.reduce(
        (function (hash) {
          return function (r, a) {
            var key = a.product;
            if (!hash[key]) {
              hash[key] = { product: a.product, qty: 0 };
              r.push(hash[key]);
            }
            hash[key].qty += a.qty;
            return r;
          };
        })(Object.create(null)),
        []
      );
      result.map((valueResult) => {
        Product.findOne({ _id: valueResult.product }).then(async (res) => {
          res.goodsSold += valueResult.qty;
          await res.save();
          console.log(res);
        });
      });
    });
    await Cart.find({ user: req.user._id }).then((data) => {
      data.map(async (itm) => {
        await Cart.findOneAndDelete({ user: itm.user });
      });
    });
    // izin pada gmail https://myaccount.google.com/lesssecureapps
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "critical.firdaus@gmail.com",
        pass: "Dausganteng12345",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    let info = await transporter.sendMail({
      from: '"Point Of Sale" <critical.firdaus@gmail.com>',
      to: req.body.email,
      subject: "Invoice Pembelian",
      text: "Invoice Text",
      html: `<b>Detail Pembelian<b><br />${faktur} <br /> Grand Total Belanja : ${sigmaAmount}`,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

    return res.json({ message: "succes", data: postOrder });
  } catch (error) {
    if (error && error.name === "ValidationError") {
      return res.json({
        error: 1,
        message: error.message,
        fields: error.errors,
      });
    }
    next(error);
  }
}

module.exports = { index, creatOrder };
