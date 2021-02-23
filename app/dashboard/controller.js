const { policyFor } = require("../policy");
const History = require("../order/model");
const User = require("../user/model");
const Product = require("../product/model");
const moment = require("moment");
const { check } = require("express-validator");
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
function weeklyIncome(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Melihat weeklyIncome",
      });
    }
    let { date = "" } = req.query;
    let valueDate = "";
    valueDate = date;
    if (!date.length) {
      valueDate = moment().format("YYYY-MM-DD");
    }
    let checkDay = moment(valueDate).format("dddd");
    let stringDay = valueDate.toString();
    let valueDay = stringDay.substr(8, 2);
    let indicatorDay = stringDay.substr(0, 8);
    valueDay = parseInt(valueDay);
    let start = "";
    let end = "";

    if (checkDay === "Monday") {
      start = valueDate;
      end = `${indicatorDay}${valueDay + 6}`;
    } else if (checkDay === "Tuesday") {
      start = `${indicatorDay}${valueDay - 1}`;
      end = `${indicatorDay}${valueDay + 5}`;
    } else if (checkDay === "Wednesday") {
      start = `${indicatorDay}${valueDay - 2}`;
      end = `${indicatorDay}${valueDay + 4}`;
    } else if (checkDay === "Thursday") {
      start = `${indicatorDay}${valueDay - 3}`;
      end = `${indicatorDay}${valueDay + 3}`;
    } else if (checkDay === "Friday") {
      start = `${indicatorDay}${valueDay - 4}`;
      end = `${indicatorDay}${valueDay + 2}`;
    } else if (checkDay === "Saturday") {
      start = `${indicatorDay}${valueDay - 5}`;
      end = `${indicatorDay}${valueDay + 1}`;
    } else if (checkDay === "Sunday") {
      start = `${indicatorDay}${valueDay - 6}`;
      end = `${indicatorDay}${valueDay}`;
    }
    let weeklyIncome = 0;
    History.find({ date: { $gte: `${start}`, $lt: `${end}` } }).then(
      (check_date) => {
        check_date.map((dataAmount) => {
          weeklyIncome = weeklyIncome + dataAmount.amount;
        });
        return res.json({
          message: "succes",
          data: {
            Start_Date: start,
            End_Date: end,
            sigmaWeeklyIncome: weeklyIncome,
          },
        });
      }
    );
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
async function userActive(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Melihat userActive",
      });
    }
    let bucketUser = [];
    let userActive = await User.find();
    userActive.map((value_user) => {
      if (value_user.token.length !== 0) {
        userActive = value_user.full_name;
      }
      bucketUser.push({ name: `${userActive}`, status: "Active" });
    });
    console.log();
    return res.json({
      message: "succes",
      data: bucketUser,
    });
  } catch (error) {
    next(error);
  }
}
async function bestSeller(req, res, next) {
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
        message: "Anda Tidak Memiliki Akses Untuk Melihat BestSeller",
      });
    }
    let product = await Product.find()
      .sort({ goods_sold: "-1" })
      .limit(3)
      .populate("category")
      .populate("variant")
      .populate("discount");

    // console.log(product);
    return res.json({
      message: "succes",
      data: product,
    });
  } catch (error) {
    next(error);
  }
}
function salesStatistics(req, res, next) {
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
        message:
          "Anda Tidak Memiliki Akses Untuk Melihat Sales Statistics Products",
      });
    }
    let { date = "", product = "", category = "" } = req.query;
    let valueDate = "";
    valueDate = date;
    if (!date.length) {
      valueDate = moment().format("YYYY-MM-DD");
    }
    let checkDay = moment(valueDate).format("dddd");
    let stringDay = valueDate.toString();
    let valueDay = stringDay.substr(8, 2);
    let indicatorDay = stringDay.substr(0, 8);
    valueDay = parseInt(valueDay);
    let start = "";
    let end = "";
    let dateMonday = "";
    let dateTuesday = "";
    let dateWednesday = "";
    let dateThursday = "";
    let dateFriday = "";
    let dateSaturday = "";

    if (checkDay === "Monday") {
      start = valueDate;
      end = `${indicatorDay}${valueDay + 6}`;

      dateMonday = `${indicatorDay}${valueDay}`;
      dateTuesday = `${indicatorDay}${valueDay + 1}`;
      dateWednesday = `${indicatorDay}${valueDay + 2}`;
      dateThursday = `${indicatorDay}${valueDay + 3}`;
      dateFriday = `${indicatorDay}${valueDay + 4}`;
      dateSaturday = `${indicatorDay}${valueDay + 5}`;
    } else if (checkDay === "Tuesday") {
      start = `${indicatorDay}${valueDay - 1}`;
      end = `${indicatorDay}${valueDay + 5}`;

      dateMonday = `${indicatorDay}${valueDay - 1}`;
      dateTuesday = `${indicatorDay}${valueDay}`;
      dateWednesday = `${indicatorDay}${valueDay + 1}`;
      dateThursday = `${indicatorDay}${valueDay + 2}`;
      dateFriday = `${indicatorDay}${valueDay + 3}`;
      dateSaturday = `${indicatorDay}${valueDay + 4}`;
    } else if (checkDay === "Wednesday") {
      start = `${indicatorDay}${valueDay - 2}`;
      end = `${indicatorDay}${valueDay + 4}`;

      dateMonday = `${indicatorDay}${valueDay - 2}`;
      dateTuesday = `${indicatorDay}${valueDay - 1}`;
      dateWednesday = `${indicatorDay}${valueDay}`;
      dateThursday = `${indicatorDay}${valueDay + 1}`;
      dateFriday = `${indicatorDay}${valueDay + 2}`;
      dateSaturday = `${indicatorDay}${valueDay + 3}`;
    } else if (checkDay === "Thursday") {
      start = `${indicatorDay}${valueDay - 3}`;
      end = `${indicatorDay}${valueDay + 3}`;

      dateMonday = `${indicatorDay}${valueDay - 3}`;
      dateTuesday = `${indicatorDay}${valueDay - 2}`;
      dateWednesday = `${indicatorDay}${valueDay - 1}`;
      dateThursday = `${indicatorDay}${valueDay}`;
      dateFriday = `${indicatorDay}${valueDay + 1}`;
      dateSaturday = `${indicatorDay}${valueDay + 2}`;
    } else if (checkDay === "Friday") {
      start = `${indicatorDay}${valueDay - 4}`;
      end = `${indicatorDay}${valueDay + 2}`;

      dateMonday = `${indicatorDay}${valueDay - 4}`;
      dateTuesday = `${indicatorDay}${valueDay - 3}`;
      dateWednesday = `${indicatorDay}${valueDay - 2}`;
      dateThursday = `${indicatorDay}${valueDay - 1}`;
      dateFriday = `${indicatorDay}${valueDay}`;
      dateSaturday = `${indicatorDay}${valueDay + 1}`;
    } else if (checkDay === "Saturday") {
      start = `${indicatorDay}${valueDay - 5}`;
      end = `${indicatorDay}${valueDay + 1}`;

      dateMonday = `${indicatorDay}${valueDay - 5}`;
      dateTuesday = `${indicatorDay}${valueDay - 4}`;
      dateWednesday = `${indicatorDay}${valueDay - 3}`;
      dateThursday = `${indicatorDay}${valueDay - 2}`;
      dateFriday = `${indicatorDay}${valueDay - 1}`;
      dateSaturday = `${indicatorDay}${valueDay}`;
    } else if (checkDay === "Sunday") {
      start = `${indicatorDay}${valueDay - 6}`;
      end = `${indicatorDay}${valueDay}`;

      dateMonday = `${indicatorDay}${valueDay - 6}`;
      dateTuesday = `${indicatorDay}${valueDay - 5}`;
      dateWednesday = `${indicatorDay}${valueDay - 4}`;
      dateThursday = `${indicatorDay}${valueDay - 3}`;
      dateFriday = `${indicatorDay}${valueDay - 2}`;
      dateSaturday = `${indicatorDay}${valueDay - 1}`;
    }
    let Monday = 0;
    let Tuesday = 0;
    let Wednesday = 0;
    let Thursday = 0;
    let Friday = 0;
    let Saturday = 0;
    let indicatorData = "";
    let valueIndicatorData = "";

    let bultStatistics = [];
    History.find({ date: { $gte: `${start}`, $lt: `${end}` } }).then(
      (check_date) => {
        check_date.map((dataStatistics) => {
          dataStatistics.orders.map((built) => {
            bultStatistics.push({
              date: dataStatistics.date,
              product: built.Product,
              category: built.Category_Name,
              sigma: built.Sub_Total_Belanja,
            });
          });
        });
        bultStatistics.map((rebuilt) => {
          if (product.length) {
            indicatorData = "product";
            valueIndicatorData = product;
            if (rebuilt.date === dateMonday && rebuilt.product === product) {
              Monday = Monday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateTuesday &&
              rebuilt.product === product
            ) {
              Tuesday = Tuesday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateWednesday &&
              rebuilt.product === product
            ) {
              Wednesday = Wednesday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateThursday &&
              rebuilt.product === product
            ) {
              Thursday = Thursday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateFriday &&
              rebuilt.product === product
            ) {
              Friday = Friday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateSaturday &&
              rebuilt.product === product
            ) {
              Saturday = Saturday + rebuilt.sigma;
            }
          } else if (category.length) {
            indicatorData = "category";
            valueIndicatorData = category;
            if (rebuilt.date === dateMonday && rebuilt.category === category) {
              Monday = Monday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateTuesday &&
              rebuilt.category === category
            ) {
              Tuesday = Tuesday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateWednesday &&
              rebuilt.category === category
            ) {
              Wednesday = Wednesday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateThursday &&
              rebuilt.category === category
            ) {
              Thursday = Thursday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateFriday &&
              rebuilt.category === category
            ) {
              Friday = Friday + rebuilt.sigma;
            } else if (
              rebuilt.date === dateSaturday &&
              rebuilt.category === category
            ) {
              Saturday = Saturday + rebuilt.sigma;
            }
          }
        });
        return res.json({
          message: "succes",
          statistics: indicatorData,
          indicator: valueIndicatorData,
          data: [
            { day: "Monday", value: Monday },
            { day: "Tuesday", value: Tuesday },
            { day: "Wednesday", value: Wednesday },
            { day: "Thursday", value: Thursday },
            { day: "Friday", value: Friday },
            { day: "Saturday", value: Saturday },
          ],
        });
      }
    );
  } catch (error) {
    next(error);
  }
}
module.exports = {
  todaysIncome,
  monthlyIncome,
  weeklyIncome,
  userActive,
  bestSeller,
  salesStatistics,
};
