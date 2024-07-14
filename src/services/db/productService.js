const UserModel = require("../models/user.model.js");
const ProductModel = require("../models/product.model.js");
const nodemailer = require("nodemailer");
const logger = require("../../utils/logger.js");
class ProductManager {
  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      const newProduct = new ProductModel({
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      });

      await newProduct.save();
    } catch (error) {
      return "Error al agregar producto", error;
    }
  }
  async getProducts(limit = 10, page = 1, sort, query) {
    try {
      const skip = (page - 1) * limit;

      let queryOptions = {};

      if (query) {
        queryOptions = { category: query };
      }

      const sortOptions = {};
      if (sort) {
        if (sort === "asc" || sort === "desc") {
          sortOptions.price = sort === "asc" ? 1 : -1;
        }
      }

      const products = await ProductModel.find(queryOptions)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit);

      const totalProducts = await ProductModel.countDocuments(queryOptions);

      const totalPages = Math.ceil(totalProducts / limit);

      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;

      return {
        docs: products,
        totalPages,
        prevPage: hasPrevPage ? page - 1 : null,
        nextPage: hasNextPage ? page + 1 : null,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `/api/products?limit=${limit}&page=${
              page - 1
            }&sort=${sort}&query=${query}`
          : null,
        nextLink: hasNextPage
          ? `/api/products?limit=${limit}&page=${
              page + 1
            }&sort=${sort}&query=${query}`
          : null,
      };
    } catch (error) {
      logger.error("Error al traer productos", error);
    }
  }

  async getProductById(id) {
    try {
      const product = await ProductModel.findById(id);

      if (!product) {
        logger.warning("producto no encontrado");
        return null;
      }

      logger.info("producto encontrado");
      return product;
    } catch (error) {
      logger.error("Error al traer un product por id");
    }
  }

  async updateProduct(id, productUpdate) {
    try {
      const product = await ProductModel.findByIdAndUpdate(id, productUpdate);

      if (!product) {
        logger.warning("No se encuentra el producto");
        return null;
      }

      logger.info("Producto actualizado con exito");
      return product;
    } catch (error) {
      logger.error("Error al actualizar el producto", error);
    }
  }
  async deleteProduct(id) {
    try {
      const product = await ProductModel.findByIdAndDelete(id);

      if (!product) {
        return null;
      }
      // Verificar si el propietario es un usuario premium
      const owner = await UserModel.findOne({ email: product.owner });
      if (owner && owner.role === "premium") {
        // Configurar el transportador de nodemailer
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "jahyireantunezsalazar@gmail.com", // tu correo
            pass: "wieo tvzp odfr ejrh", // tu contraseña
          },
        });

        // Enviar el correo electrónico al propietario
        await transport.sendMail({
          from: "Tu App <jahyireantunezsalazar@gmail.com>",
          to: owner.email,
          subject: "Producto Eliminado",
          text: `Hola ${owner.first_name}, tu producto "${product.title}" ha sido eliminado.`,
        });

        logger.info(
          `Correo enviado a ${owner.email} informando sobre la eliminación del producto.`
        );
      }
      return;
    } catch (error) {
      logger.error("Error al eliminar el producto", error);
    }
  }
}

module.exports = ProductManager;
