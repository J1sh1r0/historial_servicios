document.addEventListener("DOMContentLoaded", () => {
  const btnGuardar = document.querySelector(".login-button");
  if (!btnGuardar) return;

 btnGuardar.addEventListener("click", async (event) => {
  event.preventDefault(); // ⛔️ Esto evita que se recargue o envíe el form

  const userId = new URLSearchParams(window.location.search).get("id");

  const plantillasSeleccionadas = Array.from(
    document.querySelectorAll('input[name="plantillas[]"]:checked')
  ).map(c => c.value);

  try {
    console.log("Enviando a PHP:", {
      id: userId,
      plantillas: plantillasSeleccionadas.join(",")
    });

    const response = await fetch("../includes/actualizar_plantillas.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: userId,
        plantillas: plantillasSeleccionadas.join(",")
      })
    });

    const result = await response.json();

    if (response.ok) {
      mostrarMensaje("✅ Permisos actualizados correctamente.", "success");
    } else {
      mostrarMensaje("❌ Error al actualizar: " + result.error, "danger");
    }
  } catch (error) {
    mostrarMensaje("❌ Error de conexión: " + error.message, "danger");
  }
});

});

function mostrarMensaje(texto, tipo = "success") {
  const div = document.createElement("div");
  div.className = `alert alert-${tipo}`;
  div.textContent = texto;
  div.style.position = "fixed";
  div.style.top = "10px";
  div.style.right = "10px";
  div.style.zIndex = "9999";
  div.style.padding = "10px";
  div.style.borderRadius = "5px";
  div.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  div.style.backgroundColor = tipo === "success" ? "#d4edda" : "#f8d7da";
  div.style.color = tipo === "success" ? "#155724" : "#721c24";

  document.body.appendChild(div);

  setTimeout(() => {
    div.remove();
  }, 3000);
}
