const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/mockingProductsController.js");
const productController = new ProductController();

router.get("/", productController.createProduct);
// router.get("/:pid", productController.getProductById);
// router.post("/", productController.createProduct);
// router.put("/:pid", productController.updateProduct);
// router.delete("/:pid", productController.deleteProduct);

module.exports = router;
