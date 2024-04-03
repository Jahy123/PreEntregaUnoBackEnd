const dotenv = require("dotenv");

const program = require("../utils/commander.js");

const { mode } = program.opts();

dotenv.config({
  path: mode === "production" ? "./.env.production" : "./.env.development",
});

const configObject = {
  mongo_url: process.env.MONGO_URL,
  port: process.env.PORT,
  secret_cookie: process.env.SECRET_COOKIE,
  secret_session: process.env.SECRET_SESSION,
};

module.exports = configObject;
