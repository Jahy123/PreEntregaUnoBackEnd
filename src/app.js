const express = require("express");
const app = express();
const exphbs = require("express-handlebars");

const cookieParser = require("cookie-parser");
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
const cors = require("cors");
const path = require("path");
const configObject = require("./config/config.js");
require("./database.js");
const errorHandle = require("./middleware/error.js");
const addLogger = require("./middleware/loggerMiddleware.js");
const logger = require("./utils/logger.js");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUiExpress = require("swagger-ui-express");
const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");
const userRouter = require("./routes/user.router.js");
const mockingProductsRouter = require("./routes/mockingProducts.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(errorHandle);
app.use(addLogger);

//Passport
app.use(passport.initialize());
initializePassport();
app.use(cookieParser());

//AuthMiddleware
const authMiddleware = require("./middleware/authmiddleware.js");
app.use(authMiddleware);

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", userRouter);
app.use("/api/mockingProducts", mockingProductsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(configObject.port, () => {
  logger.info(`Servidor escuchando en http://localhost:${configObject.port}`);
});

///Websockets:
const SocketManager = require("./sockets/socketmanager.js");
new SocketManager(httpServer);

// logger
app.get("/loggerTest", (req, res) => {
  req.logger.fatal("Error fatal");
  req.logger.error("Error");
  req.logger.warning("Advertencia");
  req.logger.info("Mensaje de Info");
  req.logger.http("Mensaje de ruta");
  req.logger.debug("Mensaje de debug");

  res.send("Test de logs");
});
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion de ecommerce",
      description: "Proyecto coderhouse backend",
    },
  },
  apis: [path.join(__dirname, "docs/**/*.yaml")],
};
const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
