const Category = require("./model");
const { policyFor } = require("../policy");

async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0, q = "" } = req.query;
    let criteria = {};
    if (q.length) {
      criteria = { ...criteria, name: { $regex: `${q}`, $options: "i" } };
    }
    let category = await Category.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    let count = await Category.countDocuments(criteria);
    return res.json({ message: "succes", data: category, count });
  } catch (error) {
    next(error);
  }
}

async function singgleCategory(req, res, next) {
  try {
    let id = req.params.id;
    let category = await Category.findOne({ _id: id });
    return res.json({ message: "succes", data: category });
  } catch (error) {
    next(error);
  }
}

async function category(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: "Anda Tidak Memiliki Akses untuk menambahkan Categoty",
      });
    }
    let payload = req.body;
    let category = new Category(payload);
    await category.save();
    return res.json({ message: "succes", data: category });
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
        message: "Anda Tidak Memiliki Akses untuk Merubah Kategory",
      });
    }
    let payload = req.body;
    let category = await Category.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      { new: true, runValidators: true }
    );
    return res.json({ message: "succes", data: category });
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
        message: "Anda Tidak Memiliki Akses Untuk Menghapus Category",
      });
    }
    let deleted = await Category.findOneAndDelete({ _id: req.params.id });
    return res.json({ message: "succes", data: deleted });
  } catch (error) {
    next(error);
  }
}

module.exports = { index, category, update, destroy, singgleCategory };
