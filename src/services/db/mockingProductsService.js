const { faker } = require("@faker-js/faker");
class ProductManager {
  async createProduct() {
    try {
      return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        img: faker.image.url(),
        code: faker.string.alphanumeric(5),
        stock: parseInt(faker.string.numeric()),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(),
        thumbnails: faker.image.avatarLegacy(),
      };
    } catch (error) {
      console.log("Error al generar producto");
    }
  }
  async getProducts() {
    try {
    } catch (error) {
      throw new Error("Error");
    }
  }

  //   async getProductById(id) {
  //     try {
  //       const product = await ProductModel.findById(id);

  //       if (!product) {
  //         console.log("producto no encontrado");
  //         return null;
  //       }

  //       console.log("producto encontrado");
  //       return product;
  //     } catch (error) {
  //       console.log("Error al traer un product por id");
  //     }
  //   }

  //   async updateProduct(id, productUpdate) {
  //     try {
  //       const product = await ProductModel.findByIdAndUpdate(id, productUpdate);

  //       if (!product) {
  //         console.log("No se encuentra el producto");
  //         return null;
  //       }

  //       console.log("Producto actualizado con exito");
  //       return product;
  //     } catch (error) {
  //       console.log("Error al actualizar el producto", error);
  //     }
  //   }
  //   async deleteProduct(id) {
  //     try {
  //       const product = await ProductModel.findByIdAndDelete(id);

  //       if (!product) {
  //         return null;
  //       }
  //       return product;
  //     } catch (error) {
  //       console.log("Error al eliminar el producto", error);
  //     }
  //   }
}

module.exports = ProductManager;
