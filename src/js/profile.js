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
    // 5. Configurar listeners del modal de visualización
    const closeBtn = document.getElementById('close-collectible-modal');
    const modal = document.getElementById('collectible-modal');
    if (closeBtn) closeBtn.addEventListener('click', closeCollectibleModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeCollectibleModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCollectibleModal();
    });
});

// Renderizar las cartas reales obtenidas con tamaño amplio y nítido
function renderUserCollectibles(container, items) {
    container.innerHTML = '';
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'w-full bg-white border-2 border-amber-300/80 hover:border-[#FCBF49] rounded-2xl shadow-md hover:shadow-xl hover:shadow-amber-500/20 p-2.5 sm:p-3.5 flex flex-col items-center justify-between transition-all duration-300 hover:-translate-y-1.5 cursor-pointer group relative overflow-hidden select-none';

        card.innerHTML = `
            <!-- Indicador brillante -->
            <div class="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse z-10"></div>
            
            <!-- Imagen SVG del coleccionable en tamaño grande y nítido -->
            <div class="w-full aspect-square flex items-center justify-center bg-[#003049]/5 rounded-xl p-1 sm:p-1.5 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <img src="${item.imagen_url || './src/assets/trophy icon.png'}" 
                     alt="${item.nombre}" 
                     class="w-full h-full object-contain drop-shadow-md" />
            </div>

            <!-- Título y pie de la tarjeta -->
            <div class="w-full mt-2 flex flex-col items-center">
                <h3 class="font-['Poppins',sans-serif] font-bold text-xs sm:text-sm text-slate-900 leading-tight line-clamp-1 text-center group-hover:text-[#C1121F] transition-colors" title="${item.nombre}">
                    ${item.nombre}
                </h3>
                <div class="flex items-center justify-between w-full mt-2 pt-1.5 border-t border-slate-100">
                    <span class="text-[9px] sm:text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                        ${item.tipo || 'Coleccionable'}
                    </span>
                </div>
            </div>
        `;

        // Abrir en grande al hacer clic
        card.addEventListener('click', () => openCollectibleModal(item));

        container.appendChild(card);
    });
}

// Abrir modal con imagen en grande
function openCollectibleModal(item) {
    const modal = document.getElementById('collectible-modal');
    const modalContent = document.getElementById('collectible-modal-content');
    const modalImg = document.getElementById('modal-card-img');
    const modalTag = document.getElementById('modal-card-tag');
    const modalName = document.getElementById('modal-card-name');
    const modalDesc = document.getElementById('modal-card-desc');
    const modalDate = document.getElementById('modal-card-date');

    if (!modal) return;

    if (modalImg) modalImg.src = item.imagen_url || './src/assets/trophy icon.png';
    if (modalTag) modalTag.textContent = (item.tipo || 'COLECCIONABLE').toUpperCase();
    if (modalName) modalName.textContent = item.nombre || 'Coleccionable NorthBase';
    if (modalDesc) modalDesc.textContent = item.descripcion || 'Coleccionable oficial de la Zona Norte.';

    if (modalDate) {
        if (item.fecha_desbloqueo) {
            try {
                const date = new Date(item.fecha_desbloqueo);
                modalDate.textContent = `Desbloqueado el ${date.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}`;
            } catch (e) {
                modalDate.textContent = 'Coleccionable Desbloqueado';
            }
        } else {
            modalDate.textContent = 'Coleccionable Desbloqueado';
        }
    }

    modal.classList.remove('hidden', 'opacity-0', 'pointer-events-none');
    modal.classList.add('flex', 'opacity-100', 'pointer-events-auto');
    if (modalContent) {
        modalContent.classList.remove('scale-95');
        modalContent.classList.add('scale-100');
    }
}

// Cerrar modal
function closeCollectibleModal() {
    const modal = document.getElementById('collectible-modal');
    const modalContent = document.getElementById('collectible-modal-content');
    if (!modal) return;

    if (modalContent) {
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
    }
    modal.classList.remove('opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    setTimeout(() => {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }, 250);
}

// Renderizar espacios vacíos/bloqueados cuando el usuario recién empieza
function renderEmptyCollectibles(container, message) {
    container.innerHTML = `
        <div class="w-full bg-white/60 border-2 border-dashed border-orange-300 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col items-center justify-center text-center transition-all hover:border-orange-500 hover:scale-[1.02] cursor-pointer group">
            <div class="w-12 h-12 sm:w-14 sm:h-14 mb-2 rounded-xl bg-orange-100/70 flex items-center justify-center text-orange-500 text-xl font-bold">
                ?
            </div>
            <span class="font-['Poppins',sans-serif] font-bold text-xs sm:text-sm text-slate-700">Coleccionable</span>
            <span class="text-[10px] text-slate-500 mt-0.5">Juega Trivia</span>
        </div>

        <div class="w-full bg-white/60 border-2 border-dashed border-orange-300 rounded-2xl shadow-sm p-4 sm:p-5 flex flex-col items-center justify-center text-center transition-all hover:border-orange-500 hover:scale-[1.02] cursor-pointer group">
            <div class="w-12 h-12 sm:w-14 sm:h-14 mb-2 rounded-xl bg-orange-100/70 flex items-center justify-center text-orange-500 text-xl font-bold">
                ?
            </div>
            <span class="font-['Poppins',sans-serif] font-bold text-xs sm:text-sm text-slate-700">Coleccionable</span>
            <span class="text-[10px] text-slate-500 mt-0.5">Juega Memorama</span>
        </div>
    `;

    if (message) {
        const hint = document.createElement('p');
        hint.className = 'col-span-full text-center text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-4 font-normal';
        hint.textContent = message;
        container.appendChild(hint);
    }
}

