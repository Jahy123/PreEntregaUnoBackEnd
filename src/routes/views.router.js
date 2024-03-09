const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/db/product_manager_db.js");
const productManager = new ProductManager();
const mongoose = require("mongoose");
const CartManager = require("../dao/db/cart_manager_db.js");

const cartManager = new CartManager();
// agregado de clase 19-----------------------------------------------------------------------------------
// router.get("/setCookie", async (req, res) => {
//   try {
//     // res.cookie("coderCookie", "Primera vez con cookies").send("cookie seteada");
//     res
//       .cookie("coderCookie", "Primera vez con cookies", { maxAge: 40000 })
//       .send("cookie seteada");
//   } catch (error) {
//     console.error("Error en cookie parser", error);
//   }
// });
// router.get("/readCookie", async (req, res) => {
//   try {
//     res
//       .cookie("coderCookie", "Primera vez con cookies", { maxAge: 40000 })
//       .send(req.cookies);
//   } catch (error) {
//     console.error("Error en cookie parser", error);
//   }
// });
// router.get("/deleteCookie", async (req, res) => {
//   try {
//     res.clearCookie("coderCookie").send("cookie eliminada");
//   } catch (error) {
//     console.error("Error en cookie parser", error);
//   }
// });
// router.get("/secretCookie", async (req, res) => {
//   try {
//     res
//       .cookie("cookieSecreta", "mesaje oculto", { signed: true })
//       .send("cookie enviada");
//   } catch (error) {
//     console.error("Error en cookie parser", error);
//   }
// });
// router.get("/accesoSecretCookie", async (req, res) => {
//   try {
//     const valueCookie = req.signedCookies.cookieSecreta;
//     if (valueCookie) {
//       res.send("cookie en contrada: " + valueCookie);
//     } else {
//       res.send("cookie modificada");
//     }
//   } catch (error) {
//     console.error("Error en cookie parser", error);
//   }
// });
// router.get("/session", async (req, res) => {
//   try {
//     if (req.session.counter) {
//       req.session.counter++;
//       res.send("visitaste el sitio: " + req.session.counter + "veces");
//     } else {
//       req.session.counter = 1;
//       res.send("binevenido");
//     }
//   } catch (error) {
//     console.error("Error en cookie parser", error);
//   }
// });
// router.get("/logout", async (req, res) => {
//   try {
//     req.session.destroy((error) => {
//       if (!error) res.send("sesion cerrada");
//       else res.send({ status: "logout error", body: error });
//     });
//   } catch (error) {
//     console.error("Error en cookie parser", error);
//   }
// });
// router.get("/login", async (req, res) => {
//   try {
//     let user = req.query.user;
//     req.session.user = user;
//     res.send("Usuario guardado por medio de query");
//   } catch (error) {
//     console.error("Error al agregar usuario", error);
//   }
// });

// router.get("/user", async (req, res) => {
//   try {
//     if (req.session.user) {
//       return res.send("Usuario registrado: " + req.session.user);
//     }
//     res.send("Usuario no registrado");
//   } catch (error) {
//     console.error("Error al agregar usuario", error);
//   }
// });
// function auth(req, res, next) {
//   if (req.session.user === "ja" && req.session.admin === true) {
//     return next();
//   } else {
//     return res.status(401).send("error de autorizacion");
//   }
// }
// router.get("/private", auth, async (req, res) => {
//   try {
//     res.send("acceso autorizado");
//   } catch (error) {
//     return error;
//   }
// });
//-------------------------------------------------------------------------------------------------
router.get("/products", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const products = await productManager.getProducts(limit, page);
    if (!req.session.login) {
      return res.redirect("/login");
    }

    const { first_name, last_name, rol } = req.session.user;

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
      userFirstName: first_name,
      userLastName: last_name,
      rol: rol,
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

router.get("/", (req, res) => {
  if (req.session.login) {
    return res.redirect("/products");
  }

  res.render("login");
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {
  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

router.get("/profile", (req, res) => {
  console.log("Valor de req.session.login:", req.session.login);
  console.log("Valor de req.session.user:", req.session.user);

  if (!req.session.login) {
    return res.redirect("/");
  }

  // Renderiza la vista de perfil con los datos del usuario
  res.render("profile", { user: req.session.user });
});

module.exports = router;
