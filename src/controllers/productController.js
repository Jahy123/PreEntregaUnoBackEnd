const express = require("express");
const router = express.Router();
// const CartManager = require("../services/db/cart_manager_db.js");
const ProductManager = require("../services/db/product_manager_db.js");
const productManager = new ProductManager();
// const manager = new CartManager();
const CartModel = require("../services/models/cart.model.js");
const ProductModel = require("../services/models/product.model.js");

class ProductController {
  async getProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort || null;
      const category = req.query.category || null;
      const availability =
        req.query.availability !== undefined
          ? req.query.availability === "true"
          : undefined;

      const products = await productManager.getProducts(
        limit,
        page,
        sort,
        category,
        availability
      );
      console.log(products);
      res.json(products);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
  async getProductById(req, res) {
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
      res.status(500).json({ error: "Error del servidor" });
    }
  }
  async addProduct(req, res) {
    const newProduct = req.body;
    const { title, description, price, code, stock, category } = newProduct;

    try {
      if (!title || !description || !price || !code || !stock || !category) {
        return res.json({
          message: "Todos los campos son obligatorios",
        });
      }

      const product = await ProductModel.findOne({ code: code });
      if (product) {
        return res.json({
          message: "El valor de code ya existe",
        });
      }
      await productManager.addProduct(newProduct);
      return res.status(201).json({
        message: "Producto agregado exitosamente",
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }

  async updateProduct(req, res) {
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
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
  async deleteProduct(req, res) {
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
      res.status(500).json({ error: "Error del servidor" });
    }
  }
}

module.exports = ProductController;
