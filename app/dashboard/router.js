const router = require("express").Router();
const { securityCek } = require("../middleware/security");
const dashboardController = require("./controller");

router.get("/dashboard", securityCek, dashboardController.dashboard);

router.get(
  "/dashboard/sales-statistics",
  securityCek,
  dashboardController.salesStatistics
);

module.exports = router;
