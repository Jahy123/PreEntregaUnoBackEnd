const { faker } = require("@faker-js/faker");
const logger = require("../../utils/logger.js");
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
      logger.error("Error al generar producto");
    }
  }
  async getProducts() {
    try {
    } catch (error) {
      throw new Error("Error");
    }
  }
}

module.exports = ProductManager;
