const router = require("express").Router();
const multer = require("multer");
const { securityCek } = require("../middleware/security");
const { validateCategory } = require("../middleware/validator");
const categoryController = require("./controller");

router.get("/categories", securityCek, categoryController.index);
router.get("/categories/:id", securityCek, categoryController.singgleCategory);
router.post(
  "/categories",
  securityCek,
  validateCategory,
  multer().none(),
  categoryController.category
);
router.put(
  "/categories/:id",
  securityCek,
  validateCategory,
  multer().none(),
  categoryController.update
);
router.delete("/categories/:id", securityCek, categoryController.destroy);

module.exports = router;
