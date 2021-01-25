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

module.exports = { index };
