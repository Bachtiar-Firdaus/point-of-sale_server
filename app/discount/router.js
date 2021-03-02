const router = require("express").Router();
const multer = require("multer");
const { securityCek } = require("../middleware/security");
const {
  validateDiscount,
  validateProductToDiscount,
} = require("../middleware/validator");
const discountController = require("./controller");

router.get("/discount", securityCek, discountController.index);
router.get("/discount/:id", securityCek, discountController.singgleDiscount);
router.post(
  "/discount",
  securityCek,
  validateDiscount,
  multer().none(),
  discountController.createDiscount
);
router.post(
  "/discount/push-product/:id",
  securityCek,
  validateProductToDiscount,
  multer().none(),
  discountController.addProductToDiscount
);
router.put(
  "/discount/:id",
  securityCek,
  validateDiscount,
  multer().none(),
  discountController.updateDiscount
);
router.delete("/discount/:id", securityCek, discountController.destroyDiscount);

module.exports = router;
