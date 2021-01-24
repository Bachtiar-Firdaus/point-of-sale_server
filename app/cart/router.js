const router = require("express").Router();
const multer = require("multer");
const cartController = require("./controller");

router.get("/cart", cartController.index);

module.exports = router;
