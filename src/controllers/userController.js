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
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger.js");

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
      logger.error(error);
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
      logger.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }

  async profile(req, res) {
    const userDto = new UserDTO(
      req.user.first_name,
      req.user.last_name,
      req.user.role,
      req.user.email,
      req.user.cart
    );
    const isAdmin = req.user.role === "admin";
    const isPremium = req.user.role === "premium";
    const email = req.user.email;
    const first_name = req.user.first_name;
    const cart = req.user.cart;
    res.render("profile", {
      user: userDto,
      isAdmin,
      isPremium,
      email,
      first_name,
      cart,
    });
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

  async requestResetPassword(req, res) {
    try {
      res.send(`
      <h1>Solicitud de restablecimiento de contraseña</h1>
      <form action="/api/users/sendResetPasswordEmail" method="post">
        <label for="email">Correo electrónico:</label>
        <input type="email" id="email" name="email" required>
        <button type="submit">Enviar correo de restablecimiento</button>
      </form>
  `);
    } catch (error) {
      res
        .status(500)
        .send("Error al enviar solicitud de restablecimiento de contraseña");
    }
  }
  async sendResetPasswordEmail(req, res) {
    const { email } = req.body;
    const token = jwt.sign({ email }, secret_or_key, { expiresIn: "1h" });

    const transport = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "jahyireantunezsalazar@gmail.com",
        pass: "wieo tvzp odfr ejrh",
      },
    });

    const resetLink = `http://localhost:8080/api/users/resetPassword?token=${token}`;

    try {
      await transport.sendMail({
        from: "Coder Test <jahyireantunezsalazar@gmail.com>",
        to: email,
        subject: "Restablecer contraseña",
        html: `<h1>Restablece tu contraseña</h1>
               <a href="${resetLink}">Haz clic aquí para restablecer tu contraseña</a>`,
      });

      res.send(
        "Correo enviado correctamente. Accede a tu correo para restablecer tu contraseña"
      );
    } catch (error) {
      res.status(500).send("Error al enviar mail");
    }
  }
  async resetPassword(req, res) {
    const token = req.query.token;

    if (!token) {
      return res.status(400).send("Token no proporcionado");
    }

    jwt.verify(token, secret_or_key, (err, decoded) => {
      if (err) {
        return res.redirect("/requestResetPassword");
      }

      res.send(`
      <form action="/api/users/changePassword" method="post">
        <input type="hidden" name="token" value="${token}" />
        <label for="password">Nueva contraseña:</label>
        <input type="password" id="password" name="password" required />
        <button type="submit">Restablecer contraseña</button>
      </form>
    `);
    });
  }
  async changePassword(req, res) {
    const { token, password } = req.body;

    if (!token) {
      return res.status(400).send("Token no proporcionado");
    }

    try {
      const decoded = jwt.verify(token, secret_or_key);
      const user = await UserModel.findOne({ email: decoded.email });

      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).send("No se puede colocar la misma contraseña");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      res.send("Contraseña restablecida correctamente");
    } catch (error) {
      logger.error("Error al restablecer la contraseña:", error);
      res.status(500).send("Error al restablecer la contraseña");
    }
  }
}

module.exports = UserController;
