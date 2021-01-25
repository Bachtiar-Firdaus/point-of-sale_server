const router = require("express").Router();
const multer = require("multer");
const discountController = require("./controller");

router.get("/discount", discountController.index);
router.post("/discount", multer().none(), discountController.createDiscount);
router.delete("/discount/:id", discountController.destroyDiscount);

module.exports = router;
