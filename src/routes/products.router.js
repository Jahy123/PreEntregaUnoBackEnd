const express = require("express");
const router = express.Router();
const ProductModel = require("../dao/models/product.model.js");

const ProductManager = require("../dao/db/product_manager_db.js");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort || null;
    const query = req.query.query || null;
    const category = req.query.category || null;
    const status = req.query.status || null;
    const products = await productManager.getProducts(
      limit,
      page,
      sort,
      query,
      category,
      status
    );

    res.json(products);
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.get("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const product = await productManager.getProductById(id);
    if (!product) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener product", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

router.post("/", async (req, res) => {
  const newProduct = req.body;
  const { title, description, price, code, stock, category } = newProduct;

  try {
    if (!title || !description || !price || !code || !stock || !category) {
      res.json({
        message: "Todos los campos son obligatorios",
      });
    }
    const product = await ProductModel.findOne({ code: code });
    if (product) {
      res.json({
        message: "El valor de code ya existe",
      });
    } else {
      await productManager.addProduct(newProduct);
      res.status(201).json({
        message: "Producto agregado exitosamente",
      });
    }
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const product = req.body;

  try {
    const updatedProduct = await productManager.updateProduct(id, product);

    if (!updatedProduct) {
      res
        .status(404)
        .send({ message: "El producto que desea actualizar no existe" });
    } else {
      res.json({
        message: "Producto actualizado exitosamente",
      });
    }
  } catch (error) {
    console.error("Error al actualizar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

//5) Eliminar producto:

router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    const product = await productManager.deleteProduct(id);
    if (!product) {
      res
        .status(404)
        .send({ message: "El producto que desea eliminar no existe" });
    } else {
      res.json({
        message: "Producto eliminado exitosamente",
      });
    }
  } catch (error) {
    console.error("Error al eliminar producto", error);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;
