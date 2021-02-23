const router = require("express").Router();
const multer = require("multer");
const dashboardController = require("./controller");

router.get("/dashboard/todays-income", dashboardController.todaysIncome);
router.get("/dashboard/monthly-income", dashboardController.monthlyIncome);
router.get("/dashboard/weekly-income", dashboardController.weeklyIncome);
router.get("/dashboard/user-active", dashboardController.userActive);
router.get("/dashboard/best-seller", dashboardController.bestSeller);
router.get(
  "/dashboard/sales-statistics-products",
  dashboardController.salesStatisticsProducts
);

module.exports = router;
