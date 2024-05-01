const { EErrors } = require("../services/errors/enums.js");

const errorHandle = (error, req, res, next) => {
  console.log(error.cause);
  switch (error.code) {
    case EErrors.TYPE_INVALID:
      res.send({ status: "error", error: error.name });
      break;
    default:
      res.send({ status: "error", error: "Error desconocido" });
  }
};

module.exports = errorHandle;
