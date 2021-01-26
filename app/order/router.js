const router = require("express").Router();
const multer = require("multer");
const orderController = require("./controller");

router.get("/order", orderController.index);
router.post("/order", multer().none(), orderController.creatOrder);

module.exports = router;
