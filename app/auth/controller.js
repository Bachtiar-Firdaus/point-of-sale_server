const fs = require("fs");
const path = require("path");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../user/model");
const config = require("../config");
const { getToken } = require("../utilts/get-token");

const { policyFor } = require("../policy");

const HASH_ROUND = 10;

function me(req, res, next) {
  return res.json({ message: "succes", data: req.user });
}

//pembatasan hanya untuk admin
async function index(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat user`,
      });
    }
    let { limit = 10, skip = 0, q = "" } = req.query;
    let criteria = {};
    if (q.length) {
      criteria = { ...criteria, full_name: { $regex: `${q}`, $options: "i" } };
    }
    let user = await User.find(criteria)
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    let count = await User.countDocuments(criteria);
    return res.json({ message: "succes", data: user, count });
  } catch (error) {
    next(error);
  }
}
//pembatasan hanya untuk admin
async function singgleUser(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat user`,
      });
    }
    let id = req.params.id;
    let user = await User.findOne({ _id: id });
    return res.json({ message: "succes", data: user });
  } catch (error) {
    next(error);
  }
}

//pembatasan hanya untuk admin
async function register(req, res, next) {
  try {
    let policy = policyFor(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat user`,
      });
    }
    const payload = req.body;
    let cekEmail = await User.find({ email: payload.email });
    if (!cekEmail.length) {
      let user = new User(payload);
      await user.save();
      return res.json({ message: "succes", data: user });
    } else if (cekEmail.length) {
      return res.json({ error: 1, message: "failed email telah terdaftar" });
    }
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
        message: "Anda Tidak Memiliki Akses untuk Merubah User",
      });
    }
    let payload = req.body;
    if (payload.password.length === 0) {
      return res.json({
        error: 1,
        message: "Password Wajib Di Isi",
      });
    }
    let password = bcrypt.hashSync(payload.password, HASH_ROUND);
    let finalPayload = { ...payload, password };
    let user = await User.findOneAndUpdate(
      { _id: req.params.id },
      finalPayload,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.json({ message: "succes", data: user });
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

//pembatasan hanya untuk admin
async function destroy(req, res, next) {
  try {
    let policy = policyFor(req.user);
    console.log(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat user`,
      });
    }
    let user = await User.findOneAndDelete({ _id: req.params.id });

    return res.json({ message: "succes", data: user });
  } catch (error) {
    next(error);
  }
}

async function localStrategy(email, password, done) {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -cart_items -token"
    );
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ password, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (error) {
    done(error, null);
  }
  done();
}

async function login(req, res, next) {
  passport.authenticate("local", async function (error, user) {
    if (error) return next(error);
    if (!user)
      return res.json({ error: 1, message: "email or password incorect" });
    let signed = jwt.sign(user, config.secretKey);
    await User.findByIdAndUpdate(
      { _id: user._id },
      { $push: { token: signed } },
      { new: true }
    );
    return res.json({
      message: "logged in successfully",
      user: user,
      token: signed,
    });
  })(req, res, next);
}

async function logout(req, res, next) {
  let token = getToken(req);
  let user = await User.findOneAndUpdate(
    { token: { $in: [token] } },
    { $pull: { token } },
    { useFindAndModify: false }
  );

  if (!user || !token) {
    return res.json({
      error: 1,
      message: "Tidak Ditemukan User",
    });
  }
  return res.json({
    error: 0,
    message: "Logout Berhasil",
  });
}

module.exports = {
  index,
  me,
  register,
  destroy,
  localStrategy,
  login,
  logout,
  singgleUser,
  update,
};
