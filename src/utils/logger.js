const winston = require("winston");
const configObject = require("../config/config.js");

const { node_env } = configObject;

const levels = {
  level: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "magenta",
    warning: "blue",
    info: "green",
    http: "yellow",
    debug: "white",
  },
};

const developmentLogger = winston.createLogger({
  levels: levels.level,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ colors: levels.colors }),
        winston.format.simple()
      ),
    }),
  ],
});
const productionLogger = winston.createLogger({
  levels: levels.level,
  transports: [
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
      format: winston.format.combine(
        winston.format.colorize({ colors: levels.colors }),
        winston.format.simple()
      ),
    }),
  ],
});

const logger = node_env === "production" ? productionLogger : developmentLogger;

module.exports = logger;
