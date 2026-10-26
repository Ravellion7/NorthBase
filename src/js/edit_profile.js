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

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Verificar si hay un usuario logueado
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    if (!user) {
        alert('Debes iniciar sesión para editar tu perfil.');
        window.location.href = './login.html';
        return;
    }

    // Elementos del formulario
    const titleEl = document.getElementById('edit-profile-username');
    const avatarImg = document.getElementById('edit-profile-avatar');
    const avatarHiddenInput = document.getElementById('foto_perfil');
    const form = document.getElementById('edit-profile-form');
    const nameInput = document.getElementById('name');
    const fatherInput = document.getElementById('father_last_name');
    const motherInput = document.getElementById('mother_last_name');
    const emailInput = document.getElementById('email');
    const teamSelect = document.getElementById('favorite_team');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirm_password');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

    // Elementos del Modal de Avatares
    const modal = document.getElementById('avatar-picker-modal');
    const closeModalBtn = document.getElementById('close-avatar-modal');
    const confirmModalBtn = document.getElementById('confirm-avatar-selection-btn');
    const modalTeamTabs = document.getElementById('modal-team-tabs');
    const modalActiveTeamName = document.getElementById('modal-active-team-name');
    const modalAvatarsGrid = document.getElementById('modal-avatars-grid');
    const modalPreviewCurrent = document.getElementById('modal-preview-current');
    const modalSelectedText = document.getElementById('modal-selected-avatar-text');
    const openModalBtns = document.querySelectorAll('.open-avatar-modal-btn');

    // Estado del avatar seleccionado
    let currentSelectedAvatar = user.foto_perfil || '';
    let tempSelectedAvatar = currentSelectedAvatar;
    let modalActiveTabKey = user.equipo_favorito || 'sultanes';

    // Función para actualizar la imagen mostrada en la pantalla
    function updateAvatarView(url) {
        if (avatarImg) {
            avatarImg.src = url || './src/assets/default profile.png';
        }
        if (avatarHiddenInput) {
            avatarHiddenInput.value = url || '';
        }
    }

    // Pre-llenado inicial rápido con los datos de localStorage
    if (titleEl) titleEl.textContent = user.nombre || 'Usuario';
    if (nameInput) nameInput.value = user.nombre || '';
    if (emailInput) emailInput.value = user.email || '';
    if (teamSelect && user.equipo_favorito) teamSelect.value = user.equipo_favorito;
    if (currentSelectedAvatar) updateAvatarView(currentSelectedAvatar);

    // 2. Consultar datos completos al backend MySQL
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
                if (teamSelect && dbUser.equipo_favorito) {
                    teamSelect.value = dbUser.equipo_favorito;
                    modalActiveTabKey = dbUser.equipo_favorito;
                }
                if (dbUser.foto_perfil) {
                    currentSelectedAvatar = dbUser.foto_perfil;
                    tempSelectedAvatar = dbUser.foto_perfil;
                    updateAvatarView(dbUser.foto_perfil);
                }
            }
        }
    } catch (err) {
        console.warn('No se pudieron obtener los datos completos del servidor:', err);
    }

    // ==========================================
    // LÓGICA DEL MODAL DE SELECCIÓN DE AVATAR
    // ==========================================

    function openModal() {
        if (!modal) return;

        // Si el usuario seleccionó un equipo en el dropdown, abrir esa pestaña por defecto
        if (teamSelect && teamSelect.value && TEAM_AVATARS_MAP[teamSelect.value]) {
            modalActiveTabKey = teamSelect.value;
        }

        tempSelectedAvatar = currentSelectedAvatar || (TEAM_AVATARS_MAP[modalActiveTabKey]?.avatars[0]);

        renderModalTeamTabs();
        renderModalAvatars();
        updateModalPreview();

        modal.classList.remove('hidden');
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 200);
    }

    function updateModalPreview() {
        if (modalPreviewCurrent) {
            modalPreviewCurrent.src = tempSelectedAvatar || './src/assets/default profile.png';
        }
        if (modalSelectedText) {
            const activeTeam = TEAM_AVATARS_MAP[modalActiveTabKey];
            modalSelectedText.textContent = activeTeam ? activeTeam.shortName : 'Avatar seleccionado';
        }
    }

    function renderModalTeamTabs() {
        if (!modalTeamTabs) return;
        modalTeamTabs.innerHTML = '';

        Object.keys(TEAM_AVATARS_MAP).forEach(key => {
            const team = TEAM_AVATARS_MAP[key];
            const isActive = (key === modalActiveTabKey);

            const tabBtn = document.createElement('button');
            tabBtn.type = 'button';
            tabBtn.title = team.name;
            tabBtn.setAttribute('aria-label', team.name);
            tabBtn.className = `w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center p-1.5 sm:p-2 transition-all cursor-pointer shrink-0 border ${isActive
                    ? 'bg-[#FCBF49] border-[#FCBF49] shadow-lg scale-110 ring-2 ring-white/60'
                    : 'bg-white/10 border-white/20 hover:bg-white/25 hover:scale-105'
                }`;

            tabBtn.innerHTML = `
                <img src="${team.logo}" alt="${team.shortName}" class="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-sm transition-transform" />
            `;

            tabBtn.addEventListener('click', () => {
                modalActiveTabKey = key;
                renderModalTeamTabs();
                renderModalAvatars();
            });

            modalTeamTabs.appendChild(tabBtn);
        });

        if (modalActiveTeamName && TEAM_AVATARS_MAP[modalActiveTabKey]) {
            modalActiveTeamName.textContent = TEAM_AVATARS_MAP[modalActiveTabKey].name;
        }
    }

    function renderModalAvatars() {
        if (!modalAvatarsGrid) return;
        modalAvatarsGrid.innerHTML = '';

        const activeTeam = TEAM_AVATARS_MAP[modalActiveTabKey];
        if (!activeTeam) return;

        activeTeam.avatars.forEach((avatarUrl, idx) => {
            const isSelected = (tempSelectedAvatar === avatarUrl);

            const avatarBtn = document.createElement('button');
            avatarBtn.type = 'button';
            avatarBtn.className = `group relative rounded-full p-1 transition-all cursor-pointer flex items-center justify-center ${isSelected
                    ? 'ring-4 ring-[#FCBF49] scale-110 shadow-lg'
                    : 'hover:scale-105 opacity-80 hover:opacity-100 ring-2 ring-transparent'
                }`;

            avatarBtn.innerHTML = `
                <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-white bg-slate-900 shadow">
                    <img src="${avatarUrl}" alt="Avatar ${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                ${isSelected ? '<span class="absolute -top-1 -right-1 bg-[#C1121F] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold border border-white shadow">✓</span>' : ''}
            `;

            avatarBtn.addEventListener('click', () => {
                tempSelectedAvatar = avatarUrl;
                updateModalPreview();
                renderModalAvatars();
            });

            modalAvatarsGrid.appendChild(avatarBtn);
        });
    }

    // Listeners del Modal
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (confirmModalBtn) {
        confirmModalBtn.addEventListener('click', () => {
            currentSelectedAvatar = tempSelectedAvatar;
            updateAvatarView(currentSelectedAvatar);
            closeModal();
        });
    }

    // Cerrar al hacer clic en el backdrop oscuro
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // ==========================================
    // 3. MANEJAR ACTUALIZACIÓN AL ENVIAR FORMULARIO
    // ==========================================
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

            const avatarToSend = currentSelectedAvatar || (avatarHiddenInput ? avatarHiddenInput.value : '');

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
                        foto_perfil: avatarToSend || undefined,
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

                // Actualizar avatares en la barra de navegación inmediata
                document.querySelectorAll('a[href*="profile.html"] img').forEach(img => {
                    img.src = result.user.foto_perfil || './src/assets/default profile.png';
                });

                showFormMessage(form, '¡Perfil actualizado con éxito!', false);

                // Redirigir a profile.html tras breve espera
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
