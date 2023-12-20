const ProductManager = require("./productManager");
const manager = new ProductManager("./src/products.json");

// Se echará a andar el servidor
// Se corroborará que el servidor esté corriendo en el puerto 8080.

const PORT = 8080;
const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Servidor creado");
});
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

// -----------------------------------------------------------------------------------------------------------------------
// Se mandará a llamar desde el navegador a la url http://localhost:8080/products sin query, eso debe devolver todos los 10 productos.

// Se mandará a llamar desde el navegador a la url http://localhost:8080/products?limit=5 , eso debe devolver sólo los primeros 5 de los 10 productos.

app.get("/products", async (req, res) => {
  try {
    if (req.query.limit) {
      let limit = parseInt(req.query.limit);

      const products = await manager.getProducts();

      const limitProducts = products.slice(0, limit);

      res.send(limitProducts);
    } else {
      let products = await manager.getProducts();
      res.send(products);
    }
  } catch (error) {
    console.log("Error al acceder a los productos", error);
  }
});

// -----------------------------------------------------------------------------------------------------------------------
// Se mandará a llamar desde el navegador a la url http://localhost:8080/products/2, eso debe devolver sólo el producto con id=2.
// Se mandará a llamar desde el navegador a la url http://localhost:8080/products/34123123, al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe. al no existir el id del producto, debe devolver un objeto con un error indicando que el producto no existe.

app.get("/products/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    const products = await manager.getProducts();
    const product = products.find((product) => product.id == id);
    if (product) {
      res.send(product);
    } else {
      let objetoNoEncontrado = { error: "No se encontró el producto" };
      res.send(objetoNoEncontrado);
    }
  } catch (error) {
    console.log("Error al encontrar los productos", error);
  }
});
