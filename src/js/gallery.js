document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    const modalCanvas = document.getElementById('modal-canvas');
    const closeBtn = document.getElementById('modal-close-btn');
    const filterBtns = document.querySelectorAll('.filter-circle-btn');
    const downloadBtn = document.getElementById('modal-download-btn');
    const downloadText = document.getElementById('modal-download-text');
    const videoProgressOverlay = document.getElementById('video-progress-overlay');
    const videoProgressBar = document.getElementById('video-progress-bar');
    const videoProgressPercent = document.getElementById('video-progress-percent');
    const videoProgressStatus = document.getElementById('video-progress-status');
    const cancelVideoRenderBtn = document.getElementById('cancel-video-render-btn');

    let currentIsVideo = false;
    let videoPixelAnimId = null;
    let videoRenderCancelled = false;
    let activeVideoRecorder = null;
    let activeProcessingVideo = null;

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

    // Actualizar imagen de cabecera, botón de regreso y título
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

    // Definición de los filtros de cámara estándar (CSS)
    const FILTERS = {
        'thermal': 'invert(100%) hue-rotate(240deg) saturate(350%) contrast(160%)',
        'smooth': 'blur(0.8px) contrast(96%) brightness(104%) saturate(108%)',
        'unfocused': 'blur(8px) brightness(105%)',
        'high-sat': 'saturate(300%) contrast(125%)'
    };

    const FILTER_NAMES = {
        'none': '',
        'pixelated': 'Pixelado',
        'thermal': 'Térmico',
        'smooth': 'Suavizado',
        'unfocused': 'Desenfocado',
        'high-sat': 'Alta Saturación'
    };

    let activeFilter = 'none';

    function updateDownloadButtonText() {
        if (!downloadText) return;
        if (!activeFilter || activeFilter === 'none') {
            downloadText.textContent = currentIsVideo ? 'Descargar Video' : 'Descargar Foto';
        } else {
            const name = FILTER_NAMES[activeFilter] || activeFilter;
            downloadText.textContent = `Descargar con Filtro (${name})`;
        }
    }

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
            updateDownloadButtonText();
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
        updateDownloadButtonText();
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
        updateDownloadButtonText();

        if (isVideo) {
            if (modalImg) modalImg.classList.add('hidden');
            modalVideo.crossOrigin = 'anonymous';
            modalVideo.src = src;
            modalVideo.classList.remove('hidden', 'opacity-0');
            modalVideo.play();
        } else {
            if (modalVideo) {
                modalVideo.pause();
                modalVideo.classList.add('hidden');
            }
            modalImg.crossOrigin = 'anonymous';
            modalImg.src = src;
            modalImg.classList.remove('hidden');
        }
        modal.classList.remove('hidden');
    };

    // Renderizar Fotos Dinámicamente
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

    // Renderizar Videos Dinámicamente
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

    // Cancelar cualquier renderizado activo de video
    const cancelActiveVideoRender = () => {
        videoRenderCancelled = true;
        if (activeVideoRecorder && activeVideoRecorder.state === 'recording') {
            try { activeVideoRecorder.stop(); } catch (e) { }
        }
        if (activeProcessingVideo) {
            try {
                activeProcessingVideo.pause();
                activeProcessingVideo.removeAttribute('src');
                activeProcessingVideo.load();
            } catch (e) { }
        }
        activeProcessingVideo = null;
        activeVideoRecorder = null;
        if (videoProgressOverlay) videoProgressOverlay.classList.add('hidden');
    };

    // Cerrar Modal
    const closeModal = () => {
        cancelActiveVideoRender();
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

    // Utilidad para disparar la descarga de un Blob o URL
    function triggerDownload(urlOrBlob, filename) {
        const isBlob = urlOrBlob instanceof Blob;
        const url = isBlob ? URL.createObjectURL(urlOrBlob) : urlOrBlob;
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            if (isBlob) URL.revokeObjectURL(url);
        }, 2000);
    }

    // Descarga de fotos con el filtro aplicado
    function downloadPhoto() {
        if (!modalImg || !modalImg.src) return;

        const filterSuffix = (activeFilter && activeFilter !== 'none') ? `_${activeFilter}` : '';
        const filename = `${teamKey}_foto${filterSuffix}.jpg`;

        const naturalW = modalImg.naturalWidth || modalImg.width || 800;
        const naturalH = modalImg.naturalHeight || modalImg.height || 600;

        // Si no hay filtro, descargar la imagen limpia
        if (!activeFilter || activeFilter === 'none') {
            const canvas = document.createElement('canvas');
            canvas.width = naturalW;
            canvas.height = naturalH;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(modalImg, 0, 0, naturalW, naturalH);
            canvas.toBlob((blob) => {
                if (blob) {
                    triggerDownload(blob, filename);
                } else {
                    triggerDownload(modalImg.src, filename);
                }
            }, 'image/jpeg', 0.95);
            return;
        }

        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = naturalW;
        exportCanvas.height = naturalH;
        const ctx = exportCanvas.getContext('2d');

        if (activeFilter === 'pixelated') {
            const blockSize = Math.max(12, Math.round(naturalW / 55));
            const smallW = Math.max(16, Math.floor(naturalW / blockSize));
            const smallH = Math.max(16, Math.floor(naturalH / blockSize));

            const smallCanvas = document.createElement('canvas');
            smallCanvas.width = smallW;
            smallCanvas.height = smallH;
            const smallCtx = smallCanvas.getContext('2d');
            smallCtx.drawImage(modalImg, 0, 0, smallW, smallH);

            ctx.imageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
            ctx.filter = 'contrast(120%) saturate(110%)';
            ctx.drawImage(smallCanvas, 0, 0, naturalW, naturalH);
        } else {
            ctx.filter = FILTERS[activeFilter] || 'none';
            ctx.drawImage(modalImg, 0, 0, naturalW, naturalH);
        }

        exportCanvas.toBlob((blob) => {
            if (blob) {
                triggerDownload(blob, filename);
            } else {
                console.error('Error al generar blob de la imagen con filtro');
            }
        }, 'image/jpeg', 0.95);
    }

    // Descarga de videos con el filtro renderizado cuadro a cuadro
    async function downloadVideo() {
        if (!modalVideo || !modalVideo.src) return;

        const filterSuffix = (activeFilter && activeFilter !== 'none') ? `_${activeFilter}` : '';

        // Si no hay filtro, descarga instantánea del archivo original
        if (!activeFilter || activeFilter === 'none') {
            triggerDownload(modalVideo.src, `${teamKey}_video.mp4`);
            return;
        }

        videoRenderCancelled = false;
        if (videoProgressOverlay) {
            videoProgressOverlay.classList.remove('hidden');
            if (videoProgressBar) videoProgressBar.style.width = '0%';
            if (videoProgressPercent) videoProgressPercent.textContent = '0%';
            if (videoProgressStatus) videoProgressStatus.textContent = 'Preparando video para procesamiento...';
        }

        const procVideo = document.createElement('video');
        activeProcessingVideo = procVideo;
        procVideo.crossOrigin = 'anonymous';
        procVideo.src = modalVideo.currentSrc || modalVideo.src;
        procVideo.muted = true;
        procVideo.playsInline = true;
        procVideo.preload = 'auto';

        const cleanup = () => {
            if (videoProgressOverlay) videoProgressOverlay.classList.add('hidden');
            if (procVideo) {
                procVideo.pause();
                procVideo.removeAttribute('src');
                procVideo.load();
            }
            activeProcessingVideo = null;
            activeVideoRecorder = null;
        };

        if (cancelVideoRenderBtn) {
            cancelVideoRenderBtn.onclick = () => {
                cancelActiveVideoRender();
            };
        }

        await new Promise((resolve) => {
            procVideo.onloadeddata = resolve;
            procVideo.onerror = resolve;
            setTimeout(resolve, 3500);
        });

        if (videoRenderCancelled) return cleanup();

        const vidW = procVideo.videoWidth || modalVideo.videoWidth || 640;
        const vidH = procVideo.videoHeight || modalVideo.videoHeight || 360;
        const duration = procVideo.duration || modalVideo.duration || 5;

        const procCanvas = document.createElement('canvas');
        procCanvas.width = vidW;
        procCanvas.height = vidH;
        const ctx = procCanvas.getContext('2d');

        const blockSize = Math.max(10, Math.round(vidW / 50));
        const smallW = Math.max(16, Math.floor(vidW / blockSize));
        const smallH = Math.max(16, Math.floor(vidH / blockSize));
        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = smallW;
        smallCanvas.height = smallH;
        const smallCtx = smallCanvas.getContext('2d');

        const stream = procCanvas.captureStream(30);

        // Pasar audio sin que suene en altavoces del usuario
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                const audioCtx = new AudioContextClass();
                const audioSource = audioCtx.createMediaElementSource(procVideo);
                const audioDest = audioCtx.createMediaStreamDestination();
                audioSource.connect(audioDest);
                const aTracks = audioDest.stream.getAudioTracks();
                if (aTracks.length > 0) {
                    stream.addTrack(aTracks[0]);
                }
                procVideo.muted = false;
            }
        } catch (err) {
            procVideo.muted = true;
        }

        let mimeType = 'video/mp4;codecs=avc1';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/mp4';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

        const chunks = [];
        let recorder = null;
        try {
            recorder = mimeType
                ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 3500000 })
                : new MediaRecorder(stream);
        } catch (e) {
            recorder = new MediaRecorder(stream);
        }
        activeVideoRecorder = recorder;

        const ext = (recorder.mimeType && recorder.mimeType.includes('mp4')) ? 'mp4' : 'webm';
        const filename = `${teamKey}_video${filterSuffix}.${ext}`;

        recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
            if (!videoRenderCancelled && chunks.length > 0) {
                const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
                triggerDownload(blob, filename);
            }
            cleanup();
        };

        if (videoProgressStatus) {
            videoProgressStatus.textContent = 'Renderizando video con el filtro aplicado...';
        }

        recorder.start(100);
        procVideo.currentTime = 0;

        try {
            await procVideo.play();
        } catch (e) {
            console.warn('Error al reproducir procVideo:', e);
        }

        let animId = null;

        function renderStep() {
            if (videoRenderCancelled) {
                if (animId) cancelAnimationFrame(animId);
                return;
            }

            if (procVideo.paused || procVideo.ended || procVideo.currentTime >= (duration - 0.05)) {
                if (videoProgressBar) videoProgressBar.style.width = '100%';
                if (videoProgressPercent) videoProgressPercent.textContent = '100%';
                if (videoProgressStatus) videoProgressStatus.textContent = '¡Finalizando y descargando!';

                setTimeout(() => {
                    if (recorder && recorder.state === 'recording') {
                        recorder.stop();
                    }
                }, 300);
                return;
            }

            const progress = Math.min(98, Math.round((procVideo.currentTime / duration) * 100));
            if (videoProgressBar) videoProgressBar.style.width = `${progress}%`;
            if (videoProgressPercent) videoProgressPercent.textContent = `${progress}%`;

            if (activeFilter === 'pixelated') {
                smallCtx.drawImage(procVideo, 0, 0, smallW, smallH);
                ctx.imageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.filter = 'contrast(120%) saturate(110%)';
                ctx.drawImage(smallCanvas, 0, 0, vidW, vidH);
            } else {
                ctx.filter = FILTERS[activeFilter] || 'none';
                ctx.drawImage(procVideo, 0, 0, vidW, vidH);
            }

            animId = requestAnimationFrame(renderStep);
        }

        renderStep();
    }

    // Botón de Descarga
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentIsVideo) {
                downloadVideo();
            } else {
                downloadPhoto();
            }
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
