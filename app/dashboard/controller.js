const { policyFor } = require("../policy");
const History = require("../order/model");
const moment = require("moment");
function todaysIncome(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Melihat todaysIncome",
      });
    }
    let { date = "" } = req.query;
    let valueDate = "";
    valueDate = date;
    if (!date.length) {
      valueDate = moment().format("YYYY-MM-DD");
    }
    let todaysIncome = 0;
    History.find({ date: valueDate }).then((check_date) => {
      check_date.map((dataAmount) => {
        todaysIncome = todaysIncome + dataAmount.amount;
      });
      return res.json({
        message: "succes",
        data: { date: valueDate, sigmaTodaysIncome: todaysIncome },
      });
    });
  } catch (error) {
    next(error);
  }
}

function monthlyIncome(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Melihat monthlyIncome",
      });
    }
    let { date = "" } = req.query;
    let valueDate = "";
    valueDate = date;
    if (!date.length) {
      valueDate = moment().format("YYYY-MM-DD");
    }
    let data = valueDate.toString();
    valueDate = data.substr(4, 4);
    let valueResMoon = data.substr(5, 2);
    let monthlyIncome = 0;
    History.find({ date: { $regex: `${valueDate}` } }).then((check_date) => {
      check_date.map((dataAmount) => {
        monthlyIncome = monthlyIncome + dataAmount.amount;
      });
      return res.json({
        message: "succes",
        data: { Moon: valueResMoon, sigmaMonthlyIncome: monthlyIncome },
      });
    });
  } catch (error) {
    next(error);
  }
}
module.exports = { todaysIncome, monthlyIncome };
