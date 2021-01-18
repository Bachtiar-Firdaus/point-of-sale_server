const router = require("express").Router();
const authController = require("./controller");

router.get("/user", authController.index);

module.exports = router;
