const fs = require("fs");
const path = require("path");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../user/model");
const config = require("../config");
const { getToken } = require("../utilts/get-token");

function me(req, res, next) {
  if (!req.user) {
    return res.json({
      error: 1,
      message: `Your're not login or token expired`,
    });
  }
  return res.json(req.user);
}

async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0 } = req.query;
    let user = await User.find().limit(parseInt(limit)).skip(parseInt(skip));
    return res.json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = { index, me };
