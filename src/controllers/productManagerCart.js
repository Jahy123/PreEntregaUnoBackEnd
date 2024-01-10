const { log } = require("console");

const fs = require("fs").promises;

class ProductManagerCart {
  static id = 0;
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.loadLastId();
  }
  async loadLastId() {
    try {
      const listCarts = await this.readFile();
      if (listCarts.length > 0) {
        const lastCart = listCarts[listCarts.length - 1];
        ProductManagerCart.id = lastCart.id;
      }
    } catch (error) {
      throw new Error("Error loading last id");
    }
  }
  async addCart(objeto) {
    try {
      const existingCarts = await this.readFile();

      let { products } = objeto;

      if (!products) {
        throw new Error("Complete all fields");
      }

      ProductManagerCart.id++;
      const cart = {
        id: ProductManagerCart.id,
        products,
      };
      existingCarts.push(cart);
      await this.saveFile(existingCarts);
    } catch (error) {
      throw new Error("Could not add cart");
    }
  }

  async getCartById(id) {
    try {
      let listCarts = await this.readFile();
      const findCart = listCarts.find((item) => item.id == id);

      if (!findCart) {
        throw new Error("Cart not found");
      } else {
        return findCart.products;
      }
    } catch (error) {
      throw new Error("Search cannot be performed");
    }
  }

  async addProductToCart(idProduct, idCart) {
    try {
      let listCarts = await this.readFile();
      const findCartIndex = listCarts.findIndex((item) => item.id == idCart);

      if (findCartIndex === -1) {
        throw new Error("Cart not found");
      }

      const res = await fs.readFile("./src/models/products.json", "utf-8");
      const listProducts = JSON.parse(res);

      const findProduct = listProducts.find((item) => item.id == idProduct);

      if (!findProduct) {
        throw new Error("Product not found");
      }

      const existingProductIndex = listCarts[findCartIndex].products.findIndex(
        (product) => product.id == idProduct
      );

      if (existingProductIndex !== -1) {
        listCarts[findCartIndex].products[existingProductIndex].quantity += 1;
      } else {
        listCarts[findCartIndex].products.push({
          id: idProduct,
          quantity: 1,
        });
      }

      await this.saveFile(listCarts);

      console.log("Product added to cart successfully");
    } catch (error) {
      throw new Error("Failed to send new cart");
    }
  }

  async readFile() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      const listCarts = JSON.parse(res);

      return listCarts;
    } catch (error) {
      throw "Failed to read file";
    }
  }

  async saveFile(listCarts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(listCarts, null, 2));
    } catch (error) {
      throw "Failed to save file";
    }
  }
}

module.exports = ProductManagerCart;
