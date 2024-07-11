function deleteUser(_id) {
  fetch(`/api/users/${_id}`, { method: "DELETE" })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function modifyUserRole(event, _id) {
  event.preventDefault(); // Prevenir que el formulario se envíe de forma predeterminada
  const role = document.getElementById(`role-${_id}`).value;

  fetch(`/api/users/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: role }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al actualizar el usuario");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
