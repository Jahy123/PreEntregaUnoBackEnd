function deleteProduct(_id) {
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
