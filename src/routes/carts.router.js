const express = require("express");
const router = express.Router();

const CartController = require("../controllers/cartController.js");
const cartController = new CartController();

router.use(express.json());

// ----------------------------------------------------------
// La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
// Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
// products: Array que contendrá objetos que representen cada producto

router.post("/", async (req, res) => {
  try {
    await cartController.addCart(req, res);
  } catch (error) {
    console.error("Error al crear un nuevo carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// -------------------------------------------------------------
// La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
router.get("/:cid", async (req, res) => {
  try {
    await cartController.getCartById(req, res);
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

// ---------------------------------------------------------------------------------------
// La ruta POST  /:cid/product/:pid deberá agregar el producto al arreglo “products” del carrito seleccionado, agregándose como un objeto bajo el siguiente formato:
// product: SÓLO DEBE CONTENER EL ID DEL PRODUCTO (Es crucial que no agregues el producto completo)
// quantity: debe contener el número de ejemplares de dicho producto. El producto, de momento, se agregará de uno en uno.

// Además, si un producto ya existente intenta agregarse al producto, incrementar el campo quantity de dicho producto.

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    await cartController.addProductToCart(req, res);
  } catch (error) {
    console.error("Error en la ruta POST /:cid/product/:pid", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    await cartController.deleteProductsFromCart(req, res);
  } catch (error) {
    res.status(500).json({ message: "error en el servidor", error });
  }
});

// ----------------------------------------------------------------------------------------------
// PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.

router.put("/:cid", async (req, res) => {
  try {
    await cartController.updateProductsFromCart(req, res);
  } catch (error) {
    console.error("Error al actualizar el carrito", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

// ------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------
// PUT api/carts/:cid/products/:pid deberá poder actualizar SÓLO la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    await cartController.updateQuantity(req, res);
  } catch (error) {
    console.error("Error en la ruta PUT /:cid/product/:pid", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});
// ------------------------------------------------------------------------------------------------

// DELETE api/carts/:cid deberá eliminar todos los productos del carrito

router.delete("/:cid", async (req, res) => {
  try {
    await cartController.deleteAllProducts(req, res);
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
