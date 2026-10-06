// ==========================================
// REGISTRO DE USUARIOS - FRONTEND
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const registerForms = [
        document.getElementById('register-form-mobile'),
        document.getElementById('register-form-desktop')
    ].filter(Boolean);

    registerForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Registrar';

            // Extraer campos del formulario
            const formData = new FormData(form);
            const name = (formData.get('name') || '').trim();
            const father_last_name = (formData.get('father_last_name') || '').trim();
            const mother_last_name = (formData.get('mother_last_name') || '').trim();
            const email = (formData.get('email') || '').trim();
            const favorite_team = formData.get('favorite_team') || '';
            const password = formData.get('password') || '';
            const confirm_password = formData.get('confirm_password') || '';

            // Validar contraseñas iguales
            if (password !== confirm_password) {
                showFormMessage(form, 'Las contraseñas no coinciden. Por favor verifícalas.', true);
                return;
            }

            if (password.length < 6) {
                showFormMessage(form, 'La contraseña debe contener al menos 6 caracteres.', true);
                return;
            }

            // Estado de carga en el botón
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Registrando...';
                submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name,
                        father_last_name,
                        mother_last_name,
                        email,
                        password,
                        favorite_team
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'No se pudo completar el registro.');
                }

                // Guardar sesión automáticamente
                setAuthSession(data.user, data.token);

                // Feedback visual de éxito
                showFormMessage(form, '¡Cuenta creada con éxito! Redirigiendo...', false);

                // Redirigir a Home
                setTimeout(() => {
                    window.location.href = './home.html';
                }, 1200);

            } catch (err) {
                console.error('Error al registrar usuario:', err);
                showFormMessage(form, err.message, true);

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                    submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
                }
            }
        });
    });
});
