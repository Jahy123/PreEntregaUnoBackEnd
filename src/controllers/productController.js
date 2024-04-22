const ProductManager = require("../services/db/product_manager_db.js");
const productManager = new ProductManager();
const ProductModel = require("../services/models/product.model.js");

class ProductController {
  async getProducts(req, res) {
    try {
      let { limit = 10, page = 1, sort, query } = req.query;

      const products = await productManager.getProducts(
        limit,
        page,
        sort,
        query
      );

      res.json(products);
    } catch (error) {
      res.status(500).send("Error");
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
        return res
          .status(400)
          .json({ message: "Todos los campos son obligatorios" });
      }

      const product = await ProductModel.findOne({ code: code });
      if (product) {
        return res.status(400).json({ message: "El valor de code ya existe" });
      }
      await productManager.addProduct(newProduct);
      return res.status(200).json({
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
        return res
          .status(200)
          .json({ message: "Producto actualizado exitosamente" });
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
        return res
          .status(200)
          .json({ message: "Producto eliminado exitosamente" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }
}

module.exports = ProductController;
