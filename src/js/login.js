// ==========================================
// INICIO DE SESIÓN - FRONTEND
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    const loginForms = [
        document.getElementById('login-form-mobile'),
        document.getElementById('login-form-desktop')
    ].filter(Boolean);

    loginForms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.textContent : 'Ingresar';

            const formData = new FormData(form);
            const email = (formData.get('email') || '').trim();
            const password = formData.get('password') || '';

            if (!email || !password) {
                showFormMessage(form, 'Por favor ingresa tu correo y contraseña.', true);
                return;
            }

            // Estado de carga
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Ingresando...';
                submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Credenciales incorrectas.');
                }

                // Guardar sesión
                setAuthSession(data.user, data.token);

                showFormMessage(form, '¡Bienvenido de vuelta! Redirigiendo...', false);

                setTimeout(() => {
                    window.location.href = './home.html';
                }, 1000);

            } catch (err) {
                console.error('Error al iniciar sesión:', err);
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
