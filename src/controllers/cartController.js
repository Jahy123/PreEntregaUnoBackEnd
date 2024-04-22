const TicketModel = require("../services/models/ticket.model.js");
const UserModel = require("../services/models/user.model.js");
const CartManager = require("../services/db/cart_manager_db.js");
const manager = new CartManager();
const ProductManager = require("../services/db/product_manager_db.js");
const productManager = new ProductManager();
const { generateUniqueCode, calculateTotal } = require("../utils/cartutils.js");
const CartModel = require("../services/models/cart.model.js");

class CartController {
  async addCart(req, res) {
    try {
      const newCart = await manager.addCart();
      res.json("CARRITO CREADO");
    } catch (error) {
      res.json({ error: "Error del servidor", error });
    }
  }
  async getCartById(req, res) {
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
      res.status(500).json({ error: "Error del servidor" });
    }
  }
  async addProductToCart(req, res) {
    try {
      const productId = req.params.pid;
      const cartId = req.params.cid;
      const quantity = req.body.quantity || 1;

      const cartAndProduct = await manager.addProductToCart(
        productId,
        cartId,
        quantity
      );

      if (!cartAndProduct) {
        return res
          .status(404)
          .json({ message: "No se pudo agregar el producto al carrito" });
      }

      return res.status(200).json({ message: "Producto agregado al carrito" });
    } catch (error) {
      console.error("Error al agregar el producto al carrito:", error);
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async deleteProductsFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const cart = await manager.getCartById(cartId);

      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      }

      const cartAndProduct = await CartModel.findOne({
        _id: cartId,
        products: { $elemMatch: { product: productId } },
      });

      if (!cartAndProduct) {
        return res
          .status(404)
          .json({ message: "Producto no existe en el carrito" });
      } else {
        await manager.deleteProductFromCart(cartId, productId);
      }

      return res
        .status(200)
        .json({ message: "Producto eliminado correctamente" });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error del servidor", error: error.message });
    }
  }
  async updateProductsFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const updatedProducts = req.body;
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
      return res
        .status(200)
        .json({
          message: "productos del carrito actualizados correctamente",
          updatedCart,
        });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }
  async deleteAllProducts(req, res) {
    try {
      const cartId = req.params.cid;
      const cart = await manager.getCartById(cartId);
      await manager.deleteProductsFromCart(cartId);
      if (cart) {
        return res
          .status(200)
          .json({ message: "Productos eliminados correctamente del carrito" });
      }
      return res.status(404).json({ message: "Carrito no encontrado" });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }
  async updateQuantity(req, res) {
    try {
      const productId = req.params.pid;
      const cartId = req.params.cid;
      const { quantity } = req.body;
      const cart = await manager.getCartById(cartId);

      if (!cart) {
        return res.status(404).json({ message: "Carrito no encontrado" });
      } else {
        const cartAndProduct = await CartModel.findOne({
          _id: cartId,
          products: { $elemMatch: { product: productId } },
        });

        if (!cartAndProduct) {
          return res
            .status(404)
            .json({ message: "Producto no existe en el carrito" });
        } else {
          await manager.updateQuantity(cartId, productId, quantity);
        }
      }
      return res
        .status(200)
        .json({ message: "Cantidad del producto actualizada correctamente" });
    } catch (error) {
      res.status(500).json({ error: "Error del servidor" });
    }
  }

  async finalizePurchase(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await manager.getCartById(cartId);
      const products = cart.products;

      const productsNotAvailable = [];

      for (const item of products) {
        const productId = item.product;
        const product = await productManager.getProductById(productId);
        if (product.stock >= item.quantity) {
          product.stock -= item.quantity;
          await product.save();
        } else {
          productsNotAvailable.push(productId);
        }
      }

      const userWithCart = await UserModel.findOne({ cart: cartId });

      const ticket = new TicketModel({
        code: generateUniqueCode(),
        purchase_datetime: new Date(),
        amount: calculateTotal(cart.products),
        purchaser: userWithCart._id,
      });
      await ticket.save();

      cart.products = cart.products.filter((item) =>
        productsNotAvailable.some((productId) => productId.equals(item.product))
      );

      await cart.save();

      res.status(200).json({
        productsNotAvailable,
      });
    } catch (error) {
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
}

module.exports = CartController;
