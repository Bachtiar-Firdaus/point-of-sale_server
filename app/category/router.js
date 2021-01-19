const router = require("express").Router();
const multer = require("multer");
const categoryController = require("./controller");

router.get("/categories", multer().none(), categoryController.index);

module.exports = router;
