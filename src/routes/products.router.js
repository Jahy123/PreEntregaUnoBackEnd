const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager");
const manager = new ProductManager("./src/models/products.json");

router.use(express.json());

// ----------------------------------------------------------------
// La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit del desafío anterior
router.get("/", async (req, res) => {
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
    res.status(400).send({ status: "error", message: error });
  }
});
// -------------------------------------------------------------------------------
// La ruta GET /:pid deberá traer sólo el producto con el id proporcionado
router.get("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    const products = await manager.getProducts();
    const product = products.find((product) => product.id == id);
    if (product) {
      res.send(product);
    } else {
      res.status(404).send({ status: "error", message: "Product not found" });
    }
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

// -----------------------------------------------------
// La ruta raíz POST / deberá agregar un nuevo producto con los campos:
// id: Number/String (A tu elección, el id NO se manda desde body, se autogenera como lo hemos visto desde los primeros entregables, asegurando que NUNCA se repetirán los ids en el archivo.
//   title:String,
//   description:String
//   code:String
//   price:Number
//   status:Boolean
//   stock:Number
//   category:String
//   thumbnails:Array de Strings que contenga las rutas donde están almacenadas las imágenes referentes a dicho producto
//   Status es true por defecto.
//   Todos los campos son obligatorios, a excepción de thumbnails

router.post("/", async (req, res) => {
  try {
    const object = req.body;
    const { title, description, price, code, stock, status, category } =
      req.body;

    if (
      !title ||
      !description ||
      !price ||
      !code ||
      !stock ||
      !status ||
      !category
    ) {
      return res.send({ status: "success", message: "Complete all fields" });
    } else {
      await manager.addProduct(object);

      res.send({ status: "success", message: "Add new product" });
    }
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

// --------------------------------------------------------
//La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización.
router.put("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;
    const newProduct = req.body;
    const updateProduct = await manager.updateProduct(id, newProduct);

    res.send({ status: "success", message: "Update product" });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});
// ----------------------------------------------------------------------------------
// La ruta DELETE /:pid deberá eliminar el producto con el pid indicado.

router.delete("/:pid", async (req, res) => {
  try {
    const id = req.params.pid;

    const deleteProduct = await manager.deleteProduct(id);

    res.send({ status: "success", message: "Delete product" });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

module.exports = router;
