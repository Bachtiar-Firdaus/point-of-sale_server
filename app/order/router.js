const router = require("express").Router();
const multer = require("multer");
const { validateOrder } = require("../middleware/validator");
const orderController = require("./controller");

router.get("/history", orderController.index);
router.post(
  "/order",
  validateOrder,
  multer().none(),
  orderController.creatOrder
);

module.exports = router;
