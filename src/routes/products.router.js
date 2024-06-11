const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController.js");
const productController = new ProductController();
const authenticateToken = require("../middleware/authmiddleware");
const checkUserRole = require("../middleware/checkrole");

router.get("/", productController.getProducts);
router.get("/:pid", productController.getProductById);
router.post(
  "/",
  authenticateToken,
  checkUserRole(["admin", "premium"]),
  productController.addProduct
);
router.put("/:pid", productController.updateProduct);
router.delete("/:pid", productController.deleteProduct);

module.exports = router;
