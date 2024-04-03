const express = require("express");
const router = express.Router();
// const ProductModel = require("../services/models/product.model.js");

// const ProductManager = require("../services/db/product_manager_db.js");
// const productManager = new ProductManager();
const ProductController = require("../controllers/productController.js");
const productController = new ProductController();

router.get("/", async (req, res) => {
  try {
    await productController.getProducts(req, res);
  } catch (error) {
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.get("/:pid", async (req, res) => {
  await productController.getProductById(req, res);

  try {
  } catch (error) {
    console.error("Error al obtener product", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    await productController.addProduct(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
});
router.put("/:pid", async (req, res) => {
  try {
    await productController.updateProduct(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error del servidor", error: error.message });
  }
});

//5) Eliminar producto:

router.delete("/:pid", async (req, res) => {
  try {
    await productController.deleteProduct(req, res);
  } catch (error) {
    console.error("Error al eliminar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;
