console.log("Funciona el archivo de public js");
const socket = io();

socket.on("Products", (data) => {
  const products = data;
  console.log(products);

  const productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.innerHTML = `
      <h2>Title: ${product.title}</h2>
      <h3>Description: ${product.description}</h3>
      <p>Price: $${product.price}.00</p>
      <p>Stock: ${product.stock}</p>
      <p>Category: ${product.category}</p>
    `;
    productsContainer.appendChild(productElement);
  });
});
