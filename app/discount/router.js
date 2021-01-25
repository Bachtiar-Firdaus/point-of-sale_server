const router = require("express").Router();
const multer = require("multer");
const discountController = require("./controller");

router.get("/discount", discountController.index);

module.exports = router;
