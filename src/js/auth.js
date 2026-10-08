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

// ==========================================
// SISTEMA DE COLECCIONABLES Y LOGROS
// ==========================================

/**
 * Desbloquear un coleccionable para el usuario actual y disparar notificación dorada
 * @param {number|string} collectibleId - ID numérico del coleccionable en la base de datos
 * @returns {Promise<Object|null>}
 */
async function awardCollectible(collectibleId) {
    const user = getCurrentUser();
    if (!user || !user.id_usuario) {
        console.log(`[NorthBase Coleccionables] Usuario no autenticado. Coleccionable #${collectibleId} pendiente.`);
        return null;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/collectibles/unlock`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_usuario: user.id_usuario,
                id_coleccionable: Number(collectibleId)
            })
        });

        if (!response.ok) {
            console.error('Error al otorgar coleccionable:', await response.text());
            return null;
        }

        const data = await response.json();

        // Mostrar la notificación dorada únicamente si es un logro nuevo
        if (data.success && data.isNew && data.collectible) {
            showCollectibleToast(data.collectible);
        }

        return data;
    } catch (error) {
        console.error('Error de red al intentar desbloquear coleccionable:', error);
        return null;
    }
}

/**
 * Notificación emergente dorada de desbloqueo de coleccionable
 * @param {Object} collectible - Datos del coleccionable ({ id_coleccionable, nombre, descripcion, tipo, imagen_url })
 */
function showCollectibleToast(collectible) {
    if (!collectible) return;

    let container = document.getElementById('northbase-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'northbase-toast-container';
        container.className = 'fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-[92vw] sm:max-w-md pointer-events-none select-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto transform translate-y-10 opacity-0 transition-all duration-500 ease-out flex items-center gap-3.5 p-4 rounded-2xl bg-[#003049]/95 text-white border-2 border-[#FCBF49] shadow-[0_12px_35px_-5px_rgba(247,127,0,0.45),0_0_22px_2px_rgba(252,191,73,0.35)] backdrop-blur-md relative overflow-hidden font-[\'Poppins\',sans-serif]';

    const cardImage = collectible.imagen_url || './src/assets/trophy icon.png';
    const cardTitle = collectible.nombre || 'Nuevo Coleccionable';
    const cardType = collectible.tipo ? collectible.tipo.toUpperCase() : 'COLECCIONABLE';

    toast.innerHTML = `
        <!-- Resplandor ambiental con colores de la paleta NorthBase -->
        <div class="absolute -top-12 -right-12 w-32 h-32 bg-[#FCBF49]/20 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-10 -left-10 w-28 h-28 bg-[#C1121F]/25 rounded-full blur-2xl pointer-events-none"></div>

        <!-- Miniatura de la tarjeta con marco degradado (#FCBF49 -> #F77F00 -> #C1121F) -->
        <div class="relative shrink-0 w-14 h-18 sm:w-16 sm:h-20 bg-gradient-to-b from-[#FCBF49] via-[#F77F00] to-[#C1121F] rounded-xl p-[2px] shadow-lg shadow-[#F77F00]/30">
            <div class="w-full h-full bg-[#003049] rounded-[10px] overflow-hidden flex items-center justify-center p-1">
                <img src="${cardImage}" alt="${cardTitle}" class="w-full h-full object-cover rounded-lg" onerror="this.src='./src/assets/trophy icon.png';" />
            </div>
            <div class="absolute -top-1.5 -left-1.5 w-5 h-5 bg-gradient-to-tr from-[#F77F00] to-[#FCBF49] rounded-full flex items-center justify-center shadow text-[10px]">
                ⭐
            </div>
        </div>

        <!-- Información del coleccionable -->
        <div class="flex-1 min-w-0 pr-6">
            <div class="flex items-center gap-1.5 mb-0.5">
                <span class="inline-block w-2 h-2 rounded-full bg-[#F77F00] animate-ping"></span>
                <span class="text-[10px] font-bold tracking-widest text-[#FCBF49] uppercase">
                    ¡COLECCIONABLE DESBLOQUEADO!
                </span>
            </div>
            <h4 class="font-bold text-sm sm:text-base text-white truncate drop-shadow-sm">
                ${cardTitle}
            </h4>
            <p class="text-[11px] text-[#669BBC] font-medium truncate mb-2">
                ${cardType} • Añadido a tu vitrina
            </p>
            <div class="flex items-center gap-2">
                <a href="./profile.html" 
                   class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#C1121F] hover:bg-[#780000] border border-[#FCBF49]/40 text-white font-bold text-xs shadow-md hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer">
                    <span>Ver en Perfil</span>
                    <span class="text-[#FCBF49]">→</span>
                </a>
            </div>
        </div>

        <!-- Botón para descartar -->
        <button type="button" aria-label="Cerrar notificación" 
                class="absolute top-2.5 right-2.5 text-white/50 hover:text-white hover:bg-white/10 rounded-full w-6 h-6 flex items-center justify-center transition-colors text-xs cursor-pointer">
            ✕
        </button>
    `;

    const dismiss = () => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    };

    const closeBtn = toast.querySelector('button');
    if (closeBtn) closeBtn.addEventListener('click', dismiss);

    container.appendChild(toast);

    // Animación fluida de entrada
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
            toast.classList.add('translate-y-0', 'opacity-100');
        });
    });

    // Auto-cierre tras 6.5 segundos
    setTimeout(() => {
        if (toast.isConnected) {
            dismiss();
        }
    }, 6500);
}

