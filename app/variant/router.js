const router = require("express").Router();
const multer = require("multer");
const { securityCek } = require("../middleware/security");
const { validateVariant } = require("../middleware/validator");
const variantController = require("./controller");

router.get("/variant", securityCek, variantController.index);
router.post(
  "/variant",
  securityCek,
  validateVariant,
  multer().none(),
  variantController.variant
);
router.put(
  "/variant/:id",
  securityCek,
  validateVariant,
  multer().none(),
  variantController.update
);
router.get("/variant/:id", securityCek, variantController.singleVariant);
router.delete("/variant/:id", securityCek, variantController.destroy);

module.exports = router;
