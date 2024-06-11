const socket = require("socket.io");
const ProductManager = require("../services/db/productService.js");
const productManager = new ProductManager();
const MessageModel = require("../services/models/message.model.js");
const logger = require("../utils/logger.js");

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.initSocketEvents();
  }

  async initSocketEvents() {
    this.io.on("connection", async (socket) => {
      logger.info("Un cliente se conectó");

      socket.emit("products", await productManager.getProducts());

      socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        this.emitUpdatedProducts(socket);
      });
      socket.on("updateProduct", async (id, productUpdate) => {
        await productManager.updateProduct(id, productUpdate);
        this.emitUpdatedProducts(socket);
      });

      socket.on("addProduct", async (product) => {
        await productManager.addProduct(product);
        this.emitUpdatedProducts(socket);
      });

      socket.on("message", async (data) => {
        await MessageModel.create(data);
        const messages = await MessageModel.find();
        socket.emit("message", messages);
      });
    });
  }

  async emitUpdatedProducts(socket) {
    socket.emit("products", await productManager.getProducts());
  }
}

module.exports = SocketManager;
