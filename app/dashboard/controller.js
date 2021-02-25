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
function cekingDay(checkDay) {
  let startValue;
  let endValue;
  let dateMondayValue;
  let dateTuesdayValue;
  let dateWednesdayValue;
  let dateThursdayValue;
  let dateFridayValue;
  let dateSaturdayValue;
  switch (checkDay) {
    case "Monday":
      startValue = 0;
      endValue = 6;
      dateMondayValue = 0;
      dateTuesdayValue = 1;
      dateWednesdayValue = 2;
      dateThursdayValue = 3;
      dateFridayValue = 4;
      dateSaturdayValue = 5;
      break;
    case "Tuesday":
      startValue = 1;
      endValue = 5;
      dateMondayValue = -1;
      dateTuesdayValue = 0;
      dateWednesdayValue = 1;
      dateThursdayValue = 2;
      dateFridayValue = 3;
      dateSaturdayValue = 4;
      break;
    case "Wednesday":
      startValue = 2;
      endValue = 4;
      dateMondayValue = -2;
      dateTuesdayValue = -1;
      dateWednesdayValue = 0;
      dateThursdayValue = 1;
      dateFridayValue = 2;
      dateSaturdayValue = 3;
      break;
    case "Thursday":
      startValue = 3;
      endValue = 3;
      dateMondayValue = -3;
      dateTuesdayValue = -2;
      dateWednesdayValue = -1;
      dateThursdayValue = 0;
      dateFridayValue = 1;
      dateSaturdayValue = 2;
      break;
    case "Friday":
      startValue = 4;
      endValue = 2;
      dateMondayValue = -4;
      dateTuesdayValue = -3;
      dateWednesdayValue = -2;
      dateThursdayValue = -1;
      dateFridayValue = 0;
      dateSaturdayValue = 1;
      break;
    case "Saturday":
      startValue = 5;
      endValue = 1;
      dateMondayValue = -5;
      dateTuesdayValue = -4;
      dateWednesdayValue = -3;
      dateThursdayValue = -2;
      dateFridayValue = -1;
      dateSaturdayValue = 0;
      break;
    case "Sunday":
      startValue = 6;
      endValue = 0;
      dateMondayValue = -6;
      dateTuesdayValue = -5;
      dateWednesdayValue = -4;
      dateThursdayValue = -3;
      dateFridayValue = -2;
      dateSaturdayValue = -1;
      break;
  }
  return {
    startValue,
    endValue,
    dateMondayValue,
    dateTuesdayValue,
    dateWednesdayValue,
    dateThursdayValue,
    dateFridayValue,
    dateSaturdayValue,
  };
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
    let valueDay = cekingDay(checkDay);

    let start = moment(valueDate)
      .subtract(`${valueDay.startValue}`, "days")
      .format("YYYY-MM-DD");
    let end = moment(valueDate)
      .add(`${valueDay.endValue}`, "days")
      .format("YYYY-MM-DD");
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
    let valueDay = cekingDay(checkDay);

    let start = moment(valueDate)
      .subtract(`${valueDay.startValue}`, "days")
      .format("YYYY-MM-DD");
    let end = moment(valueDate)
      .add(`${valueDay.endValue}`, "days")
      .format("YYYY-MM-DD");

    let dateMonday = moment(valueDate)
      .add(`${valueDay.dateMondayValue}`, "days")
      .format("YYYY-MM-DD");
    let dateTuesday = moment(valueDate)
      .add(`${valueDay.dateTuesdayValue}`, "days")
      .format("YYYY-MM-DD");
    let dateWednesday = moment(valueDate)
      .add(`${valueDay.dateWednesdayValue}`, "days")
      .format("YYYY-MM-DD");
    let dateThursday = moment(valueDate)
      .add(`${valueDay.dateThursdayValue}`, "days")
      .format("YYYY-MM-DD");
    let dateFriday = moment(valueDate)
      .add(`${valueDay.dateFridayValue}`, "days")
      .format("YYYY-MM-DD");
    let dateSaturday = moment(valueDate)
      .add(`${valueDay.dateSaturdayValue}`, "days")
      .format("YYYY-MM-DD");

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
            { day: "Monday", date: dateMonday, value: Monday },
            { day: "Tuesday", date: dateTuesday, value: Tuesday },
            { day: "Wednesday", date: dateWednesday, value: Wednesday },
            { day: "Thursday", date: dateThursday, value: Thursday },
            { day: "Friday", date: dateFriday, value: Friday },
            { day: "Saturday", date: dateSaturday, value: Saturday },
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
