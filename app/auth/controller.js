const fs = require("fs");
const path = require("path");

const User = require("../user/model");
const config = require("../config");

async function index(req, res, next) {
  try {
    let { limit = 10, skip = 0 } = req.query;
    let user = await User.find().limit(parseInt(limit)).skip(parseInt(skip));
    return res.json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = { index };
