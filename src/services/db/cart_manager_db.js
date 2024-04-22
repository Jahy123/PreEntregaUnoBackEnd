const CartModel = require("../models/cart.model.js");
const ProductModel = require("../models/cart.model.js");

class CartManager {
  async addCart() {
    try {
      const newCart = new CartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.log("Could not add cart");
    }
  }

  async getCartById(id) {
    try {
      const carrito = await CartModel.findById(id);
      if (!carrito) {
        console.log("No existe ese carrito con el id");
        return null;
      }
      return carrito;
    } catch (error) {
      throw new Error("Error");
    }
  }

  async addProductToCart(productId, cartId, quantity = 1) {
    try {
      const cartAndProduct = await CartModel.findOneAndUpdate(
        { _id: cartId, "products.product": productId },
        {
          $inc: { "products.$.quantity": quantity },
        },
        { new: true }
      );

      if (!cartAndProduct) {
        await CartModel.findByIdAndUpdate(
          cartId,
          {
            $push: {
              products: {
                product: productId,
                quantity: quantity,
              },
            },
          },
          { new: true }
        );
      }
      console.log("Producto agregado al carrito");

      return cartAndProduct;
    } catch (error) {
      console.log("Failed to send new cart", error);
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const updatedCart = await CartModel.findByIdAndUpdate(
        cartId,
        { $pull: { products: { product: productId } } },
        { new: true }
      );
      return updatedCart;
    } catch (error) {
      console.log("Error al eliminar el producto", error);
    }
  }
  async deleteProductsFromCart(cartId) {
    try {
      const updatedCart = await CartModel.findByIdAndUpdate(
        cartId,
        { $set: { products: [] } },
        { new: true }
      );
      return updatedCart;
    } catch (error) {
      console.log("Error al eliminar el producto");
      return Promise.reject(error);
    }
  }

  async updateProductsOfCart(cartId, updatedProducts) {
    try {
      const cart = await CartModel.findById(cartId);

      if (!cart) {
        console.log("Carrito no encontrado");
      }

      cart.products = updatedProducts;

      cart.markModified("products");

      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error al actualizar el carrito en el gestor", error);
      throw error;
    }
  }
  async updateQuantity(cartId, productId, quantity) {
    try {
      const updatedCart = await CartModel.findOneAndUpdate(
        { _id: cartId, "products.product": productId },
        { $set: { "products.$.quantity": quantity } },
        { new: true }
      );
      return updatedCart;
    } catch (error) {
      console.log("Failed to send new cart", error);
    }
  }
}

module.exports = CartManager;
