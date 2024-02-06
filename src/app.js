const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PORT = 8080;
require("./database.js");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js");

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Rutas:
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
// let messages = [];
const io = socket(httpServer);
io.on("connection", async (socket) => {
  try {
    console.log("Un cliente se conectó");
    const products = await manager.getProducts();
    socket.emit("Products", products);
    // agregado-----------------------------------------------

    // socket.on("message", (data) => {
    //   messages.push(data);
    //   io.emit("messagesLogs", messages);
    // });
    // ----------------------------------------
  } catch (error) {}
});
