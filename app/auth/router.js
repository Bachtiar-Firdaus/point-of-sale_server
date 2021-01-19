const router = require("express").Router();
const multer = require("multer");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const authController = require("./controller");

passport.use(
  new localStrategy({ usernameField: "email" }, authController.localStrategy)
);

router.get("/user", authController.index);
router.get("/me", authController.me);
router.post("/register", multer().none(), authController.register);
router.delete("/delete/:id", authController.destroy);
router.post("/login", multer().none(), authController.login);
router.post("/logout", authController.logout);

module.exports = router;
