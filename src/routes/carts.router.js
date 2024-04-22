const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController.js");
const cartController = new CartController();

router.use(express.json());
router.post("/", cartController.addCart);
router.get("/:cid", cartController.getCartById);
router.post("/:cid/product/:pid", cartController.addProductToCart);
router.delete("/:cid/products/:pid", cartController.deleteProductsFromCart);
router.put("/:cid", cartController.updateProductsFromCart);
router.put("/:cid/products/:pid", cartController.updateQuantity);
router.delete("/:cid", cartController.deleteAllProducts);
router.post("/:cid/purchase", cartController.finalizePurchase);

module.exports = router;
