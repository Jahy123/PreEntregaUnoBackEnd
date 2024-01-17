const fs = require("fs").promises;

class ProductManager {
  static id = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
    this.loadLastId();
  }
  async loadLastId() {
    try {
      const listProducts = await this.readFile();
      if (listProducts.length > 0) {
        const lastProduct = listProducts[listProducts.length - 1];
        ProductManager.id = lastProduct.id;
      }
    } catch (error) {
      throw new Error("error loading last id");
    }
  }
  async addProduct(objeto) {
    try {
      const existingProducts = await this.readFile();

      let {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = objeto;

      if (existingProducts.find((product) => product.code === code)) {
        console.log("The value of code already exists");
      }
      ProductManager.id++;
      if (status === "true") {
        status = true;
      }
      let intPrice = parseInt(price);
      let intStock = parseInt(stock);
      let product;
      if (thumbnail) {
        product = {
          id: ProductManager.id,
          title,
          description,
          price: intPrice,
          thumbnail,
          code,
          stock: intStock,
          status,
          category,
        };
      } else {
        product = {
          id: ProductManager.id,
          title,
          description,
          price: intPrice,

          code,
          stock: intStock,
          status,
          category,
        };
      }

      existingProducts.push(product);
      await this.saveFile(existingProducts);
    } catch (error) {
      console.error("Error in addProduct:", error);
      throw new Error(
        `Error when adding the product. Initial error: ${error.message}`
      );
    }
  }

  async getProducts() {
    try {
      let listProducts = await this.readFile();
      const result = !listProducts ? this.products : listProducts;
      return result;
    } catch (error) {
      throw new Error("Product not found");
    }
  }

  async getProductById(id) {
    try {
      let listProducts = await this.readFile();
      const findProduct = listProducts.find((item) => item.id == id);

      if (!findProduct) {
        throw new Error("Product was not found");
      } else {
        console.log("Producto encontrado:", findProduct);
      }
    } catch (error) {
      throw new Error("Error getting product");
    }
  }

  async updateProduct(id, updateProduct) {
    try {
      this.products = await this.readFile();

      const index = this.products.findIndex((item) => item.id == id);

      if (index !== -1) {
        const updatedProduct = { id, ...updateProduct };
        this.products.splice(index, 1, updatedProduct);
        await this.saveFile(this.products);
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      throw new Error("Error updating product");
    }
  }

  async deleteProduct(id) {
    try {
      const listProducts = await this.readFile();

      const index = listProducts.findIndex((item) => item.id == id);

      if (index == -1) {
        throw new Error("Product not found");
      }
      console.log("ID a eliminar:", id);
      console.log("Producto encontrado:", listProducts[index]);

      listProducts.splice(index, 1);

      await this.saveFile(listProducts);

      console.log("Product deleted");
    } catch (error) {
      throw new Error("Error deleting product");
    }
  }

  async readFile() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      const listProducts = JSON.parse(res);

      return listProducts;
    } catch (error) {
      throw "Failed to read file";
    }
  }

  async saveFile(listProducts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(listProducts, null, 2));
    } catch (error) {
      throw "Failed to save file";
    }
  }
}

module.exports = ProductManager;
