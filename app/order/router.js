const router = require("express").Router();
const multer = require("multer");
const { securityCek } = require("../middleware/security");
const { validateOrder } = require("../middleware/validator");
const orderController = require("./controller");

router.get("/history", securityCek, orderController.index);
router.post(
  "/order",
  securityCek,
  validateOrder,
  multer().none(),
  orderController.creatOrder
);

module.exports = router;
