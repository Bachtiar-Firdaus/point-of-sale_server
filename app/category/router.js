const router = require("express").Router();
const multer = require("multer");
const { validateCategory } = require("../middleware/validator");
const categoryController = require("./controller");

router.get("/categories", categoryController.index);
router.get("/categories/:id", categoryController.singgleCategory);
router.post(
  "/categories",
  validateCategory,
  multer().none(),
  categoryController.category
);
router.put(
  "/categories/:id",
  validateCategory,
  multer().none(),
  categoryController.update
);
router.delete("/categories/:id", categoryController.destroy);

module.exports = router;
