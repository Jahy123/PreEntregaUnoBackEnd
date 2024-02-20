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

  async getProducts(limit, page, sort, category, availability) {
    try {
      const filter = {};

      if (category) {
        filter.category = category;
      }

      if (availability !== undefined) {
        filter.stock = availability ? { $gt: 0 } : { $lte: 0 };
      }

      const options = {
        limit: limit,
        page: page,
        sort: sort,
      };

      const result = await ProductModel.paginate(filter, options);

      const response = {
        status: "success",
        payload: result.docs,
        totalPages: result.totalPages,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&category=${category}&availability=${availability}`
          : null,
        nextLink: result.hasNextPage
          ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&category=${category}&availability=${availability}`
          : null,
      };

      return response;
      // ------------------------agregado sin internet
      // const productsDoc = products.docs.map((product) => {
      //   const { _id, ...rest } = product.toObject();
      //   return res;
      // });
      // -----------------------------------------------------
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
