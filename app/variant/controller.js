const Variant = require("./model");
const { policyFor } = require("../policy");

async function index(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Melihat Variant",
      });
    }

    let { limit = 10, skip = 0, q = "" } = req.query;
    let criteria = {};
    if (q.length) {
      criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };
    }
    let variant = await Variant.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    return res.json(variant);
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

async function singleVariant(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Melihat Singgle Variant",
      });
    }

    let single = await Variant.findOne({ _id: req.params.id });
    return res.json(single);
  } catch (error) {
    next(error);
  }
}

async function variant(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Menambahkan Variant",
      });
    }
    let payload = req.body;
    let variant = new Variant(payload);
    await variant.save();
    return res.json(variant);
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

async function update(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Merubah Variant",
      });
    }
    let payload = req.body;
    let variant = await Variant.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      { new: true, runValidators: true }
    );
    return res.json(variant);
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

module.exports = { index, variant, update, singleVariant };
