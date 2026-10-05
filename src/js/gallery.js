document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    const closeBtn = document.getElementById('modal-close-btn');
    const filterBtns = document.querySelectorAll('.filter-circle-btn');

    const teamTitleImg = document.getElementById('gallery-team-img');
    const backBtn = document.getElementById('gallery-back-btn');
    const photosGrid = document.getElementById('photos-grid');
    const videosGrid = document.getElementById('videos-grid');

    // 1. Obtener el equipo actual desde la URL (?team=...)
    const urlParams = new URLSearchParams(window.location.search);
    const teamKey = (urlParams.get('team') || 'sultanes').toLowerCase();
    const teamData = (typeof TEAMS_DATABASE !== 'undefined' && TEAMS_DATABASE[teamKey])
        ? TEAMS_DATABASE[teamKey]
        : (typeof TEAMS_DATABASE !== 'undefined' ? TEAMS_DATABASE['sultanes'] : null);

    // 2. Actualizar imagen de cabecera, botón de regreso y título
    if (teamData) {
        if (teamTitleImg) {
            teamTitleImg.src = teamData.titleImage;
            teamTitleImg.alt = teamData.name;
        }
        if (backBtn) {
            backBtn.href = `./sultanes.html?team=${teamKey}`;
        }
        document.title = `NorthBase - Galería ${teamData.name}`;
    }

    // 3. Definición de los 5 filtros de cámara
    const FILTERS = {
        'pixelated': 'url(#pixelate) contrast(120%)',
        'thermal': 'invert(100%) hue-rotate(240deg) saturate(350%) contrast(160%)',
        'smooth': 'blur(0.8px) contrast(96%) brightness(104%) saturate(108%)',
        'unfocused': 'blur(8px) brightness(105%)',
        'high-sat': 'saturate(300%) contrast(125%)'
    };

    let activeFilter = 'none';

    const applyFilter = (filterStyle) => {
        activeFilter = filterStyle;
        if (modalImg) modalImg.style.filter = filterStyle;
        if (modalVideo) modalVideo.style.filter = filterStyle;
    };

    const clearButtonStyles = () => {
        filterBtns.forEach(b => {
            b.classList.remove('bg-white', 'border-[#C1121F]', 'scale-125', 'shadow-2xl');
            b.classList.add('bg-white/80', 'border-white');
        });
    };

    // Función para abrir el modal con el elemento multimedia clickeado
    const openMediaModal = (src, isVideo) => {
        clearButtonStyles();
        applyFilter('none');

        if (isVideo) {
            if (modalImg) modalImg.classList.add('hidden');
            modalVideo.src = src;
            modalVideo.classList.remove('hidden');
            modalVideo.play();
        } else {
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.classList.add('hidden');
            }
            modalImg.src = src;
            modalImg.classList.remove('hidden');
        }
        modal.classList.remove('hidden');
    };

    // 4. Renderizar Fotos Dinámicamente
    if (photosGrid && teamData) {
        photosGrid.innerHTML = '';
        const photos = teamData.photos || [];

        if (photos.length > 0) {
            photos.forEach((photoSrc, idx) => {
                const card = document.createElement('div');
                card.className = 'gallery-item aspect-square md:aspect-[4/3] lg:aspect-[16/10] shadow-xl shadow-black/25 hover:shadow-2xl hover:shadow-black/35 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:scale-[1.02] cursor-pointer group';
                card.innerHTML = `<img src="${photoSrc}" alt="${teamData.name} Foto ${idx + 1}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />`;
                card.addEventListener('click', () => openMediaModal(photoSrc, false));
                photosGrid.appendChild(card);
            });
        } else {
            photosGrid.innerHTML = `
                <div class="col-span-full py-8 text-center text-slate-400 font-['Poppins',sans-serif] text-xs sm:text-sm">
                    Próximamente fotografías de ${teamData.name}.
                </div>
            `;
        }
    }

    // 5. Renderizar Videos Dinámicamente
    if (videosGrid && teamData) {
        videosGrid.innerHTML = '';
        const videos = teamData.videos || [];

        if (videos.length > 0) {
            videos.forEach((videoSrc) => {
                const card = document.createElement('div');
                card.className = 'gallery-item aspect-square md:aspect-[4/3] lg:aspect-[16/10] shadow-xl shadow-black/25 hover:shadow-2xl hover:shadow-black/35 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:scale-[1.02] cursor-pointer group relative bg-black';
                card.innerHTML = `
                    <video src="${videoSrc}" muted playsinline class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"></video>
                    <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-black fill-current ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                `;
                card.addEventListener('click', () => openMediaModal(videoSrc, true));
                videosGrid.appendChild(card);
            });
        } else {
            videosGrid.innerHTML = `
                <div class="col-span-full py-8 text-center text-slate-400 font-['Poppins',sans-serif] text-xs sm:text-sm">
                    Próximamente videos de ${teamData.name}.
                </div>
            `;
        }
    }

    // Cerrar Modal
    const closeModal = () => {
        modal.classList.add('hidden');
        applyFilter('none');
        clearButtonStyles();
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = "";
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    // Control de los 5 botones de filtro
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const filterKey = btn.getAttribute('data-filter');
            const targetFilterStyle = FILTERS[filterKey] || 'none';
            const isCurrentlyActive = (activeFilter === targetFilterStyle);

            clearButtonStyles();

            if (isCurrentlyActive) {
                applyFilter('none');
                console.log('Filtro desactivado (Normal)');
            } else {
                btn.classList.remove('bg-white/80', 'border-white');
                btn.classList.add('bg-white', 'border-[#C1121F]', 'scale-125', 'shadow-2xl');
                applyFilter(targetFilterStyle);
                console.log(`Filtro aplicado: ${filterKey}`);
            }
        });
    });
});
