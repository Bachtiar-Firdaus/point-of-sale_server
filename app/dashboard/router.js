const router = require("express").Router();
const multer = require("multer");
const dashboardController = require("./controller");

router.get("/dashboard/todays-income", dashboardController.todaysIncome);
router.get("/dashboard/monthly-income", dashboardController.monthlyIncome);

module.exports = router;
