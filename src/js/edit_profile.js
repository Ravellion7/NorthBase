// ==========================================
// NORTHBASE - EDITAR PERFIL DE USUARIO
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificar si hay un usuario logueado
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    if (!user) {
        alert('Debes iniciar sesión para editar tu perfil.');
        window.location.href = './login.html';
        return;
    }

    const titleEl = document.getElementById('edit-profile-username');
    const form = document.getElementById('edit-profile-form');
    const nameInput = document.getElementById('name');
    const fatherInput = document.getElementById('father_last_name');
    const motherInput = document.getElementById('mother_last_name');
    const emailInput = document.getElementById('email');
    const teamSelect = document.getElementById('favorite_team');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm_password');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    // Pre-llenado inicial rápido con los datos de localStorage
    if (titleEl) titleEl.textContent = user.nombre || 'Usuario';
    if (nameInput) nameInput.value = user.nombre || '';
    if (emailInput) emailInput.value = user.email || '';
    if (teamSelect && user.equipo_favorito) teamSelect.value = user.equipo_favorito;

    // 2. Consultar datos completos a la base de datos MySQL
    try {
        const res = await fetch(`${API_BASE_URL}/auth/user/${user.id_usuario}`);
        if (res.ok) {
            const data = await res.json();
            const dbUser = data.user;
            if (dbUser) {
                if (titleEl) {
                    titleEl.textContent = dbUser.nombre || dbUser.nombre_usuario || user.nombre;
                }
                if (nameInput && dbUser.nombre) nameInput.value = dbUser.nombre;
                if (fatherInput && dbUser.apellido_paterno) fatherInput.value = dbUser.apellido_paterno;
                if (motherInput && dbUser.apellido_materno) motherInput.value = dbUser.apellido_materno;
                if (emailInput && dbUser.email) emailInput.value = dbUser.email;
                if (teamSelect && dbUser.equipo_favorito) teamSelect.value = dbUser.equipo_favorito;
            }
        }
    } catch (err) {
        console.warn('No se pudieron obtener los datos completos del servidor:', err);
    }

    // 3. Manejar actualización al enviar el formulario
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = (nameInput ? nameInput.value : '').trim();
            const father_last_name = (fatherInput ? fatherInput.value : '').trim();
            const mother_last_name = (motherInput ? motherInput.value : '').trim();
            const email = (emailInput ? emailInput.value : '').trim();
            const favorite_team = teamSelect ? teamSelect.value : '';
            const password = passwordInput ? passwordInput.value : '';
            const confirm_password = confirmInput ? confirmInput.value : '';

            // Validaciones básicas
            if (!name || !email) {
                showFormMessage(form, 'El nombre y el correo son obligatorios.', true);
                return;
            }

            // Si desea cambiar la contraseña
            if (password.length > 0) {
                if (password !== confirm_password) {
                    showFormMessage(form, 'Las contraseñas no coinciden. Por favor verifícalas.', true);
                    return;
                }
                if (password.length < 6) {
                    showFormMessage(form, 'La nueva contraseña debe tener al menos 6 caracteres.', true);
                    return;
                }
            }

            // Estado de carga
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Actualizar';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Guardando...';
                submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/profile`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id_usuario: user.id_usuario,
                        name,
                        father_last_name,
                        mother_last_name,
                        email,
                        favorite_team,
                        password: password.length > 0 ? password : undefined
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'No se pudo actualizar el perfil.');
                }

                // Actualizar sesión local con los nuevos datos
                const token = localStorage.getItem('northbase_token');
                setAuthSession(result.user, token);

                showFormMessage(form, '¡Perfil actualizado con éxito! Redirigiendo...', false);

                // Redirigir a profile.html
                setTimeout(() => {
                    window.location.href = './profile.html';
                }, 1000);

            } catch (err) {
                console.error('Error al actualizar perfil:', err);
                showFormMessage(form, err.message, true);

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                }
            }
        });
    }
});
