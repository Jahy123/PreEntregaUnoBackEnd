const express = require("express");
const router = express.Router();
const CartManager = require("../dao/db/cart_manager_db.js");
const ProductManager = require("../dao/db/product_manager_db.js");
const productManager = new ProductManager();
const manager = new CartManager();
const CartModel = require("../dao/models/cart.model.js");
const ProductModel = require("../dao/models/product.model.js");

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

    if (!cart) {
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    }

    return res.status(200).json({ message: "carrito encontrado", cart });
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
    await manager.addProductToCart(productId, cartId, quantity);

    const cart = await CartModel.findOneAndUpdate({ _id: cartId });
    const product = await ProductModel.findOneAndUpdate({ _id: productId });
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    return res.status(200).json({ message: "Producto agregado al carrito" });
  } catch (error) {
    console.error("Error en la ruta POST /:cid/product/:pid", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = manager.getCartById(cartId);

    if (!cart) {
      res.json("Carrito no encontrado:");
    } else {
      const cartAndProduct = await CartModel.findOne({
        _id: cartId,
        products: { $elemMatch: { product: productId } },
      });

      if (!cartAndProduct) {
        return res.json({
          message: "Producto no existe en el carrito",
        });
      } else {
        manager.deleteProductFromCart(cartId, productId);
      }
    }
    return res.json({
      message: "Producto eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ----------------------------------------------------------------------------------------------
// PUT api/carts/:cid deberá actualizar el carrito con un arreglo de productos con el formato especificado arriba.

router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const updatedProducts = req.body;
  // Debes enviar un arreglo de productos en el cuerpo de la solicitud

  try {
    const cart = await CartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        error: "Carrito no encontrado",
      });
    }

    const updatedCart = await manager.updateProductsOfCart(
      cartId,
      updatedProducts
    );
    return res.json({
      message: "productos del carrito actualizados correctamente",
      updatedCart,
    });
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
    const productId = req.params.pid;
    const cartId = req.params.cid;
    const { quantity } = req.body;
    const cart = manager.getCartById(cartId);

    if (!cart) {
      res.json("Carrito no encontrado:");
    } else {
      const cartAndProduct = await CartModel.findOne({
        _id: cartId,
        products: { $elemMatch: { product: productId } },
      });

      if (!cartAndProduct) {
        return res.json({
          message: "Producto no existe en el carrito",
        });
      } else {
        await manager.updateQuantity(cartId, productId, quantity);
      }
    }
    return res.json({
      message: "Cantidad del producto actualizada correctamente",
    });
  } catch (error) {
    console.error("Error en la ruta PUT /:cid/product/:pid", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});
// ------------------------------------------------------------------------------------------------

// DELETE api/carts/:cid deberá eliminar todos los productos del carrito

router.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = manager.getCartById(cartId);
    await manager.deleteProductsFromCart(cartId);
    if (cart) {
      return res.json({
        message: "Productos eliminados correctamente del carrito",
      });
    }
    return res.status(404).json({ message: "Carrito no encontrado" });
  } catch (error) {
    if (error.message === "Carrito no encontrado") {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
