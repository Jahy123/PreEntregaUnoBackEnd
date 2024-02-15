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

  async getProducts(limit, page, sort, query, category, status) {
    try {
      const filter = {};

      if (query) {
        filter.$text = { $search: query };
      }

      if (category) {
        filter.category = category;
      }

      if (status) {
        filter.status = status;
      }

      // Realizar la consulta con los parámetros proporcionados
      const products = await ProductModel.find(filter)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sort)
        .exec();
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

      console.log("Producto actualizado con exito");
      return product;
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }
  async deleteProduct(id) {
    try {
      const product = await ProductModel.findByIdAndDelete(id);

      if (!product) {
        return null;
      }
      return product;
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
}

module.exports = ProductManager;
