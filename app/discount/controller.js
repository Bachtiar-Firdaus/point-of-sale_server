const { policyFor } = require("../policy");
const Product = require("../product/model");
const Discount = require("./model");

async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.json({
        error: 1,
        message: "Anda Belum Login Atau Token Expired",
      });
    }
    let { limit = 10, skip = 0, q = "" } = req.query;
    let criteria = {};

    if (q.length) {
      criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };
    }
    let discount = await Discount.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    return res.json(discount);
  } catch (error) {
    next(error);
  }
}

async function createDiscount(req, res, next) {
  try {
    if (!req.user) {
      return res.json({
        error: 1,
        message: "Anda Belum Login Atau Token Expired",
      });
    }
    let policy = policyFor(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: "Anda Tidak Memiliki Akses Untuk Menambahkan Discount",
      });
    }
    let payload = req.body;
    let postDiscount = new Discount(payload);
    await postDiscount.save();
    return res.json(postDiscount);
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

async function destroyDiscount(req, res, next) {
  try {
    if (!req.user) {
      return res.json({
        error: 1,
        message: "Anda Belum Login atau Token Expired",
      });
    }
    let policy = policyFor(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: "Anda Tidak Memiliki Akses Untuk Menghapus Discount",
      });
    }
    let deleteDiscount = await Discount.findOneAndDelete({
      _id: req.params.id,
    });
    return res.json(deleteDiscount);
  } catch (error) {
    next(error);
  }
}

module.exports = { index, createDiscount, destroyDiscount };
