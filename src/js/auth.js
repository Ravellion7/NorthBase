// ==========================================
// NORTHBASE - UTILIDADES DE AUTENTICACIÓN
// ==========================================

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Obtener el usuario autenticado actualmente almacenado en localStorage
 */
function getCurrentUser() {
    try {
        const userJson = localStorage.getItem('northbase_user');
        return userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        return null;
    }
}

/**
 * Guardar datos de sesión en localStorage
 */
function setAuthSession(user, token) {
    if (user) localStorage.setItem('northbase_user', JSON.stringify(user));
    if (token) localStorage.setItem('northbase_token', token);
}

/**
 * Cerrar sesión del usuario
 */
function logout(redirectUrl = './index.html') {
    localStorage.removeItem('northbase_user');
    localStorage.removeItem('northbase_token');
    window.location.href = redirectUrl;
}

/**
 * Verificar si hay sesión activa
 */
function isAuthenticated() {
    return !!localStorage.getItem('northbase_token') && !!localStorage.getItem('northbase_user');
}

/**
 * Función genérica para mostrar mensajes de retroalimentación
 */
function showFormMessage(formElement, message, isError = true) {
    let msgContainer = formElement.querySelector('.auth-msg-container');
    if (!msgContainer) {
        msgContainer = document.createElement('div');
        msgContainer.className = 'auth-msg-container w-full p-2.5 rounded-xl text-center text-xs font-medium font-[\'Poppins\',sans-serif] transition-all';
        formElement.prepend(msgContainer);
    }

    msgContainer.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'border-red-300', 'bg-emerald-100', 'text-emerald-800', 'border-emerald-300');
    
    if (isError) {
        msgContainer.classList.add('bg-red-100', 'text-red-700', 'border', 'border-red-300');
        msgContainer.innerHTML = `⚠️ ${message}`;
    } else {
        msgContainer.classList.add('bg-emerald-100', 'text-emerald-800', 'border', 'border-emerald-300');
        msgContainer.innerHTML = `✓ ${message}`;
    }
}
