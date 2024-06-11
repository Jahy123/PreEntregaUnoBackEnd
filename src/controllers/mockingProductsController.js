const ProductManager = require("../services/db/mockingProductsService.js");
const productManager = new ProductManager();
const logger = require("../utils/logger.js");

class ProductController {
  async createProduct(req, res) {
    try {
      const products = [];

      for (let i = 0; i < 100; i++) {
        const product = await productManager.createProduct();
        products.push(product);
      }

      req.logger.info(products);
      return res.status(200).json({
        message: "Productos creados exitosamente",
        products,
      });
    } catch (error) {}
  }
}

module.exports = ProductController;
