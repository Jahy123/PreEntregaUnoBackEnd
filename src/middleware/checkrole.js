const jwt = require("jsonwebtoken");
const configObject = require("../config/config.js");
const { secret_or_key } = configObject;
const checkUserRole = (allowedRoles) => (req, res, next) => {
  const token = req.cookies.coderCookieToken;

  if (token) {
    jwt.verify(token, secret_or_key, (err, decoded) => {
      if (err) {
        res.status(403).send("Acceso denegado. Token inválido.");
      } else {
        const userRole = decoded.user.role;
        if (allowedRoles.includes(userRole)) {
          next();
        } else {
          res
            .status(403)
            .send(
              "Acceso denegado. No tienes permiso para acceder a esta página."
            );
        }
      }
    });
  } else {
    res.status(403).send("Acceso denegado. Token no proporcionado.");
  }
};

module.exports = checkUserRole;
