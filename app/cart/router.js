const router = require("express").Router();
const multer = require("multer");
const { securityCek } = require("../middleware/security");
const { validateCart } = require("../middleware/validator");
const cartController = require("./controller");

router.get("/cart", securityCek, cartController.index);
router.put(
  "/cart",
  securityCek,
  validateCart,
  multer().none(),
  cartController.cart
);

module.exports = router;
