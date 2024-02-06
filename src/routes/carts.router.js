const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart_manager_db.js");
const manager = new CartManager();

router.use(express.json());

// ----------------------------------------------------------
// La ruta raíz POST / deberá crear un nuevo carrito con la siguiente estructura:
// Id:Number/String (A tu elección, de igual manera como con los productos, debes asegurar que nunca se dupliquen los ids y que este se autogenere).
// products: Array que contendrá objetos que representen cada producto

router.post("/", async (req, res) => {
  try {
    const newCart = await manager.addCart();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear un nuevo carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// -------------------------------------------------------------
// La ruta GET /:cid deberá listar los productos que pertenezcan al carrito con el parámetro cid proporcionados.
router.get("/:cid", async (req, res) => {
  try {
    const id = req.params.cid;

    const cart = await manager.getCartById(id);

    if (cart) {
      res.send(cart);
    } else {
      res.status(400).send({ status: "error", message: "Cart not found" });
    }
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
    const productId = req.params.pid;
    const cartId = req.params.cid;
    const quantity = req.body.quantity || 1;
    const cart = await manager.addProductToCart(productId, cartId, quantity);
    res.send({ status: "success", message: "Product adeded to cart" });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
});

module.exports = router;
