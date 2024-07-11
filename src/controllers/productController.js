const ProductManager = require("../services/db/productService.js");
const productManager = new ProductManager();
const ProductModel = require("../services/models/product.model.js");
const UserModel = require("../services/models/user.model.js");
const logger = require("../utils/logger.js");

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

      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(" Error interno del servidor");
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
      res.status(200).json({
        message: "Producto encontrado",
        product,
      });
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

      const existingProduct = await ProductModel.findOne({ code: code });
      if (existingProduct) {
        return res.status(409).json({ message: "El valor de code ya existe" });
      }

      // Asignar el owner al correo del usuario autenticado
      const ownerEmail = req.user.email; // Asumiendo que `authenticateToken` agrega el usuario decodificado al objeto req

      // Verificar si el usuario es premium o admin
      const user = await UserModel.findOne({ email: ownerEmail });
      if (!user || (user.role !== "premium" && user.role !== "admin")) {
        return res.status(403).json({
          message:
            "El usuario debe ser premium o admin para agregar un producto.",
        });
      }

      newProduct.owner = ownerEmail;

      const product = new ProductModel(newProduct);
      await product.save();

      return res.status(200).json({
        message: "Producto agregado exitosamente",
        product,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }

  async updateProduct(req, res) {
    const productId = req.params.pid;
    const updatedProduct = req.body;

    try {
      const product = await ProductModel.findById(productId);

      // Verificar si el usuario es admin o el propietario del producto
      if (
        !product ||
        (req.user.role !== "admin" && product.owner !== req.user.email)
      ) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para modificar este producto." });
      }

      // Actualizar el producto
      const updated = await productManager.updateProduct(
        productId,
        updatedProduct
      );
      if (!updated) {
        return res
          .status(404)
          .json({ message: "El producto que desea actualizar no existe" });
      }

      return res
        .status(200)
        .json({ message: "Producto actualizado exitosamente" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
  async deleteProduct(req, res) {
    const productId = req.params.pid;

    try {
      const product = await ProductModel.findById(productId);

      // Verificar si el usuario es admin o el propietario del producto
      if (
        !product ||
        (req.user.role !== "admin" && product.owner !== req.user.email)
      ) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para eliminar este producto." });
      }

      // Eliminar el producto
      const deleted = await productManager.deleteProduct(productId);
      if (!deleted) {
        return res
          .status(404)
          .json({ message: "El producto que desea eliminar no existe" });
      }

      return res
        .status(200)
        .json({ message: "Producto eliminado exitosamente" });
    } catch (error) {
      logger.error("Error al eliminar el producto:", error);
      return res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
}

module.exports = ProductController;
