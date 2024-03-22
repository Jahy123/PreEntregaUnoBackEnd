const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const PORT = 8080;
const passport = require("passport");
const initializePassport = require("./config/passport.config.js");
require("./database.js");
// agregado clase 22-----------------
const jwt = require("jsonwebtoken");
// -------------------------

const handlebars = require("express-handlebars");

const productsRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const usersRouter = require("./routes/user.router.js");
const sessionRouter = require("./routes/sessions.router.js");
const viewsRouter = require("./routes/views.router.js");

const cookieParser = require("cookie-parser");

const session = require("express-session");
const FileStore = require("session-file-store");
const MongoStore = require("connect-mongo");
const fileStore = FileStore(session);

const cookieSecreta = "hola";
app.use(cookieParser(cookieSecreta));
app.use(
  session({
    secret: "secretCoder",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://J4HY123:IjeIrbqq6qxjPKHQ@cluster0.efnweff.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0",
    }),
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

const MessageModel = require("./dao/models/message.model.js");
const io = new socket.Server(httpServer);

io.on("connection", (socket) => {
  console.log("new user");

  socket.on("message", async (data) => {
    await MessageModel.create(data);

    const messages = await MessageModel.find();
    console.log(messages);
    io.sockets.emit("message", messages);
  });
});
