const fs = require("fs");
const path = require("path");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../user/model");
const config = require("../config");
const { getToken } = require("../utilts/get-token");

const { policyFor } = require("../policy");

function me(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Your're not login or token expired`,
    });
  }
  return res.json(req.user);
}

//pembatasan hanya untuk admin
async function index(req, res, next) {
  try {
    if (!req.user) {
      return res.json({
        error: 1,
        message: `Kamu Belum Login atau token tidak berlaku lagi`,
      });
    }
    let policy = policyFor(req.user);
    console.log(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat produk`,
      });
    }
    let { limit = 10, skip = 0 } = req.query;
    let user = await User.find().limit(parseInt(limit)).skip(parseInt(skip));
    return res.json(user);
  } catch (error) {
    if (error && error.name === "ValidasiError") {
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
async function register(req, res, next) {
  try {
    if (!req.user) {
      return res.json({
        error: 1,
        message: `Kamu Belum Login atau token tidak berlaku lagi`,
      });
    }
    let policy = policyFor(req.user);
    console.log(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat produk`,
      });
    }
    const payload = req.body;
    let user = new User(payload);
    await user.save();
    return res.json(user);
  } catch (error) {
    if (error && error.message === "ValidationError") {
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
    if (!req.user) {
      return res.json({
        error: 1,
        message: `Kamu Belum Login atau token tidak berlaku lagi`,
      });
    }
    let policy = policyFor(req.user);
    console.log(req.user);
    if (!policy.can("manage", "all")) {
      return res.json({
        error: 1,
        message: `Anda tidak memiliki akses untuk melihat produk`,
      });
    }
    let user = await User.findOneAndDelete({ _id: req.params.id });
    return res.json(user);
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

module.exports = { index, me, register, destroy, localStrategy, login };
