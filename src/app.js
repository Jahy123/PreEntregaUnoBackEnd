const PORT = 8080;
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

const ProductManager = require("./controllers/productManager");
const manager = new ProductManager("./src/models/products.json");
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

app.get("/", (req, res) => {
  res.send("Servidor creado");
});
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
const io = socket(httpServer);
io.on("connection", async (socket) => {
  try {
    console.log("Un cliente se conectó");
    const products = await manager.getProducts();

    socket.emit("Products", products);
  } catch (error) {}
});
