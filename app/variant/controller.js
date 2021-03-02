const Variant = require("./model");
const { policyFor } = require("../policy");

async function index(req, res, next) {
  try {
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

    let count = await Variant.countDocuments(criteria);

    return res.json({ message: "succes", data: variant, count });
  } catch (error) {
    next(error);
  }
}

async function singleVariant(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: "Anda Tidak Memiliki Akses Untuk Melihat Singgle Variant",
      });
    }

    let single = await Variant.findOne({ _id: req.params.id });

    return res.json({ message: "succes", data: single });
  } catch (error) {
    next(error);
  }
}

async function variant(req, res, next) {
  try {
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

    return res.json({ message: "succes", data: variant });
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
    return res.json({ message: "succes", data: variant });
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

async function destroy(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: "Anda Tidak Memiliki Akses Untuk Menghapus Variant",
      });
    }
    let deleted = await Variant.findOneAndDelete({ _id: req.params.id });
    return res.json({ message: "succes", data: deleted });
  } catch (error) {
    next(error);
  }
}

module.exports = { index, variant, update, singleVariant, destroy };
