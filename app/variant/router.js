const router = require("express").Router();
const multer = require("multer");
const variantController = require("./controller");

router.get("/variant", variantController.index);
router.post("/variant", multer().none(), variantController.variant);

module.exports = router;
