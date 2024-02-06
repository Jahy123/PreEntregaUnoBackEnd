const ProductModel = require("../models/product.model.js");

class ProductManager {
  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      const product = await ProductModel.findOne({ code: code });

      if (product) {
        console.log("El código debe ser único, malditooo!!!");
        return;
      }

      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      });

      await newProduct.save();
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error;
    }
  }

  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      console.log("Error al obtener los productos", error);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);

      if (!product) {
        console.log("producto no encontrado");
        return null;
      }

      console.log("producto encontrado");
      return product;
    } catch (error) {
      console.log("Error al traer un product por id");
    }
  }

  async updateProduct(id, productUpdate) {
    try {
      const product = await ProductModel.findByIdAndUpdate(id, productUpdate);

      if (!product) {
        console.log("No se encuentra el producto");
        return null;
      }

      console.log("Producto actualizado con exito!");
      return product;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }
  async deleteProduct(id) {
    try {
      const product = await ProductModel.findByIdAndDelete(id);

      if (!product) {
        console.log("No se encuentra");
        return null;
      }

      console.log("Producto eliminado correctamente!");
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
