class ProductManager {
  static id = 0;
  constructor() {
    this.products = [];
  }
  addProduct = (title, description, price, thumbnail, code, stock) => {
    if (!title || !description || !price || !thumbnail || !code || !stock) {
      console.log("Asegurate de completar todos los campos");
      return;
    }

    if (this.products.find((product) => product.code === code)) {
      console.log("El valor de code ya existe");
      return;
    }

    const product = {
      id: ++ProductManager.id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(product);
  };

  getProducts = () => {
    console.log(this.products);
  };

  getProductById = (id) => {
    const product = this.products.find((item) => item.id === id);
    !product
      ? console.log("No se encontró el producto")
      : console.log("Producto encontrado:", product);
    return product;
  };
}

const manager = new ProductManager();
manager.getProducts();
manager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

manager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  20,
  "Sin imagen",
  "abc124",
  25
);
manager.getProductById(2);
