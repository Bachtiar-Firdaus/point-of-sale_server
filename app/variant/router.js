const router = require("express").Router();
const multer = require("multer");
const variantController = require("./controller");

router.get("/variant", variantController.index);

module.exports = router;
