const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product_manager_db.js");
const productManager = new ProductManager();
const mongoose = require("mongoose");
const CartManager = require("../dao/db/cart_manager_db.js");

const cartManager = new CartManager();

router.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const products = await productManager.getProducts(limit, page);

    console.log("Productos antes del mapeo:", products);
    // console.log("Productos de payload", products.payload);

    const formattedProducts = await products.payload.map((product) => {
      return product.toObject();
    });

    res.render("products", {
      products: formattedProducts,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages,
    });
    console.log("productos de products", formattedProducts);
  } catch (error) {
    console.error("Error al obtener productos", error);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;
  console.log("ID recibido desde la URL:", cartId);

  try {
    const cart = await cartManager.getCartById(cartId);

    if (cart) {
      const products = cart.products.map((item) => ({
        product: item.product.toObject(),

        quantity: item.quantity,
      }));

      res.render("carts", { products: products });
    } else {
      return res.status(404).json({ error: "cart not found" });
    }
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});
module.exports = router;
