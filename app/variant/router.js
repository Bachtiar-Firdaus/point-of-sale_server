const router = require("express").Router();
const multer = require("multer");
const variantController = require("./controller");

router.get("/variant", variantController.index);
router.post("/variant", multer().none(), variantController.variant);
router.put("/variant/:id", multer().none(), variantController.update);
router.get("/variant/:id", variantController.singleVariant);
router.delete("/variant/:id", variantController.destroy);

module.exports = router;
