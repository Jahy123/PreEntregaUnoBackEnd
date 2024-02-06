const CartModel = require("../models/cart.model.js");

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
      const cart = await CartModel.findById(id);
      if (!cart) {
        console.log("cart not found");
        return null;
      }
      console.log("Cart found");
      return cart;
    } catch (error) {
      console.log("Search cannot be performed");
    }
  }

  async addProductToCart(productId, cartId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const product = cart.products.find(
        (item) => item.product.toString() === productId
      );

      if (product) {
        product.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }

      cart.markModified("products");

      await cart.save();
      return cart;
    } catch (error) {
      console.log("Failed to send new cart");
    }
  }
}

module.exports = CartManager;
