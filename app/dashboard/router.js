const router = require("express").Router();
const multer = require("multer");
const dashboardController = require("./controller");

router.get("/dashboard", dashboardController.dashboard);

router.get("/dashboard/sales-statistics", dashboardController.salesStatistics);

module.exports = router;
