const ProductManager = require("../services/db/mockingProductsService.js");
const productManager = new ProductManager();
// const ProductModel = require("../services/models/product.model.js");

class ProductController {
  // async getProducts(req, res) {
  //   try {
  //     const products = await productManager.getProducts();
  //     res.json(products);
  //   } catch (error) {
  //     res.status(500).send("Error");
  //   }
  // }
  async createProduct(req, res) {
    try {
      const products = [];

      for (let i = 0; i < 100; i++) {
        const product = await productManager.createProduct();
        products.push(product);
      }

      console.log(products);
      return res.status(200).json({
        message: "Productos creados exitosamente",
        products,
      });
    } catch (error) {}
  }

  //   async getProductById(req, res) {
  //     const id = req.params.pid;
  //     try {
  //       const product = await productManager.getProductById(id);
  //       if (!product) {
  //         return res.status(404).json({
  //           error: "Producto no encontrado",
  //         });
  //       }
  //       res.json(product);
  //     } catch (error) {
  //       res.status(500).json({ error: "Error del servidor" });
  //     }
  //   }

  //   async updateProduct(req, res) {
  //     const id = req.params.pid;
  //     const product = req.body;
  //     try {
  //       const updatedProduct = await productManager.updateProduct(id, product);
  //       if (!updatedProduct) {
  //         res
  //           .status(404)
  //           .send({ message: "El producto que desea actualizar no existe" });
  //       } else {
  //         return res
  //           .status(200)
  //           .json({ message: "Producto actualizado exitosamente" });
  //       }
  //     } catch (error) {
  //       res
  //         .status(500)
  //         .json({ message: "Error del servidor", error: error.message });
  //     }
  //   }
  //   async deleteProduct(req, res) {
  //     const id = req.params.pid;
  //     try {
  //       const product = await productManager.deleteProduct(id);
  //       if (!product) {
  //         res
  //           .status(404)
  //           .send({ message: "El producto que desea eliminar no existe" });
  //       } else {
  //         return res
  //           .status(200)
  //           .json({ message: "Producto eliminado exitosamente" });
  //       }
  //     } catch (error) {
  //       res.status(500).json({ error: "Error del servidor" });
  //     }
  //   }
}

module.exports = ProductController;
