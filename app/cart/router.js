const router = require("express").Router();
const multer = require("multer");
const cartController = require("./controller");

router.get("/cart", cartController.index);
router.put("/cart", multer().none(), cartController.cart);

module.exports = router;
