const UserModel = require("../services/models/user.model.js");
const CartModel = require("../services/models/cart.model.js");
const jwt = require("jsonwebtoken");
const { createHash, isValidPassword } = require("../utils/hashBcrypt.js");
const UserDTO = require("../dto/user.dto.js");
const configObject = require("../config/config.js");
const { secret_or_key, token } = configObject;
const CustomError = require("../services/errors/custom-error.js");
const { generateInfoError } = require("../services/errors/info.js");
const { EErrors } = require("../services/errors/enums.js");

class UserController {
  async register(req, res) {
    const { first_name, last_name, email, password, age } = req.body;

    try {
      if (!first_name || !last_name || !email) {
        throw CustomError.createError({
          name: "Usuario nuevo",
          cause: generateInfoError({ first_name, last_name, email }),
          message: "Error al intentar crear un usuario",
          code: EErrors.TYPE_INVALID,
        });
      }
      const user = await UserModel.findOne({ email });
      if (user) {
        return res.status(400).send("El usuario ya existe");
      }

      const newCart = new CartModel();
      await newCart.save();

      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        cart: newCart._id,
        password: createHash(password),
        age,
      });

      await newUser.save();

      const Token = jwt.sign({ user: newUser }, secret_or_key, {
        expiresIn: "1h",
      });

      res.cookie(token, Token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      req.logger.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(401).send("Usuario no válido");
      }

      const isValid = isValidPassword(password, user);
      if (!isValid) {
        return res.status(401).send("Contraseña incorrecta");
      }

      const Token = jwt.sign({ user: user }, secret_or_key, {
        expiresIn: "1h",
      });

      res.cookie(token, Token, {
        maxAge: 3600000,
        httpOnly: true,
      });

      res.redirect("/api/users/profile");
    } catch (error) {
      req.logger.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async profile(req, res) {
    const userDto = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role
    );
    const isAdmin = req.user.role === "admin";
    res.render("profile", { user: userDto, isAdmin });
  }

  async logout(req, res) {
    res.clearCookie(token);
    res.redirect("/login");
  }

  async admin(req, res) {
    if (req.user.role !== "admin") {
      return res.status(403).send("Acceso denegado");
    }
    res.render("admin");
  }
}

module.exports = UserController;
