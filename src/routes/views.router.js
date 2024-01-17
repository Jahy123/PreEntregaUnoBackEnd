const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager");
const manager = new ProductManager("./src/models/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await manager.getProducts();
    res.render("index", { products, style: "style.css" });
  } catch (error) {}
});
router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realTimeProducts", { style: "style.css" });
  } catch (error) {}
});
module.exports = router;
