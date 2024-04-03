const express = require("express");
const router = express.Router();
const CartManager = require("../services/db/cart_manager_db.js");

const manager = new CartManager();
const CartModel = require("../services/models/cart.model.js");

router.use(express.json());

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
      res.status(500).json({ error: "Error del servidor" });
    }
  }
  async deleteProductsFromCart(req, res) {
    try {
      const cartId = req.params.cid;
      const productId = req.params.pid;
      const cart = await manager.getCartById(cartId);

      if (!cart) {
        return res.json("Carrito no encontrado:");
      }

      const cartAndProduct = await CartModel.findOne({
        _id: cartId,
        products: { $elemMatch: { product: productId } },
      });

      if (!cartAndProduct) {
        return res.json({
          message: "Producto no existe en el carrito",
        });
      } else {
        await manager.deleteProductFromCart(cartId, productId);
      }

      return res.json({
        message: "Producto eliminado correctamente",
      });
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
      return res.json({
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
        return res.json({
          message: "Productos eliminados correctamente del carrito",
        });
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
      res.status(500).json({ error: "Error del servidor" });
    }
  }
}

module.exports = CartController;
