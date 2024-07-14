const ProductModel = require("../services/models/product.model.js");
const UserModel = require("../services/models/user.model.js");
const CartManager = require("../services/db/cartService.js");
const ProductManager = require("../services/db/mockingProductsService.js");
const productManager = new ProductManager();
const cartManager = new CartManager();
const authMiddleware = require("../middleware/authmiddleware");
const logger = require("../utils/logger.js");
const mongoose = require("mongoose");

class ViewsController {
  async renderProducts(req, res) {
    try {
      const user = req.user;
      const { page = 1, limit = 3 } = req.query;

      const skip = (page - 1) * limit;

      const products = await ProductModel.find().skip(skip).limit(limit);

      const totalProducts = await ProductModel.countDocuments();

      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      const newArray = products.map((product) => {
        const { _id, owner, ...rest } = product.toObject();
        return {
          id: _id,
          owner,
          ...rest,
          showAddToCartButton: user.role !== "admin" && user.email !== owner, // No mostrar botón si es admin o dueño del producto
        };
      });

      const cartId = req.user.cart.toString();

      res.render("products", {
        products: newArray,
        hasPrevPage,
        hasNextPage,
        prevPage: page > 1 ? parseInt(page) - 1 : null,
        nextPage: page < totalPages ? parseInt(page) + 1 : null,
        currentPage: parseInt(page),
        totalPages,
        cartId,
        isAdmin: user.role === "admin",
        isPremium: user.role === "premium",
        userEmail: user.email,
      });
    } catch (error) {
      logger.error("Error al obtener productos", error);
      res.status(500).json({
        status: "error",
        error: "Error interno del servidor",
      });
    }
  }

  async renderCart(req, res) {
    const cartId = req.params.cid;
    try {
      const cart = await cartManager.getCartById(cartId);

      if (!cart) {
        logger.warning("No existe ese carrito con el id");
        return res.status(404).json({ error: "Carrito no encontrado" });
      }

      let totalPurchase = 0;

      const productsInCart = cart.products
        .map((item) => {
          const product =
            item.product instanceof mongoose.Document
              ? item.product.toObject()
              : item.product;

          if (!product) {
            // Manejar el caso donde el producto es null
            logger.warning(
              `Producto no encontrado para el item en el carrito con id ${item._id}`
            );
            return null; // Ignorar este producto
          }

          const quantity = item.quantity;
          const totalPrice = product.price * quantity;

          totalPurchase += totalPrice;

          return {
            ...product, // Extiende las propiedades del producto
            totalPrice,
            quantity,
            cartId,
          };
        })
        .filter((item) => item !== null); // Filtrar productos nulos

      res.render("carts", {
        products: productsInCart,
        totalPurchase,
        cartId,
      });
    } catch (error) {
      logger.error("Error al obtener el carrito", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderLogin(req, res) {
    if (req.user) {
      return res.redirect("/");
    }

    res.render("login");
  }

  async renderRegister(req, res) {
    if (req.user) {
      return res.redirect("/api/users/profile");
    }

    res.render("register");
  }

  async renderRealTimeProducts(req, res) {
    try {
      res.render("realTimeProducts");
    } catch (error) {
      logger.error("error en la vista real time", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async renderChat(req, res) {
    res.render("chat");
  }

  async renderHome(req, res) {
    if (!req.user) {
      return res.redirect("login");
    }

    res.render("home");
  }

  async renderMockingProducts(req, res) {
    const products = [];

    for (let i = 0; i < 100; i++) {
      const product = await productManager.createProduct();
      products.push(product);
    }

    logger.info(products);
    res.render("mockingProducts", { products: products });
  }
  async renderOwnerProducts(req, res) {
    try {
      const ownerEmail = req.params.email;

      // Buscar el usuario por su correo electrónico
      const user = await UserModel.findOne({ email: ownerEmail });

      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      // Obtener los productos del propietario específico
      const products = await ProductModel.find({ owner: ownerEmail });
      const mapProducts = products.map((product) =>
        JSON.parse(JSON.stringify(product))
      );

      logger.info(mapProducts);

      // Renderizar la vista y pasar los productos
      res.render("ownerProducts", { mapProducts });
    } catch (error) {
      logger.error("Error al obtener los productos del dueño:", error);
      res.status(500).send("Error al obtener los productos del dueño");
    }
  }
  async renderAllUsers(req, res) {
    try {
      const users = await UserModel.find({});
      const mapUsers = users.map((user) => JSON.parse(JSON.stringify(user)));

      logger.debug(mapUsers);

      // Renderizar la vista y pasar los usuarios
      res.render("users", { mapUsers });
    } catch (error) {
      logger.error("Error al obtener los usuarios", error);
      res.status(500).send("Error al obtener los usuarios");
    }
  }
}

module.exports = ViewsController;
