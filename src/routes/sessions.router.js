const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");
router.use(express.json());

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await UserModel.findOne({ email: email });
//     if (user) {
//       if (user.password === password) {
//         req.session.login = true;
//         req.session.user = {
//           email: user.email,
//           age: user.age,
//           first_name: user.first_name,
//           last_name: user.last_name,
//         };
//         if (user.email === "adminCoder@coder.com") {
//           req.session.user.admin = true;
//         } else {
//           req.session.user.admin = false;
//         }
//         console.log(
//           "Datos del usuario después de iniciar sesión:",
//           req.session.user
//         );

//         res.redirect("/products");
//       } else {
//         res.status(401).send({ error: "Contraseña no valida" });
//       }
//     } else {
//       res.status(404).send({ error: "Usuario no encontrado" });
//     }
//   } catch (error) {
//     res.status(400).send({ error: "Error en el login" });
//   }
// });

router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/");
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    // const adminUser = {
    //   username: "Admin",
    //   first_name: "Private",
    //   last_name: "Private",

    //   age: "private",
    //   email: "adminCoder@coder.com",
    //   password: "adminCod3er123",
    //   rol: "admin",
    // };

    // if (
    //   req.user.email === adminUser.email &&
    //   req.user.password === adminUser.password
    // ) {
    //   req.session.login = true;
    //   req.session.user = { ...adminUser };
    //   res.redirect("/products");
    //   return;
    // }
    if (!req.user)
      return res
        .status(400)
        .send({ status: "error", message: "Credenciales inválidas" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      rol: "user",
    };

    req.session.login = true;

    res.redirect("/products");
  }
);

router.get("/faillogin", async (req, res, next) => {
  try {
    console.log("Fallo la estrategia");
    throw new Error("Credenciales inválidas");
  } catch (error) {
    console.log("Error en /faillogin:", error);
    next(error);
  }
});
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);
module.exports = router;
