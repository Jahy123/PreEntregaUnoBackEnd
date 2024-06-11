const mongoose = require("mongoose");
const configObject = require("./config/config.js");
const { mongo_url } = configObject;
const logger = require("./utils/logger.js");

class database {
  static #Instance;

  //Se declara una variable estática y privada #Instance. La palabra clave static significa que esta variable pertenece a la clase en sí, no a las Instances individuales de la misma.
  constructor() {
    mongoose.connect(mongo_url);
  }

  static getInstance() {
    if (this.#Instance) {
      logger.info("Conexion previa");
      return this.#Instance;
    }

    this.#Instance = new database();
    logger.info("Conexión exitosa");
    return this.#Instance;
  }
}

module.exports = database.getInstance();
