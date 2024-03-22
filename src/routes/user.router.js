const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
router.use(express.json());
const { createHash } = require("../utils/hashBcrypt.js");
const passport = require("passport");

// router.post("/", async (req, res) => {
//   const { first_name, last_name, email, password, age } = req.body;

//   try {
//     // Verificar si el correo electrónico ya está registrado
//     const existingUser = await UserModel.findOne({ email: email });

//     if (existingUser) {
//       return res
//         .status(400)
//         .send({ error: "El correo electrónico ya está registrado" });
//     }

//     // Crear un nuevo usuario
//     const newUser = await UserModel.create({
//       first_name,
//       last_name,
//       email,
//       password,
//       age,
//     });

//     // Asignar el usuario a la sesión
//     req.session.login = true;
//     req.session.user = { ...newUser._doc };

//     // Verificar si el usuario tiene un correo específico y asignar el rol de admin
//     if (
//       newUser.email === "adminCoder@coder.com" &&
//       newUser.password === "adminCod3r123"
//     ) {
//       req.session.admin = true;
//     } else {
//       req.session.admin = false;
//     }

//     res.status(200).send({ message: "Usuario creado con éxito" });
//   } catch (error) {
//     console.error("Error al crear el usuario", error);
//     res.status(400).send({ error: "Error al crear el usuario" });
//   }
// });

router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/failedregister",
  }),
  async (req, res) => {
    if (!req.user)
      return res
        .status(401)
        .send({ status: "error", message: "Credenciales inválidas" });

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      rol: req.user.rol,
    };

    req.session.login = true;

    res.redirect("/products");
  }
);

router.get("/failedregister", (req, res) => {
  res.send({ error: "Registro fallido" });
});

module.exports = router;
