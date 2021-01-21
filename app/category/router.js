const router = require("express").Router();
const multer = require("multer");
const categoryController = require("./controller");

router.get("/categories", categoryController.index);
router.post("/categories", multer().none(), categoryController.category);
router.put("/categories/:id", multer().none(), categoryController.update);
module.exports = router;
