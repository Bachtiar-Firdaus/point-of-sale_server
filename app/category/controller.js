const Category = require("./model");
const { policyFor } = require("../policy");

async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.json({
        error: 1,
        message: "Anda Belum Login Atau Token Expired",
      });
    }
    let { limit = 10, skip = 0 } = req.query;
    let category = await Category.find()
      .limit(parseInt(limit))
      .skip(parseInt(skip));
    return res.json(category);
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

module.exports = { index };
