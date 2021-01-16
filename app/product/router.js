const router = require("express").Router();
const productController = require("./controller");

router.post("/products", productController.store);
module.exports = router;
