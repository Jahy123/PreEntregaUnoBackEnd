const express = require("express");
const router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/userController.js");

const userController = new UserController();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  userController.profile
);
router.post("/logout", userController.logout.bind(userController));
router.get(
  "/admin",
  passport.authenticate("jwt", { session: false }),
  userController.admin
);
router.get("/requestResetPassword", userController.requestResetPassword);
router.post("/sendResetPasswordEmail", userController.sendResetPasswordEmail);
router.get("/resetPassword", userController.resetPassword);
router.post("/changePassword", userController.changePassword);

module.exports = router;
