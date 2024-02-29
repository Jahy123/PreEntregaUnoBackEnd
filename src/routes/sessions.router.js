const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
router.use(express.json());

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      if (user.password === password) {
        req.session.login = true;
        req.session.user = {
          email: user.email,
          age: user.age,
          first_name: user.first_name,
          last_name: user.last_name,
        };
        if (user.email === "adminCoder@coder.com") {
          req.session.user.admin = true;
        } else {
          req.session.user.admin = false;
        }
        console.log(
          "Datos del usuario después de iniciar sesión:",
          req.session.user
        );

        res.redirect("/products");
      } else {
        res.status(401).send({ error: "Contraseña no valida" });
      }
    } else {
      res.status(404).send({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(400).send({ error: "Error en el login" });
  }
});

router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }
  res.redirect("/");
});

module.exports = router;
