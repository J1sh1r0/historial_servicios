document.addEventListener('DOMContentLoaded', function () {
    fetch('../includes/obtener_usuarios.php')
        .then(response => response.json())
        .then(data => mostrarUsuarios(data))
        .catch(error => console.error('Error al obtener usuarios:', error));
});

function mostrarUsuarios(usuarios) {
    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = ''; // Limpiar contenido previo

    if (usuarios.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="6">
                    <div class="empty-state-content">
                        <div class="empty-state-icon">👥</div>
                        <h3>No hay usuarios registrados</h3>
                        <p>No se ha agregado ningún usuario aún.</p>
                    </div>
                </td>
            </tr>`;
        return;
    }

    usuarios.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.nombre_completo}</td>
            <td>${usuario.rol}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.telefono}</td>
            <td>
                <button class="btn-permisos">Ver</button>
            </td>
            <td>
                <button class="btn-editar" onclick="editarUsuario(${usuario.id})">Editar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function editarUsuario(id) {
    window.location.href = `PermisosYDatosUsuario.html?id=${id}`;
}

