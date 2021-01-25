const router = require("express").Router();
const multer = require("multer");
const discountController = require("./controller");

router.get("/discount", discountController.index);
router.get("/discount/:id", discountController.singgleDiscount);
router.post("/discount", multer().none(), discountController.createDiscount);
router.put("/discount/:id", multer().none(), discountController.updateDiscount);
router.delete("/discount/:id", discountController.destroyDiscount);

module.exports = router;
