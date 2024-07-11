console.log("products.js cargado");

function deleteProduct(cartId, productId) {
  console.log(
    "Intentando eliminar el producto con ID:",
    productId,
    "del carrito con ID:",
    cartId
  ); // Añadir este log

  fetch(`/api/carts/${cartId}/products/${productId}`, { method: "DELETE" })
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
