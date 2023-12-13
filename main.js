const fs = require("fs").promises;

class ProductManager {
  static id = 0;
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  async addProduct(objeto) {
    let { title, description, price, thumbnail, code, stock } = objeto;

    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Asegurate de completar todos los campos");
      return;
    }

    if (this.products.find((product) => product.code === code)) {
      console.log("El valor de code ya existe");
      return;
    }

    const product = {
      id: ++ProductManager.id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);

    await this.guardarDocumento(this.products);
  }

  async getProducts() {
    console.log(this.products);
  }

  async getProductById(id) {
    try {
      let arrayProductos = await this.leerDocumento();
      const productoBuscado = arrayProductos.find((item) => item.id === id);

      !productoBuscado
        ? console.log("No se encontró el producto")
        : console.log("Producto encontrado:", productoBuscado);
    } catch (error) {
      console.log("Error al leer el archivo", error);
    }
  }

  async updateProduct(id, productoActualizado) {
    try {
      const arrayProductos = await this.leerDocumento();

      const index = arrayProductos.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProductos.splice(index, 1, productoActualizado);
        await this.guardarDocumento(arrayProductos);
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
    }
  }
  async deleteProduct(id) {
    try {
      const arrayProductos = await this.leerDocumento();

      console.log("Antes de la eliminación:", arrayProductos);

      const indiceProductoBuscado = arrayProductos.findIndex(
        (item) => item.id === id
      );

      if (indiceProductoBuscado === -1) {
        console.log("No se encontró el producto");
      } else {
        console.log("ID a eliminar:", id);
        console.log(
          "Producto encontrado:",
          arrayProductos[indiceProductoBuscado]
        );

        arrayProductos.splice(indiceProductoBuscado, 1);

        console.log("Después de la eliminación:", arrayProductos);

        await this.guardarDocumento(arrayProductos);
        console.log("Después de guardar:", arrayProductos);

        console.log("Producto eliminado correctamente");
      }
    } catch (error) {
      console.error("No se pudo borrar el producto", error);
    }
  }

  async leerDocumento() {
    try {
      const res = await fs.readFile(this.path, "utf-8");
      const arrayProductos = JSON.parse(res);

      return arrayProductos;
    } catch (error) {
      console.log("No se puede leer el archivo");
    }
  }

  async guardarDocumento(arrayProductos) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
    } catch (error) {
      console.log("No se puede guardar el documento");
    }
  }
}

// Testing:

// Se creará una instancia de la clase “ProductManager”

const manager = new ProductManager("./productos.json");

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
//   code: "abc122",
//   stock: 26,
// };
// manager.addProduct(productoPruebaDos);

// // Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
// manager.getProducts();

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

async function testeamosBorrar(numero) {
  await manager.deleteProduct(numero);
}
// testeamosBorrar(1);
