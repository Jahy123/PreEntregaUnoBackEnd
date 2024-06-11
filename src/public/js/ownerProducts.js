// const socket = io();

// socket.on("products", (products) => {
//   console.log(products); // Verificar productos en la consola del navegador
//   renderProducts(products);
// });

// const renderProducts = (products) => {
//   const containerProducts = document.getElementById("contenedorProductos");
//   containerProducts.innerHTML = "";

//   if (products && Array.isArray(products)) {
//     products.forEach((item) => {
//       const card = document.createElement("div");
//       card.classList.add("card");

//       card.innerHTML = `
//         <p>${item.title}</p>
//         <p>${item.price}</p>
//         <p>${item.description}</p>
//         <p>${item.stock}</p>
//         <button class="btnDelete">Eliminar</button>
//       `;

//       containerProducts.appendChild(card);

//       // Agregamos el evento al botón de eliminar:
//       card.querySelector(".btnDelete").addEventListener("click", () => {
//         deleteProduct(item._id);
//       });
//     });
//   } else {
//     console.error("No se encontraron productos en los datos recibidos.");
//   }
// };

// const deleteProduct = (id) => {
//   socket.emit("deleteProduct", id);
// };

// Obtener el email del usuario autenticado desde el div oculto
const emailDiv = document.getElementById("userEmail");
const email = emailDiv.getAttribute("data-email");

const socket = io({
  query: {
    email: email,
  },
});

socket.on("products", (products) => {
  logger.debug(products); // Verificar productos en la consola del navegador
  renderProducts(products);
});

const renderProducts = (products) => {
  const containerProducts = document.getElementById("contenedorProductos");
  containerProducts.innerHTML = "";

  if (products && Array.isArray(products)) {
    products.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = ` 
        <p>${item.title}</p>
        <p>${item.price}</p>
        <p>${item.description}</p>
        <p>${item.stock}</p>
        <button class="btnDelete">Eliminar</button>
      `;

      containerProducts.appendChild(card);

      // Agregamos el evento al botón de eliminar:
      card.querySelector(".btnDelete").addEventListener("click", () => {
        deleteProduct(item._id);
      });
    });
  } else {
    logger.error("No se encontraron productos en los datos recibidos.");
  }
};

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};
