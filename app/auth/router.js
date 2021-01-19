const router = require("express").Router();
const multer = require("multer");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const authController = require("./controller");

router.get("/user", authController.index);
router.get("/me", authController.me);
router.post("/register", multer().none(), authController.register);
router.delete("/delete/:id", authController.destroy);

module.exports = router;
