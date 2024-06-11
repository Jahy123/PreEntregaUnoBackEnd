const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/mockingProductsController.js");
const productController = new ProductController();

router.get("/", productController.createProduct);

module.exports = router;
