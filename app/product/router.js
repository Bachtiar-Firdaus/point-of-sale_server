const router = require("express").Router();
const multer = require("multer");
const productController = require("./controller");

router.post("/products", multer().none(), productController.store);
module.exports = router;
