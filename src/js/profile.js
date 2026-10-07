// ==========================================
// NORTHBASE - GESTIÓN DE PERFIL DE USUARIO
// ==========================================

const TEAM_INFO_MAP = {
    sultanes: { name: 'Sultanes de Monterrey', logo: './src/assets/Sultanes logo.png' },
    acereros: { name: 'Acereros de Monclova', logo: './src/assets/acereros logo.png' },
    algodoneros: { name: 'Algodoneros de Unión Laguna', logo: './src/assets/algodoneros logo.png' },
    caliente: { name: 'Caliente de Durango', logo: './src/assets/calientes logo.png' },
    charros: { name: 'Charros de Jalisco', logo: './src/assets/Charros logo.png' },
    dorados: { name: 'Dorados de Chihuahua', logo: './src/assets/dorados logo.png' },
    rieleros: { name: 'Rieleros de Aguascalientes', logo: './src/assets/rieleros logo.png' },
    saraperos: { name: 'Saraperos de Saltillo', logo: './src/assets/saraperos logo.png' },
    tecos: { name: 'Tecos de los Dos Laredos', logo: './src/assets/tecos logo.png' },
    toros: { name: 'Toros de Tijuana', logo: './src/assets/toros logo.png' }
};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Obtener usuario actual
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const badgeContainer = document.getElementById('profile-badge-container');
    const collectiblesContainer = document.getElementById('collectibles-container');
    const logoutBtn = document.getElementById('profile-logout-btn');

    // Botón de cerrar sesión
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout('./index.html');
        });
    }

    // 2. Si no ha iniciado sesión
    if (!user) {
        if (nameEl) nameEl.textContent = 'Invitado';
        if (emailEl) emailEl.textContent = 'Inicia sesión para guardar tu progreso';
        if (badgeContainer) {
            badgeContainer.innerHTML = `
                <a href="./login.html" 
                   class="mt-2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#C1121F] text-white text-xs font-semibold hover:bg-[#9b0e19] transition shadow-md">
                   Iniciar Sesión
                </a>
            `;
        }
        renderEmptyCollectibles(collectiblesContainer, 'Inicia sesión para ver tus coleccionables');
        return;
    }

    // 3. Pintar datos del usuario
    if (nameEl) {
        nameEl.textContent = user.nombre || user.nombre_usuario || 'Fanático del Béisbol';
    }

    if (emailEl) {
        emailEl.textContent = user.email || '';
    }

    // Badge de equipo favorito
    if (badgeContainer) {
        const teamKey = (user.equipo_favorito || '').toLowerCase();
        const teamData = TEAM_INFO_MAP[teamKey];

        if (teamData) {
            badgeContainer.innerHTML = `
                <div class="mt-2.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold shadow-sm">
                    <img src="${teamData.logo}" alt="${teamData.name}" class="w-4 h-4 object-contain" />
                    <span>${teamData.name}</span>
                </div>
            `;
        } else {
            badgeContainer.innerHTML = `
                <div class="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-medium border border-white/15">
                    ⚾ Fan Zona Norte
                </div>
            `;
        }
    }

    // 4. Cargar coleccionables desde la API de MySQL
    if (collectiblesContainer) {
        try {
            const res = await fetch(`${API_BASE_URL}/collectibles/user/${user.id_usuario}`);
            if (res.ok) {
                const data = await res.json();
                const items = data.collectibles || [];

                if (items.length > 0) {
                    renderUserCollectibles(collectiblesContainer, items);
                } else {
                    renderEmptyCollectibles(collectiblesContainer, 'Aún no tienes cartas desbloqueadas. ¡Juega trivias o el memorama para conseguirlas!');
                }
            } else {
                renderEmptyCollectibles(collectiblesContainer);
            }
        } catch (err) {
            console.warn('No se pudieron consultar los coleccionables del servidor:', err);
            renderEmptyCollectibles(collectiblesContainer);
        }
    }
});

// Renderizar las cartas reales obtenidas
function renderUserCollectibles(container, items) {
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'aspect-[3/4] max-w-[140px] sm:max-w-[150px] md:max-w-[160px] w-full mx-auto bg-gradient-to-b from-white to-slate-100 border-2 border-amber-500 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 p-3 flex flex-col items-center justify-between text-center transition-all hover:scale-105 cursor-pointer relative overflow-hidden group';

        card.innerHTML = `
            <div class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
            <div class="w-12 h-12 sm:w-14 sm:h-14 mt-2 flex items-center justify-center">
                <img src="${item.imagen_url || './src/assets/trophy icon.png'}" 
                     alt="${item.nombre}" 
                     class="max-w-full max-h-full object-contain drop-shadow" />
            </div>
            <div class="w-full">
                <h3 class="font-['Poppins',sans-serif] font-bold text-[11px] sm:text-xs text-slate-900 leading-tight line-clamp-2">
                    ${item.nombre}
                </h3>
                <span class="block text-[9px] text-amber-700 font-semibold uppercase tracking-wider mt-1">
                    ${item.tipo || 'Coleccionable'}
                </span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Renderizar espacios vacíos/bloqueados cuando el usuario recién empieza
function renderEmptyCollectibles(container, message) {
    container.innerHTML = `
        <div class="aspect-[3/4] max-w-[130px] sm:max-w-[150px] md:max-w-[160px] w-full mx-auto bg-white/40 border-2 border-dashed border-orange-400 rounded-2xl shadow-md p-3 flex flex-col items-center justify-center text-center transition-all hover:border-orange-500 hover:scale-[1.02] cursor-pointer group">
            <span class="font-['Poppins',sans-serif] font-bold text-[11px] text-slate-700">Carta 1</span>
            <span class="text-[9px] text-slate-500 mt-0.5">Juega Trivia</span>
        </div>

        <div class="aspect-[3/4] max-w-[130px] sm:max-w-[150px] md:max-w-[160px] w-full mx-auto bg-white/40 border-2 border-dashed border-orange-400 rounded-2xl shadow-md p-3 flex flex-col items-center justify-center text-center transition-all hover:border-orange-500 hover:scale-[1.02] cursor-pointer group">
            <span class="font-['Poppins',sans-serif] font-bold text-[11px] text-slate-700">Carta 2</span>
            <span class="text-[9px] text-slate-500 mt-0.5">Juega Memorama</span>
        </div>
    `;

    if (message) {
        const hint = document.createElement('p');
        hint.className = 'col-span-full text-center text-xs text-slate-500 max-w-sm mx-auto mt-2 font-normal';
        hint.textContent = message;
        container.appendChild(hint);
    }
}
