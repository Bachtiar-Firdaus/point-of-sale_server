const router = require("express").Router();
const multer = require("multer");
const passport = require("passport");
const { validateAuth } = require("../middleware/validator");
const { securityCek } = require("../middleware/security");
const localStrategy = require("passport-local").Strategy;

const authController = require("./controller");

passport.use(
  new localStrategy({ usernameField: "email" }, authController.localStrategy)
);

router.get("/user", securityCek, authController.index);
router.get("/me", securityCek, authController.me);
router.get("/user/:id", securityCek, authController.singgleUser);
router.put(
  "/user/:id",
  securityCek,
  validateAuth,
  multer().none(),
  authController.update
);
router.post(
  "/register",
  securityCek,
  validateAuth,
  multer().none(),
  authController.register
);
router.delete("/delete/:id", securityCek, authController.destroy);
router.post("/login", multer().none(), authController.login);
router.post("/logout", securityCek, authController.logout);

module.exports = router;
