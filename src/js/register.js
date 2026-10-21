// ==========================================
// REGISTRO DE USUARIOS - FRONTEND
// ==========================================

// Catálogo oficial de avatares por equipo de la Zona Norte
const TEAM_AVATARS_MAP = {
    sultanes: {
        name: 'Sultanes de Monterrey',
        shortName: 'Sultanes',
        logo: './src/assets/Sultanes logo.png',
        avatars: [
            './src/assets/Profile Pics/Sultanes/sultanes profile pic.jpg',
            './src/assets/Profile Pics/Sultanes/sultanes profile pic2.jpg',
            './src/assets/Profile Pics/Sultanes/sultanes profile pic3.jpg'
        ]
    },
    acereros: {
        name: 'Acereros de Monclova',
        shortName: 'Acereros',
        logo: './src/assets/acereros logo.png',
        avatars: [
            './src/assets/Profile Pics/Acereros/sultanes profile pic.jpg',
            './src/assets/Profile Pics/Acereros/sultanes profile pic2.jpg',
            './src/assets/Profile Pics/Acereros/acereros profile pic3.jpg'
        ]
    },
    algodoneros: {
        name: 'Algodoneros del Unión Laguna',
        shortName: 'Algodoneros',
        logo: './src/assets/algodoneros logo.png',
        avatars: [
            './src/assets/Profile Pics/Algodoneros/algodoneros profile pic.png',
            './src/assets/Profile Pics/Algodoneros/algodoneros profile pic2.png',
            './src/assets/Profile Pics/Algodoneros/algodoneros profile pic3.png'
        ]
    },
    caliente: {
        name: 'Caliente de Durango',
        shortName: 'Caliente',
        logo: './src/assets/calientes logo.png',
        avatars: [
            './src/assets/Profile Pics/Caliente/caliente profile pic.png',
            './src/assets/Profile Pics/Caliente/caliente profile pic2.jpg',
            './src/assets/Profile Pics/Caliente/caliente profile pic3.jpg'
        ]
    },
    charros: {
        name: 'Charros de Jalisco',
        shortName: 'Charros',
        logo: './src/assets/Charros logo.png',
        avatars: [
            './src/assets/Profile Pics/Charros/charros profile pic.png',
            './src/assets/Profile Pics/Charros/charros profile pic2.jpg',
            './src/assets/Profile Pics/Charros/charros profile pic3.jpg'
        ]
    },
    dorados: {
        name: 'Dorados de Chihuahua',
        shortName: 'Dorados',
        logo: './src/assets/dorados logo.png',
        avatars: [
            './src/assets/Profile Pics/Dorados/dorados profile pic.jpg',
            './src/assets/Profile Pics/Dorados/dorados profile pic2.jpg',
            './src/assets/Profile Pics/Dorados/dorados profile pic3.jpg'
        ]
    },
    rieleros: {
        name: 'Rieleros de Aguascalientes',
        shortName: 'Rieleros',
        logo: './src/assets/rieleros logo.png',
        avatars: [
            './src/assets/Profile Pics/Rieleros/rieleros profile pic.png',
            './src/assets/Profile Pics/Rieleros/rieleros profile pic2.png',
            './src/assets/Profile Pics/Rieleros/rieleros profile pic3.jpg'
        ]
    },
    saraperos: {
        name: 'Saraperos de Saltillo',
        shortName: 'Saraperos',
        logo: './src/assets/saraperos logo.png',
        avatars: [
            './src/assets/Profile Pics/Saraperos/saraperos profile pic.jpg',
            './src/assets/Profile Pics/Saraperos/saraperos profile pic2.jpg',
            './src/assets/Profile Pics/Saraperos/saraperos profile pic3.jpg'
        ]
    },
    tecos: {
        name: 'Tecos de los Dos Laredos',
        shortName: 'Tecos',
        logo: './src/assets/tecos logo.png',
        avatars: [
            './src/assets/Profile Pics/Tecos/tecos profile pic.jpg',
            './src/assets/Profile Pics/Tecos/tecos profile pic2.jpg',
            './src/assets/Profile Pics/Tecos/tecos profile pic3.png'
        ]
    },
    toros: {
        name: 'Toros de Tijuana',
        shortName: 'Toros',
        logo: './src/assets/toros logo.png',
        avatars: [
            './src/assets/Profile Pics/Toros/toros profile pic.png',
            './src/assets/Profile Pics/Toros/toros profile pic2.jpeg',
            './src/assets/Profile Pics/Toros/toros profile pic3.jpg'
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Estado del avatar seleccionado
    let activeTeamKey = 'sultanes';
    let currentSelectedAvatar = TEAM_AVATARS_MAP.sultanes.avatars[0];

    // Elementos DOM Mobile
    const mobilePreview = document.getElementById('mobile-avatar-preview');
    const mobileTeamLabel = document.getElementById('mobile-avatar-team-label');
    const mobileThumbnails = document.getElementById('mobile-avatar-thumbnails');
    const mobileHiddenInput = document.getElementById('foto_perfil_mobile');
    const mobileTeamSelect = document.getElementById('favorite-team-mobile');

    // Elementos DOM Desktop
    const desktopPreview = document.getElementById('desktop-avatar-preview');
    const desktopTeamLabel = document.getElementById('desktop-avatar-team-label');
    const desktopThumbnails = document.getElementById('desktop-avatar-thumbnails');
    const desktopHiddenInput = document.getElementById('foto_perfil_desktop');
    const desktopTeamSelect = document.getElementById('favorite-team-desktop');

    // Elementos DOM Modal
    const modal = document.getElementById('avatar-picker-modal');
    const closeModalBtn = document.getElementById('close-avatar-modal');
    const confirmModalBtn = document.getElementById('confirm-avatar-selection-btn');
    const modalTeamTabs = document.getElementById('modal-team-tabs');
    const modalActiveTeamName = document.getElementById('modal-active-team-name');
    const modalAvatarsGrid = document.getElementById('modal-avatars-grid');
    const modalPreviewCurrent = document.getElementById('modal-preview-current');
    const modalSelectedText = document.getElementById('modal-selected-avatar-text');
    const openModalBtns = document.querySelectorAll('.open-avatar-modal-btn');

    let modalActiveTabKey = 'sultanes';

    /**
     * Aplica la selección de un avatar en toda la interfaz (mobile, desktop y modal)
     */
    function setSelectedAvatar(avatarUrl, teamKey = null) {
        currentSelectedAvatar = avatarUrl;

        // Si se especificó o deduce el equipo
        if (teamKey && TEAM_AVATARS_MAP[teamKey]) {
            activeTeamKey = teamKey;
        }

        const teamData = TEAM_AVATARS_MAP[activeTeamKey];

        // 1. Actualizar Mobile
        if (mobilePreview) mobilePreview.src = avatarUrl;
        if (mobileHiddenInput) mobileHiddenInput.value = avatarUrl;
        if (mobileTeamLabel && teamData) mobileTeamLabel.textContent = teamData.name;

        // 2. Actualizar Desktop
        if (desktopPreview) desktopPreview.src = avatarUrl;
        if (desktopHiddenInput) desktopHiddenInput.value = avatarUrl;
        if (desktopTeamLabel && teamData) desktopTeamLabel.textContent = teamData.shortName;

        // 3. Actualizar Modal
        if (modalPreviewCurrent) modalPreviewCurrent.src = avatarUrl;
        if (modalSelectedText && teamData) modalSelectedText.textContent = teamData.shortName;

        // 4. Refrescar anillos visuales en miniaturas
        renderThumbnails();
        if (modal && !modal.classList.contains('hidden')) {
            renderModalAvatars();
        }
    }

    /**
     * Renderiza las 3 miniaturas de acceso rápido para el equipo activo
     */
    function renderThumbnails() {
        const teamData = TEAM_AVATARS_MAP[activeTeamKey];
        if (!teamData) return;

        // Mobile Thumbnails
        if (mobileThumbnails) {
            mobileThumbnails.innerHTML = '';
            teamData.avatars.forEach((avatar, index) => {
                const isSelected = avatar === currentSelectedAvatar;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 transition-all cursor-pointer p-0.5 bg-white ${
                    isSelected
                        ? 'border-[#C1121F] ring-3 ring-[#C1121F]/40 scale-105 shadow-md'
                        : 'border-slate-300 opacity-70 hover:opacity-100 hover:scale-105'
                }`;
                btn.setAttribute('aria-label', `Seleccionar avatar ${index + 1} de ${teamData.name}`);
                btn.innerHTML = `<img src="${avatar}" alt="Avatar ${index + 1}" class="w-full h-full object-cover rounded-full" />`;
                btn.addEventListener('click', () => {
                    setSelectedAvatar(avatar, activeTeamKey);
                });
                mobileThumbnails.appendChild(btn);
            });
        }

        // Desktop Thumbnails
        if (desktopThumbnails) {
            desktopThumbnails.innerHTML = '';
            teamData.avatars.forEach((avatar, index) => {
                const isSelected = avatar === currentSelectedAvatar;
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `w-10 h-10 rounded-full overflow-hidden border-2 transition-all cursor-pointer p-0.5 bg-slate-800 ${
                    isSelected
                        ? 'border-[#FCBF49] ring-2 ring-[#FCBF49]/50 scale-105 shadow-lg'
                        : 'border-white/30 opacity-70 hover:opacity-100 hover:scale-105'
                }`;
                btn.setAttribute('aria-label', `Seleccionar avatar ${index + 1} de ${teamData.name}`);
                btn.innerHTML = `<img src="${avatar}" alt="Avatar ${index + 1}" class="w-full h-full object-cover rounded-full" />`;
                btn.addEventListener('click', () => {
                    setSelectedAvatar(avatar, activeTeamKey);
                });
                desktopThumbnails.appendChild(btn);
            });
        }
    }

    /**
     * Sincroniza el cambio del <select name="favorite_team"> con el avatar del equipo
     */
    function handleTeamChange(newTeamKey) {
        if (!newTeamKey || !TEAM_AVATARS_MAP[newTeamKey]) return;

        activeTeamKey = newTeamKey;
        modalActiveTabKey = newTeamKey;

        // Sincronizar ambos selects
        if (mobileTeamSelect && mobileTeamSelect.value !== newTeamKey) {
            mobileTeamSelect.value = newTeamKey;
        }
        if (desktopTeamSelect && desktopTeamSelect.value !== newTeamKey) {
            desktopTeamSelect.value = newTeamKey;
        }

        // Seleccionar automáticamente el primer avatar de ese equipo
        const teamData = TEAM_AVATARS_MAP[newTeamKey];
        if (teamData && teamData.avatars.length > 0) {
            setSelectedAvatar(teamData.avatars[0], newTeamKey);
        }
    }

    if (mobileTeamSelect) {
        mobileTeamSelect.addEventListener('change', (e) => {
            handleTeamChange(e.target.value);
        });
    }

    if (desktopTeamSelect) {
        desktopTeamSelect.addEventListener('change', (e) => {
            handleTeamChange(e.target.value);
        });
    }

    // ==========================================
    // LÓGICA DEL MODAL DE AVATARES
    // ==========================================

    function openModal() {
        if (!modal) return;
        modalActiveTabKey = activeTeamKey;
        renderModalTabs();
        renderModalAvatars();

        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('opacity-0');
            modal.classList.add('opacity-100');
        });
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('opacity-100');
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200);
    }

    function renderModalTabs() {
        if (!modalTeamTabs) return;
        modalTeamTabs.innerHTML = '';

        Object.keys(TEAM_AVATARS_MAP).forEach(teamKey => {
            const team = TEAM_AVATARS_MAP[teamKey];
            const isActive = teamKey === modalActiveTabKey;

            const tabBtn = document.createElement('button');
            tabBtn.type = 'button';
            tabBtn.title = team.name;
            tabBtn.setAttribute('aria-label', team.name);
            tabBtn.className = `w-12 h-12 sm:w-14 sm:h-14 p-2 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                isActive
                    ? 'active-team-tab bg-white/20 border-2 border-[#FCBF49] shadow-[0_0_14px_rgba(252,191,73,0.6)] scale-110'
                    : 'bg-white/10 hover:bg-white/20 border border-white/20 opacity-70 hover:opacity-100 hover:scale-105'
            }`;

            tabBtn.innerHTML = `
                <img src="${team.logo}" alt="${team.name}" class="w-full h-full object-contain filter drop-shadow" />
            `;

            tabBtn.addEventListener('click', () => {
                modalActiveTabKey = teamKey;
                renderModalTabs();
                renderModalAvatars();
            });

            modalTeamTabs.appendChild(tabBtn);
        });

        // Asegurar que la pestaña activa sea visible haciendo scroll hacia ella
        const activeTabEl = modalTeamTabs.querySelector('.active-team-tab');
        if (activeTabEl) {
            activeTabEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    function renderModalAvatars() {
        if (!modalAvatarsGrid) return;
        const team = TEAM_AVATARS_MAP[modalActiveTabKey];
        if (!team) return;

        if (modalActiveTeamName) {
            modalActiveTeamName.textContent = team.name;
        }

        modalAvatarsGrid.innerHTML = '';

        team.avatars.forEach((avatar, index) => {
            const isSelected = avatar === currentSelectedAvatar;

            const card = document.createElement('div');
            card.className = `flex flex-col items-center p-2 rounded-2xl cursor-pointer transition-all duration-200 group select-none ${
                isSelected
                    ? 'bg-[#FCBF49]/15 border-2 border-[#FCBF49] shadow-lg scale-105'
                    : 'bg-white/5 border border-white/15 hover:bg-white/10 hover:border-white/40 hover:scale-105'
            }`;

            card.innerHTML = `
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 mb-2 p-0.5 ${
                    isSelected ? 'border-[#FCBF49] shadow-md' : 'border-white/40 group-hover:border-white'
                }">
                    <img src="${avatar}" alt="Avatar ${index + 1}" class="w-full h-full object-cover rounded-full" />
                </div>
                <span class="text-[11px] font-semibold text-center ${isSelected ? 'text-[#FCBF49]' : 'text-white/80'}">
                    Avatar ${index + 1}
                </span>
                ${
                    isSelected
                        ? '<span class="mt-1 text-[9px] uppercase tracking-wider font-bold bg-[#FCBF49] text-[#003049] px-2 py-0.5 rounded-full">Activo</span>'
                        : '<span class="mt-1 text-[9px] text-white/50 group-hover:text-white">Elegir</span>'
                }
            `;

            card.addEventListener('click', () => {
                // Si el avatar pertenece a un equipo distinto al favorito actual, sincronizar select también
                setSelectedAvatar(avatar, modalActiveTabKey);
                // Si el usuario aún no había seleccionado equipo favorito o quiere cambiarlo con su avatar
                if (mobileTeamSelect && mobileTeamSelect.value !== modalActiveTabKey) {
                    mobileTeamSelect.value = modalActiveTabKey;
                }
                if (desktopTeamSelect && desktopTeamSelect.value !== modalActiveTabKey) {
                    desktopTeamSelect.value = modalActiveTabKey;
                }
            });

            modalAvatarsGrid.appendChild(card);
        });
    }

    // Eventos de apertura/cierre del modal
    openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (confirmModalBtn) confirmModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Inicialización inicial
    renderThumbnails();

    // ==========================================
    // ENVÍO DE FORMULARIO DE REGISTRO
    // ==========================================
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
            const foto_perfil = formData.get('foto_perfil') || currentSelectedAvatar;

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
                submitBtn.textContent = 'Registrando';
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
                        favorite_team,
                        foto_perfil
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'No se pudo completar el registro.');
                }

                // Guardar sesión automáticamente
                setAuthSession(data.user, data.token);

                // Feedback visual de éxito
                showFormMessage(form, '¡Cuenta creada con éxito!', false);

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
