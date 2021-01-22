const router = require("express").Router();
const multer = require("multer");
const categoryController = require("./controller");

router.get("/categories", categoryController.index);
router.get("/categories/:id", categoryController.singgleCategory);
router.post("/categories", multer().none(), categoryController.category);
router.put("/categories/:id", multer().none(), categoryController.update);
router.delete("/categories/:id", categoryController.destroy);

module.exports = router;
