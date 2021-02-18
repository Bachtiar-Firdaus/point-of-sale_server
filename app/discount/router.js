const router = require("express").Router();
const multer = require("multer");
const {
  validateDiscount,
  validateProductToDiscount,
} = require("../middleware/validator");
const discountController = require("./controller");

router.get("/discount", discountController.index);
router.get("/discount/:id", discountController.singgleDiscount);
router.post(
  "/discount",
  validateDiscount,
  multer().none(),
  discountController.createDiscount
);
router.post(
  "/discount/push-product/:id",
  validateProductToDiscount,
  multer().none(),
  discountController.addProductToDiscount
);
router.put(
  "/discount/:id",
  validateDiscount,
  multer().none(),
  discountController.updateDiscount
);
router.delete("/discount/:id", discountController.destroyDiscount);

module.exports = router;
