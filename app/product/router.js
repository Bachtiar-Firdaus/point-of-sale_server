const router = require("express").Router();
const multer = require("multer");
const os = require("os");
const { securityCek } = require("../middleware/security");
const productController = require("./controller");

router.post(
  "/products",
  securityCek,
  multer({ dest: os.tmpdir() }).single("image"),
  productController.store
);

router.get("/products", securityCek, productController.index);
router.get("/products/best-seller", securityCek, productController.bestSeller);
router.get("/products/:id", securityCek, productController.singgleProduct);

router.put(
  "/products/:id",
  securityCek,
  multer({ dest: os.tmpdir() }).single("image"),
  productController.update
);

router.delete("/products/:id", securityCek, productController.destroy);
module.exports = router;
