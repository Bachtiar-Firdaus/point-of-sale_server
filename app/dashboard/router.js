const router = require("express").Router();
const multer = require("multer");
const dashboardController = require("./controller");

router.get("/dashboard/todays-income", dashboardController.todaysIncome);

module.exports = router;
