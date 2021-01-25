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

async function singgleDiscount(req, res, json) {
  try {
    if (!req.user) {
      return res.json({
        error: 1,
        message: "Anda Belum Login Atau Token Expired",
      });
    }
    let findDiscount = await Discount.findOne({ _id: req.params.id });
    return res.json(findDiscount);
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

async function addProductToDiscount(req, res, next) {
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
        message:
          "Anda Tidak Memiliki Akases untuk Menambahkan Product Yang Discount",
      });
    }
    let payload = req.body;
    console.log(payload);
    //hapus product yang sama didalam discount
    Discount.find({}).then(async (check_discounts) => {
      payload.product.forEach((dataPayload) => {
        check_discounts.forEach((check_discount) => {
          check_discount.product.forEach(async (dataCollcetion) => {
            if (
              JSON.stringify(dataPayload) === JSON.stringify(dataCollcetion)
            ) {
              check_discount.product.pull(dataCollcetion);
              await Discount.findOneAndUpdate(
                { _id: check_discount._id },
                { product: check_discount.product },
                {
                  new: true,
                  runValidators: true,
                }
              );
            }
          });
        });
      });
    });

    let discount = await Discount.findOne({ _id: req.params.id });
    //menambahkan product lebih dari 1
    if (payload.product.length) {
      payload.product = await Product.find({ _id: { $in: payload.product } });
      await Product.bulkWrite(
        payload.product.map((item) => {
          return {
            updateOne: {
              filter: { _id: item._id },
              update: { discount: discount._id },
              upsert: true,
            },
          };
        })
      );
    } else {
      //Jika Productnya tidak ada
      discount.product.forEach(async (product) => {
        const item = await Product.findOne({ _id: product });
        item.discount = undefined;
        await item.save();
      });
    }
    //menambahkan jika hanya 1 product
    discount = await Discount.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json(discount);
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

async function updateDiscount(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Merubah Discount",
      });
    }

    let payload = req.body;
    let updatedDiscont = await Discount.findOneAndUpdate(
      { _id: req.params.id },
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.json(updatedDiscont);
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

module.exports = {
  index,
  createDiscount,
  destroyDiscount,
  singgleDiscount,
  updateDiscount,
  addProductToDiscount,
};
