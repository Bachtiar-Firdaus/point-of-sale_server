const router = require("express").Router();
const multer = require("multer");
const { validateCart } = require("../middleware/validator");
const cartController = require("./controller");

router.get("/cart", cartController.index);
router.put("/cart", validateCart, multer().none(), cartController.cart);

module.exports = router;
