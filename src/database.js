const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://J4HY123:IjeIrbqq6qxjPKHQ@cluster0.efnweff.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then(() => console.log("Conexión exitosa"))
  .catch(() => console.log("error al conectar con la base de datos"));
