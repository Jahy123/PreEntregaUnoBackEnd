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
      const cart = await CartModel.findById(id).populate("products.product");
      if (!cart) {
        console.log("producto no encontrado");
        return null;
      }

      console.log("Carrito encontrado", cart);
      return cart;
    } catch (error) {
      console.log("La busqueda no pudo ser realizada", error);
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
        // Si el producto no existe en el carrito, agrégalo
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
      // cartAndProduct contiene el carrito actualizado
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
