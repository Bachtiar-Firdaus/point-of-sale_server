const { policyFor } = require("../policy");
const Order = require("./model");
const Cart = require("../cart/model");

async function index(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Melihat History Order",
      });
    }
    let { limit = 10, skip = 10, q = "" } = req.query;
    let criteria = {};
    if (q.length) {
      criteria = { ...criteria, date: { $regex: `${q}`, $options: "i" } };
    }
    let dataOrder = await Order.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    return res.json(dataOrder);
  } catch (error) {
    next(error);
  }
}

module.exports = { index };
