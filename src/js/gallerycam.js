document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const emptyPhotosMsg = document.getElementById('empty-gallery-msg');
    const videosGrid = document.getElementById('videos-grid');
    const emptyVideosMsg = document.getElementById('empty-videos-msg');

    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');
    const modalDeleteText = document.getElementById('modal-delete-text');

    let currentSelectedId = null;
    let currentMediaType = 'photo'; // 'photo' o 'video'
    let activeObjectUrls = [];

    // Abrir conexión a IndexedDB (Versión 2 con soporte para fotos y videos)
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('NorthBaseDB', 2);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('gallery_photos')) {
                    db.createObjectStore('gallery_photos', { keyPath: 'id', autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('gallery_videos')) {
                    db.createObjectStore('gallery_videos', { keyPath: 'id', autoIncrement: true });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Cargar y mostrar todas las fotos guardadas
    async function loadPhotos() {
        if (!galleryGrid) return;
        try {
            const db = await openDB();
            const tx = db.transaction('gallery_photos', 'readonly');
            const store = tx.objectStore('gallery_photos');
            const request = store.getAll();

            request.onsuccess = () => {
                const photos = request.result.reverse(); // Más recientes primero

                // Limpiar fotos anteriores del DOM
                galleryGrid.querySelectorAll('.gallery-photo-card').forEach(card => card.remove());

                if (!photos || photos.length === 0) {
                    if (emptyPhotosMsg) emptyPhotosMsg.classList.remove('hidden');
                    return;
                }

                if (emptyPhotosMsg) emptyPhotosMsg.classList.add('hidden');

                photos.forEach(photo => {
                    const card = document.createElement('div');
                    card.className = 'gallery-photo-card aspect-square md:aspect-[4/3] lg:aspect-[16/10] bg-white border border-slate-200 shadow-xl shadow-black/25 hover:shadow-2xl hover:shadow-black/35 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:scale-[1.02] cursor-pointer group relative';

                    card.innerHTML = `
                        <img src="${photo.src}" alt="Foto AR" class="w-full h-full object-cover group-hover:brightness-105 transition-all" />
                        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span class="text-white text-xs font-['Poppins',sans-serif] drop-shadow-md">${photo.date || ''}</span>
                        </div>
                    `;

                    // Al hacer click, abrir foto en grande en el modal
                    card.addEventListener('click', () => {
                        currentSelectedId = photo.id;
                        currentMediaType = 'photo';

                        if (modalVideo) {
                            modalVideo.pause();
                            modalVideo.src = '';
                            modalVideo.classList.add('hidden');
                        }
                        if (modalImg) {
                            modalImg.src = photo.src;
                            modalImg.classList.remove('hidden');
                        }
                        if (modalDeleteText) modalDeleteText.textContent = 'Eliminar foto';
                        modal.classList.remove('hidden');
                    });

                    galleryGrid.appendChild(card);
                });
            };
        } catch (err) {
            console.error('Error al cargar fotos de la galería:', err);
        }
    }

    // Cargar y mostrar todos los videos guardados
    async function loadVideos() {
        if (!videosGrid) return;
        try {
            const db = await openDB();
            const tx = db.transaction('gallery_videos', 'readonly');
            const store = tx.objectStore('gallery_videos');
            const request = store.getAll();

            request.onsuccess = () => {
                const videos = request.result.reverse(); // Más recientes primero

                // Limpiar videos anteriores del DOM
                videosGrid.querySelectorAll('.gallery-video-card').forEach(card => card.remove());

                if (!videos || videos.length === 0) {
                    if (emptyVideosMsg) emptyVideosMsg.classList.remove('hidden');
                    return;
                }

                if (emptyVideosMsg) emptyVideosMsg.classList.add('hidden');

                videos.forEach(video => {
                    let videoUrl = '';
                    if (video.blob instanceof Blob) {
                        videoUrl = URL.createObjectURL(video.blob);
                        activeObjectUrls.push(videoUrl);
                    } else if (typeof video.src === 'string') {
                        videoUrl = video.src;
                    }

                    const card = document.createElement('div');
                    card.className = 'gallery-video-card aspect-square md:aspect-[4/3] lg:aspect-[16/10] bg-black border border-slate-200 shadow-xl shadow-black/25 hover:shadow-2xl hover:shadow-black/35 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:scale-[1.02] cursor-pointer group relative';

                    card.innerHTML = `
                        <video src="${videoUrl}" preload="metadata" muted playsinline class="w-full h-full object-cover group-hover:brightness-105 transition-all"></video>
                        <!-- Icono central de Play -->
                        <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all flex items-center justify-center pointer-events-none">
                            <div class="w-12 h-12 rounded-full bg-white/85 group-hover:bg-white text-[#C1121F] flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 pl-0.5">
                                <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            </div>
                        </div>
                        <!-- Fechas y duración -->
                        <div class="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                            <span class="text-white text-[11px] font-['Poppins',sans-serif] drop-shadow-md bg-black/60 px-2 py-0.5 rounded-full">${video.date || ''}</span>
                            ${video.duration ? `<span class="text-white text-[11px] font-['Poppins',sans-serif] drop-shadow-md bg-red-600/90 px-2 py-0.5 rounded-full font-bold">${video.duration}s</span>` : ''}
                        </div>
                    `;

                    // Al hacer click, abrir video en el modal
                    card.addEventListener('click', () => {
                        currentSelectedId = video.id;
                        currentMediaType = 'video';

                        if (modalImg) {
                            modalImg.src = '';
                            modalImg.classList.add('hidden');
                        }
                        if (modalVideo) {
                            modalVideo.src = videoUrl;
                            modalVideo.classList.remove('hidden');
                            modalVideo.play().catch(e => console.warn('Autoplay bloqueado:', e));
                        }
                        if (modalDeleteText) modalDeleteText.textContent = 'Eliminar video';
                        modal.classList.remove('hidden');
                    });

                    videosGrid.appendChild(card);
                });
            };
        } catch (err) {
            console.error('Error al cargar videos de la galería:', err);
        }
    }

    // Función para refrescar toda la galería
    function refreshGallery() {
        loadPhotos();
        loadVideos();
    }

    // Eliminar foto o video seleccionado
    if (modalDeleteBtn) {
        modalDeleteBtn.addEventListener('click', async () => {
            if (!currentSelectedId) return;
            const storeName = currentMediaType === 'video' ? 'gallery_videos' : 'gallery_photos';

            try {
                const db = await openDB();
                const tx = db.transaction(storeName, 'readwrite');
                tx.objectStore(storeName).delete(currentSelectedId);
                tx.oncomplete = () => {
                    closeModal();
                    refreshGallery();
                };
            } catch (err) {
                console.error(`Error al eliminar ${currentMediaType}:`, err);
            }
        });
    }

    function closeModal() {
        if (modal) modal.classList.add('hidden');
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = '';
            modalVideo.classList.add('hidden');
        }
        if (modalImg) {
            modalImg.src = '';
            modalImg.classList.add('hidden');
        }
        currentSelectedId = null;
    }

    // Cerrar modal con botón o clic fuera
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Cargar la galería completa al inicio
    refreshGallery();
});
