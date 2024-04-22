const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/viewController.js");
const viewsController = new ViewsController();
const UserController = require("../controllers/userController.js");
const userController = new UserController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/products",
  checkUserRole(["user"]),
  passport.authenticate("jwt", { session: false }),
  viewsController.renderProducts
);

router.get("/carts/:cid", viewsController.renderCart);
router.get("/login", authMiddleware, viewsController.renderLogin);
router.get("/register", authMiddleware, viewsController.renderRegister);
router.get(
  "/realtimeproducts",
  checkUserRole(["admin"]),
  viewsController.renderRealTimeProducts
);
router.get("/chat", checkUserRole(["user"]), viewsController.renderChat);
router.get("/", authMiddleware, viewsController.renderHome);

module.exports = router;
