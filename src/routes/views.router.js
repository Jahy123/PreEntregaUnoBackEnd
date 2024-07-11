const express = require("express");
const router = express.Router();
const ViewsController = require("../controllers/viewController.js");
const viewsController = new ViewsController();
const UserController = require("../controllers/userController.js");
const userController = new UserController();
const checkUserRole = require("../middleware/checkrole.js");
const passport = require("passport");
const authMiddleware = require("../middleware/authmiddleware");

router.get(
  "/products",
  checkUserRole(["user", "premium", "admin"]),
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

router.get(
  "/chat",
  checkUserRole(["user", "admin"]),
  viewsController.renderChat
);
router.get("/", authMiddleware, viewsController.renderHome);
router.get("/mockingproducts", viewsController.renderMockingProducts);
router.get("/renderOwnerProducts/:email", viewsController.renderOwnerProducts);
router.get("/renderCart/:cid", viewsController.renderCart);
router.get(
  "/renderAllUsers",
  checkUserRole(["admin"]),
  viewsController.renderAllUsers
);

module.exports = router;
