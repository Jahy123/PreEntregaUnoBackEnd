const socket = io();

socket.on("products", (product) => {
  // console.log(product);
  renderProducts(product);
});

//Función para renderizar nuestros productos:
const renderProducts = (product) => {
  const containerProducts = document.getElementById("contenedorProductos");
  containerProducts.innerHTML = "";

  if (product && product.docs) {
    product.docs.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = ` 
        <p>${item.title}</p>
        <p>${item.price}</p>
        <button class="btnDelete">Eliminar</button>
        <button class="btnUpdate" data-product-id="${item._id}">Actualizar</button>
      `;

      containerProducts.appendChild(card);

      // Agregamos el evento al botón de eliminar:
      card.querySelector(".btnDelete").addEventListener("click", () => {
        deleteProduct(item._id);
      });

      // Agregamos el evento al botón de actualizar:
      card.querySelector(".btnUpdate").addEventListener("click", () => {
        renderUpdateForm(item._id, item.title);
      });
    });
  } else {
    console.error("No se encontraron productos en los datos recibidos.");
  }
};

const renderUpdateForm = (productId, productName) => {
  // Crear y configurar el elemento div
  const div = document.createElement("div");
  div.classList.add("containerUpdateProduct");

  // Agregar el contenido HTML al div
  div.innerHTML = ` 
    <h2>Actualizar Producto: ${productName}</h2>
    <form id="updateForm">
      <input type="text" id="titleUpdate" placeholder="Titulo" />
      <input type="text" id="descriptionUpdate" placeholder="Descripcion" />
      <input type="number" id="priceUpdate" placeholder="Precio" />
      <input type="text" id="imgUpdate" value="Sin Imagen" />
      <input type="text" id="codeUpdate" placeholder="Código" />
      <input type="number" id="stockUpdate" placeholder="Stock" />
      <input type="text" id="categoryUpdate" placeholder="Categoria" />
      <select id="statusUpdate">
        <option value="true">Activo</option>
        <option value="false">Inactivo</option>
      </select>
      <button type="button" class="btnSubmitUpdate">Enviar</button>
    </form>
  `;

  // Agregar el div al contenedor de productos
  document.getElementById("contenedorProductos").appendChild(div);

  // Obtener el formulario y el botón de actualización
  const updateForm = document.getElementById("updateForm");
  const btnSubmitUpdate = updateForm.querySelector(".btnSubmitUpdate");

  // Agregar un evento de clic al botón de actualización
  btnSubmitUpdate.addEventListener("click", () => {
    // Obtener los valores de los campos del formulario
    const titleUpdate = updateForm.querySelector("#titleUpdate").value;
    const descriptionUpdate =
      updateForm.querySelector("#descriptionUpdate").value;
    const priceUpdate = updateForm.querySelector("#priceUpdate").value;
    const imgUpdate = updateForm.querySelector("#imgUpdate").value;
    const codeUpdate = updateForm.querySelector("#codeUpdate").value;
    const stockUpdate = updateForm.querySelector("#stockUpdate").value;
    const categoryUpdate = updateForm.querySelector("#categoryUpdate").value;
    const statusUpdate = updateForm.querySelector("#statusUpdate").value;

    // Crear un objeto con los valores actualizados del producto
    const arrayUpdateProduct = {
      title: titleUpdate,
      description: descriptionUpdate,
      price: priceUpdate,
      thumbnail: imgUpdate,
      code: codeUpdate,
      stock: stockUpdate,
      status: statusUpdate,
      category: categoryUpdate,
    };

    // Llamar a la función updateProduct con los datos actualizados
    updateProduct(productId, arrayUpdateProduct);
  });
};

// const renderProducts = (product) => {
//   const containerProducts = document.getElementById("contenedorProductos");
//   containerProducts.innerHTML = "";

//   if (product && product.docs) {
//     product.docs.forEach((item) => {
//       const card = document.createElement("div");
//       card.classList.add("card");

//       card.innerHTML = `
//         <p>${item.title}</p>
//         <p>${item.price}</p>
//         <button>Eliminar</button>
//         <button id="btnUpdateProduct">Actualizar</button>
//       `;

//       containerProducts.appendChild(card);

//       // Agregamos el evento al botón de eliminar:
//       card.querySelector("button").addEventListener("click", () => {
//         deleteProduct(item._id);
//       });

//       // Agregamos el evento al botón de actualizar:
//       const btnUpdateProduct = updateForm.querySelector("#btnUpdateProduct");

//       btnUpdateProduct.addEventListener("click", () => {
//         // Al hacer clic en el botón de actualizar, pasamos el título como argumento
//         renderUpdateForm(item._id, item.title);
//       });
//     });
//   } else {
//     console.error("No se encontraron productos en los datos recibidos.");
//   }
// };
// const renderUpdateForm = (productId, productName) => {
//   // Crear y configurar el elemento div
//   const div = document.createElement("div");
//   div.classList.add("containerUpdateProduct");

//   // Agregar el contenido HTML al div
//   div.innerHTML = `
//     <h2>Actualizar Producto: ${productName}</h2>
//     <form id="updateForm">
//       <input type="text" id="titleUpdate" placeholder="Titulo" />
//       <input type="text" id="descriptionUpdate" placeholder="Descripcion" />
//       <input type="number" id="priceUpdate" placeholder="Precio" />
//       <input type="text" id="imgUpdate" value="Sin Imagen" />
//       <input type="text" id="codeUpdate" placeholder="Código" />
//       <input type="number" id="stockUpdate" placeholder="Stock" />
//       <input type="text" id="categoryUpdate" placeholder="Categoria" />
//       <select id="statusUpdate">
//         <option value="true">Activo</option>
//         <option value="false">Inactivo</option>
//       </select>
//       <button type="button" id="btnUpdateProduct">Enviar</button>
//     </form>
//   `;

//   // Agregar el div al contenedor de productos
//   containerProducts.appendChild(div);

//   // Obtener el formulario y el botón de actualización
//   const updateForm = document.getElementById("updateForm");
//   const btnUpdateProduct = updateForm.querySelector("#btnUpdateProduct");

//   // Agregar un evento de clic al botón de actualización
//   btnUpdateProduct.addEventListener("click", () => {
//     // Obtener los valores de los campos del formulario
//     const titleUpdate = updateForm.querySelector("#titleUpdate").value;
//     const descriptionUpdate =
//       updateForm.querySelector("#descriptionUpdate").value;
//     const priceUpdate = updateForm.querySelector("#priceUpdate").value;
//     const imgUpdate = updateForm.querySelector("#imgUpdate").value;
//     const codeUpdate = updateForm.querySelector("#codeUpdate").value;
//     const stockUpdate = updateForm.querySelector("#stockUpdate").value;
//     const categoryUpdate = updateForm.querySelector("#categoryUpdate").value;
//     const statusUpdate = updateForm.querySelector("#statusUpdate").value;

//     // Crear un objeto con los valores actualizados del producto
//     const arrayUpdateProduct = {
//       titleUpdate,
//       descriptionUpdate,
//       priceUpdate,
//       imgUpdate,
//       codeUpdate,
//       stockUpdate,
//       categoryUpdate,
//       statusUpdate,
//     };

//     // Llamar a la función updateProduct con los datos actualizados
//     updateProduct(productId, arrayUpdateProduct);
//     console.log(
//       "Botón de actualización clickeado para el producto con ID:",
//       productId,
//       arrayUpdateProduct
//     );
//   });
// };

// const renderUpdateForm = (productId, productName) => {
//   const div = document.createElement("div");
//   div.classList.add("containerUpdateProduct");

//   div.innerHTML = `
//     <h2>Actualizar Producto: ${productName}</h2>
//     <form id="updateForm">
//       <input type="text" id="titleUpdate" placeholder="Titulo" />
//       <input type="text" id="descriptionUpdate" placeholder="Descripcion" />
//       <input type="number" id="priceUpdate" placeholder="Precio" />
//       <input type="text" id="imgUpdate" value="Sin Imagen" />
//       <input type="text" id="codeUpdate" placeholder="Código" />
//       <input type="number" id="stockUpdate" placeholder="Stock" />
//       <input type="text" id="categoryUpdate" placeholder="Categoria" />
//       <select id="statusUpdate">
//         <option value="true">Activo</option>
//         <option value="false">Inactivo</option>
//       </select>
//       <button type="button" id="btnUpdateProduct">Enviar</button>
//     </form>
//   `;

//   containerProducts.appendChild(div);

//   const updateForm = document.getElementById("updateForm");
//   const btnUpdateProduct = updateForm.querySelector("#btnUpdateProduct");

//   btnUpdateProduct.addEventListener("click", () => {

//       const titleUpdate = updateForm.querySelector("#titleUpdate").value;
//       const descriptionUpdate = updateForm.querySelector("#descriptionUpdate").value;
//       const priceUpdate = updateForm.querySelector("#priceUpdate").value;
//       const imgUpdate = updateForm.querySelector("#imgUpdate").value;
//       const codeUpdate = updateForm.querySelector("#codeUpdate").value;
//       const stockUpdate = updateForm.querySelector("#stockUpdate").value;
//       const categoryUpdate = updateForm.querySelector("#categoryUpdate").value;
//       const statusUpdate = updateForm.querySelector("#statusUpdate").value;

//       const arrayUpdateProduct = {
//         titleUpdate,
//         descriptionUpdate,
//         priceUpdate,
//         imgUpdate,
//         codeUpdate,
//         stockUpdate,
//         categoryUpdate,
//         statusUpdate,
//       };

//       // Llama a la función updateProduct aquí dentro del event listener
//       updateProduct(item._id, arrayUpdateProduct);
//       console.log(
//         "Botón de actualización clickeado para el producto con ID:",
//         item._id,
//         arrayUpdateProduct
//       );
//     });
// } else {
//   console.error("No se encontraron productos en los datos recibidos.");
// }
// }

// const renderProducts = (product) => {
//   const containerProducts = document.getElementById("contenedorProductos");
//   containerProducts.innerHTML = "";

//   if (product && product.docs) {
//     product.docs.forEach((item) => {
//       const card = document.createElement("div");
//       card.classList.add("card");

//       card.innerHTML = `
//         <p>${item.title}</p>
//         <p>${item.price}</p>
//         <button>Eliminar</button>
//         <button class="btn-update">Actualizar</button>
//       `;

//       containerProducts.appendChild(card);

//       // Agregamos el evento al botón de eliminar:
//       card.querySelector("button").addEventListener("click", () => {
//         deleteProduct(item._id);
//       });

//       // Agregamos el evento al botón de actualizar:
//       card.querySelector(".btn-update").addEventListener("click", () => {
//         const div = document.createElement("div");
//         div.classList.add("containerUpdateProduct");

//         div.innerHTML = `
//         <h2>Actualizar </h2>
//           <form id="updateForm">
//             <input type="text" id="titleUpdate" placeholder="Titulo" />
//             <input type="text" id="descriptionUpdate" placeholder="Descripcion" />
//             <input type="number" id="priceUpdate" placeholder="Precio" />
//             <input type="text" id="imgUpdate" value="Sin Imagen" />
//             <input type="text" id="codeUpdate" placeholder="Código" />
//             <input type="number" id="stockUpdate" placeholder="Stock" />
//             <input type="text" id="categoryUpdate" placeholder="Categoria" />
//             <select id="statusUpdate">
//               <option value="true">Activo</option>
//               <option value="false">Inactivo</option>
//             </select>
//             <button type="button" id="btnUpdateProduct">Enviar</button>
//           </form>
//         `;

//         containerProducts.appendChild(div);

//         const updateForm = document.getElementById("updateForm");
//         const btnUpdateProduct = updateForm.querySelector("#btnUpdateProduct");

//         btnUpdateProduct.addEventListener("click", () => {
//           const titleUpdate = updateForm.querySelector("#titleUpdate").value;
//           const descriptionUpdate =
//             updateForm.querySelector("#descriptionUpdate").value;
//           const priceUpdate = updateForm.querySelector("#priceUpdate").value;
//           const imgUpdate = updateForm.querySelector("#imgUpdate").value;
//           const codeUpdate = updateForm.querySelector("#codeUpdate").value;
//           const stockUpdate = updateForm.querySelector("#stockUpdate").value;
//           const categoryUpdate =
//             updateForm.querySelector("#categoryUpdate").value;
//           const statusUpdate =
//             updateForm.querySelector("#statusUpdate").value === "true";

//           const arrayUpdateProduct = {
//             titleUpdate,
//             descriptionUpdate,
//             priceUpdate,
//             imgUpdate,
//             codeUpdate,
//             stockUpdate,
//             categoryUpdate,
//             statusUpdate,
//           };

//           // Llama a la función updateProduct aquí dentro del event listener
//           updateProduct(item._id, arrayUpdateProduct);
//           console.log(
//             "Botón de actualización clickeado para el producto con ID:",
//             item._id,
//             arrayUpdateProduct
//           );
//         });
//       });
//     });
//   } else {
//     console.error("No se encontraron productos en los datos recibidos.");
//   }
// };

// const renderProducts = (product) => {
//   const containerProducts = document.getElementById("contenedorProductos");
//   containerProducts.innerHTML = "";

//   if (product && product.docs) {
//     product.docs.forEach((item) => {
//       const card = document.createElement("div");
//       card.classList.add("card");

//       card.innerHTML = `
//                         <p> ${item.title} </p>
//                         <p> ${item.price} </p>
//                         <button> Eliminar </button>
//                         <button class="btn-update> Actualizar </button>
//                         `;

//       containerProducts.appendChild(card);
//       //Agregamos el evento al boton de eliminar:
//       card.querySelector("button").addEventListener("click", () => {
//         deleteProduct(item._id);
//       });
//       //Agregamos el evento al boton de actualizar:
//       card.querySelector(".btn-actualizar").addEventListener("click", () => {
//         const div = document.createElement("div");
//         div.classList.add("containerUpdateProduct");

//         div.innerHTML = `
//       <form id="updateForm>
//       <input type="text" id="titleUpdate" placeholder="Titulo" />
//       <input type="text" id="descriptionUpdate" placeholder="Descripcion" />
//       <input type="number" id="priceUpdate" placeholder="Precio" />
//       <input type="text" id="imgUpdate" value="Sin Imagen" />
//       <input type="text" id="codeUpdate" placeholder="Código" />
//       <input type="number" id="stockUpdate" placeholder="StockUpdate" />
//       <input type="text" id="categoryUpdate" placeholder="Categoria" />
//       <select id="statusUpdate">
//         <option value="true"> Activo </option>
//         <option value="false"> Inactivo </option>
//       </select>
//       <button type="button" id="btnUpdateProduct"> Enviar </button>
//     </form>
//                         `;

//         containerProducts.appendChild(div);

//         const updateForm = document.getElementById("updateForm");
//         const btnUpdateProduct = updateForm.querySelector("#btnUpdateProduct");

//         btnUpdateProduct.addEventListener("click", () => {
//           const titleUpdate = updateForm.querySelector("#titleUpdate").value;
//           const descriptionUpdate =
//             updateForm.querySelector("#descriptionUpdate").value;
//           const priceUpdate = updateForm.querySelector("#priceUpdate").value;
//           const imgUpdate = updateForm.querySelector("#imgUpdate").value;
//           const codeUpdate = updateForm.querySelector("#codeUpdate").value;
//           const stockUpdate = updateForm.querySelector("#stock").value;
//           const categoryUpdate =
//             updateForm.querySelector("#categoryUpdate").value;
//           const statusUpdate =
//             updateForm.querySelector("#statusUpdate").value === "true";

//           const arrayUpdateProduct = {
//             titleUpdate,
//             descriptionUpdate,
//             priceUpdate,
//             imgUpdate,
//             codeUpdate,
//             stockUpdate,
//             categoryUpdate,
//             statusUpdate,
//           };
//           return arrayUpdateProduct;
//         });

//         updateProduct(item._id, arrayUpdateProduct);
//         console.log(
//           "Botón de actualización clickeado para el producto con ID:",
//           item._id,
//           arrayUpdateProduct
//         );
//       });
//     });
//   } else {
//     console.error("No se encontraron productos en los datos recibidos.");
//   }
// };

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};
const updateProduct = (id, productUpdate) => {
  console.log(
    "Botón de actualización clickeado para el producto con ID:",
    id,
    productUpdate
  );
  socket.emit("updateProduct", id, productUpdate);
};

//Agregamos productos del formulario:

document.getElementById("btnEnviar").addEventListener("click", () => {
  addProduct();
});

const addProduct = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
  };

  socket.emit("addProduct", product);
};
