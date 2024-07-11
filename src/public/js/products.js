console.log("products.js cargado");
function deleteProduct(_id) {
  console.log("Intentando eliminar el producto con ID:", _id); // Añadir este log
  fetch(`/api/products/${_id}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al eliminar el producto");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
