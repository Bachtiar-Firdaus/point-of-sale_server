const router = require("express").Router();
const multer = require("multer");
const orderController = require("./controller");

router.get("/order", orderController.index);

module.exports = router;
