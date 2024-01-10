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

      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !status ||
        !category
      ) {
        throw new Error("Complete all fields");
      }

      if (existingProducts.find((product) => product.code === code)) {
        throw new Error("The value of code already exists");
      }
      ProductManager.id++;
      const product = {
        id: ProductManager.id,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      };
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

// Testing:

// Se creará una instancia de la clase “ProductManager”

// const manager = new ProductManager("./src/products.json");
//
// Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []

// manager.getProducts();

// Se llamará al método “addProduct” con los campos:
// title: “producto prueba”
// description:”Este es un producto prueba”
// price:200,
// thumbnail:”Sin imagen”
// code:”abc123”,
// stock:25

// const productoPrueba = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc123",
//   stock: 25,
// };
// manager.addProduct(productoPrueba);

// El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE

// const productoPruebaDos = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc124",
//   stock: 26,
// };
// const productoPruebaTres = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc125",
//   stock: 26,
// };
// const productoPruebaCuatro = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc126",
//   stock: 26,
// };
// const productoPruebaCinco = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc127",
//   stock: 26,
// };
// const productoPruebaSeis = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc128",
//   stock: 26,
// };
// const productoPruebaSiete = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc129",
//   stock: 26,
// };
// const productoPruebaOcho = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc130",
//   stock: 26,
// };
// const productoPruebaNueve = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc1231",
//   stock: 26,
// };
// const productoPruebaDiez = {
//   title: "producto prueba",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc132",
//   stock: 26,
// };
// manager.addProduct(productoPrueba);
// manager.addProduct(productoPruebaDos);
// manager.addProduct(productoPruebaTres);
// manager.addProduct(productoPruebaCuatro);
// manager.addProduct(productoPruebaCinco);
// manager.addProduct(productoPruebaSeis);
// manager.addProduct(productoPruebaSiete);
// manager.addProduct(productoPruebaOcho);
// manager.addProduct(productoPruebaNueve);
// manager.addProduct(productoPruebaDiez);

// // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
// manager.getProducts();
//
// Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.

// async function testeamosBusqueda(id) {
//   const buscado = await manager.getProductById(id);
// }

// testeamosBusqueda(1);
// testeamosBusqueda(3);

// Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto o el objeto completo, se evaluará que no se elimine el id y que sí se haya hecho la actualización.

// const productoPruebaTres = {
//   id: 1,
//   title: "producto prueba tres",
//   description: "Este es un producto prueba",
//   price: 200,
//   thumbnail: "Sin imagen",
//   code: "abc125",
//   stock: 26,
// };
// async function testeamosActualizar() {
//   await manager.updateProduct(1, productoPruebaTres);
// }
// testeamosActualizar();

// Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.

// async function testeamosBorrar(numero) {
//   await manager.deleteProduct(numero);
// }
// testeamosBorrar(1);
