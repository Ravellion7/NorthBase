document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    const modalCanvas = document.getElementById('modal-canvas');
    const closeBtn = document.getElementById('modal-close-btn');
    const filterBtns = document.querySelectorAll('.filter-circle-btn');

    let currentIsVideo = false;
    let videoPixelAnimId = null;

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

        // Desbloquear ID 28 (Tony DeFrancesco) al explorar la galería de al menos 3 equipos
        try {
            const visitedGalleries = new Set(JSON.parse(localStorage.getItem('northbase_visited_galleries') || '[]'));
            visitedGalleries.add(teamKey);
            localStorage.setItem('northbase_visited_galleries', JSON.stringify([...visitedGalleries]));

            if (visitedGalleries.size >= 3 && typeof awardCollectible === 'function') {
                setTimeout(() => {
                    awardCollectible(28);
                }, 600);
            }
        } catch (e) {
            console.warn('Error al registrar galería de equipo visitada:', e);
        }
    }

    // 3. Definición de los filtros de cámara estándar (CSS)
    const FILTERS = {
        'thermal': 'invert(100%) hue-rotate(240deg) saturate(350%) contrast(160%)',
        'smooth': 'blur(0.8px) contrast(96%) brightness(104%) saturate(108%)',
        'unfocused': 'blur(8px) brightness(105%)',
        'high-sat': 'saturate(300%) contrast(125%)'
    };

    let activeFilter = 'none';

    // Detener y resetear pixelado
    function stopPixelation() {
        if (videoPixelAnimId) {
            cancelAnimationFrame(videoPixelAnimId);
            videoPixelAnimId = null;
        }
        if (modalCanvas) {
            modalCanvas.classList.add('hidden');
            modalCanvas.style.position = '';
            modalCanvas.style.inset = '';
            modalCanvas.style.margin = '';
            modalCanvas.style.width = '';
            modalCanvas.style.height = '';
            modalCanvas.style.pointerEvents = '';
        }
        if (modalImg && !currentIsVideo) {
            modalImg.classList.remove('hidden');
        }
        if (modalVideo && currentIsVideo) {
            modalVideo.classList.remove('opacity-0');
        }
    }

    // Renderizar pixelado auténtico 8-bit para Fotos
    function renderPixelatedImage() {
        if (!modalImg || !modalCanvas) return;
        const naturalW = modalImg.naturalWidth || modalImg.width || 600;
        const naturalH = modalImg.naturalHeight || modalImg.height || 400;

        modalCanvas.width = naturalW;
        modalCanvas.height = naturalH;

        // Tamaño de bloque de píxel: crea bloques visibles estilo retro auténtico
        const blockSize = Math.max(12, Math.round(naturalW / 55));
        const smallW = Math.max(16, Math.floor(naturalW / blockSize));
        const smallH = Math.max(16, Math.floor(naturalH / blockSize));

        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = smallW;
        smallCanvas.height = smallH;
        const smallCtx = smallCanvas.getContext('2d');
        smallCtx.drawImage(modalImg, 0, 0, smallW, smallH);

        const ctx = modalCanvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.msImageSmoothingEnabled = false;
        ctx.drawImage(smallCanvas, 0, 0, naturalW, naturalH);

        modalImg.classList.add('hidden');
        modalCanvas.classList.remove('hidden');
        modalCanvas.style.filter = 'contrast(120%) saturate(110%)';
    }

    // Renderizar pixelado auténtico a 60 FPS para Videos
    function startPixelatedVideo() {
        if (!modalVideo || !modalCanvas) return;
        const vidW = modalVideo.videoWidth || 640;
        const vidH = modalVideo.videoHeight || 360;

        modalCanvas.width = vidW;
        modalCanvas.height = vidH;

        const blockSize = Math.max(10, Math.round(vidW / 50));
        const smallW = Math.max(16, Math.floor(vidW / blockSize));
        const smallH = Math.max(16, Math.floor(vidH / blockSize));

        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = smallW;
        smallCanvas.height = smallH;
        const smallCtx = smallCanvas.getContext('2d');
        const ctx = modalCanvas.getContext('2d');

        // Posicionar el canvas de forma absoluta sobre el video
        // para que no comparta el espacio horizontal dentro del contenedor flex
        modalCanvas.style.position = 'absolute';
        modalCanvas.style.inset = '0';
        modalCanvas.style.margin = 'auto';
        modalCanvas.style.width = '100%';
        modalCanvas.style.height = '100%';
        modalCanvas.style.pointerEvents = 'none';

        modalCanvas.classList.remove('hidden');
        modalVideo.classList.add('opacity-0');
        modalCanvas.style.filter = 'contrast(120%) saturate(110%)';

        function renderFrame() {
            if (activeFilter !== 'pixelated') return;

            if (!modalVideo.paused && !modalVideo.ended) {
                smallCtx.drawImage(modalVideo, 0, 0, smallW, smallH);
                ctx.imageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.mozImageSmoothingEnabled = false;
                ctx.msImageSmoothingEnabled = false;
                ctx.drawImage(smallCanvas, 0, 0, vidW, vidH);
            }
            videoPixelAnimId = requestAnimationFrame(renderFrame);
        }

        renderFrame();
    }

    const applyFilter = (filterKey) => {
        stopPixelation();

        if (!filterKey || filterKey === 'none') {
            activeFilter = 'none';
            if (modalImg) modalImg.style.filter = 'none';
            if (modalVideo) modalVideo.style.filter = 'none';
            return;
        }

        activeFilter = filterKey;

        if (filterKey === 'pixelated') {
            if (modalImg) modalImg.style.filter = 'none';
            if (modalVideo) modalVideo.style.filter = 'none';

            if (currentIsVideo) {
                startPixelatedVideo();
            } else {
                renderPixelatedImage();
            }
        } else {
            const cssStyle = FILTERS[filterKey] || 'none';
            if (modalImg) modalImg.style.filter = cssStyle;
            if (modalVideo) modalVideo.style.filter = cssStyle;
        }
    };

    const clearButtonStyles = () => {
        filterBtns.forEach(b => {
            b.classList.remove('bg-white', 'border-[#C1121F]', 'scale-125', 'shadow-2xl');
            b.classList.add('bg-white/80', 'border-white');
        });
    };

    // Función para abrir el modal con el elemento multimedia clickeado
    const openMediaModal = (src, isVideo) => {
        currentIsVideo = isVideo;
        clearButtonStyles();
        stopPixelation();
        applyFilter('none');

        if (isVideo) {
            if (modalImg) modalImg.classList.add('hidden');
            modalVideo.src = src;
            modalVideo.classList.remove('hidden', 'opacity-0');
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
        stopPixelation();
        applyFilter('none');
        clearButtonStyles();
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = "";
            modalVideo.classList.remove('opacity-0');
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
            const isCurrentlyActive = (activeFilter === filterKey);

            clearButtonStyles();

            if (isCurrentlyActive) {
                applyFilter('none');
            } else {
                btn.classList.remove('bg-white/80', 'border-white');
                btn.classList.add('bg-white', 'border-[#C1121F]', 'scale-125', 'shadow-2xl');
                applyFilter(filterKey);
            }
        });
    });
});
