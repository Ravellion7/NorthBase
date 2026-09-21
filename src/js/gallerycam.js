document.addEventListener('DOMContentLoaded', () => {
    const galleryGrid = document.getElementById('gallery-grid');
    const emptyMsg = document.getElementById('empty-gallery-msg');
    const modal = document.getElementById('photo-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');

    let currentSelectedId = null;

    // Abrir conexión a IndexedDB
    function openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('NorthBaseDB', 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('gallery_photos')) {
                    db.createObjectStore('gallery_photos', { keyPath: 'id', autoIncrement: true });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Cargar y mostrar todas las fotos guardadas
    async function loadGallery() {
        try {
            const db = await openDB();
            const tx = db.transaction('gallery_photos', 'readonly');
            const store = tx.objectStore('gallery_photos');
            const request = store.getAll();

            request.onsuccess = () => {
                const photos = request.result.reverse(); // Más recientes primero

                if (!photos || photos.length === 0) {
                    if (emptyMsg) emptyMsg.classList.remove('hidden');
                    return;
                }

                if (emptyMsg) emptyMsg.classList.add('hidden');

                // Limpiar fotos anteriores
                galleryGrid.querySelectorAll('.gallery-card').forEach(card => card.remove());

                // Crear tarjeta para cada foto
                photos.forEach(photo => {
                    const card = document.createElement('div');
                    card.className = 'gallery-card aspect-square md:aspect-[4/3] lg:aspect-[16/10] bg-white border border-slate-200 shadow-xl shadow-black/25 hover:shadow-2xl hover:shadow-black/35 rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:scale-[1.02] cursor-pointer group relative';

                    card.innerHTML = `
                        <img src="${photo.src}" alt="Foto AR" class="w-full h-full object-cover group-hover:brightness-105 transition-all" />
                        <div class="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span class="text-white text-xs font-['Poppins',sans-serif] drop-shadow-md">${photo.date || ''}</span>
                        </div>
                    `;

                    // Al hacer click, abrir foto en grande
                    card.addEventListener('click', () => {
                        currentSelectedId = photo.id;
                        modalImg.src = photo.src;
                        modal.classList.remove('hidden');
                    });

                    galleryGrid.appendChild(card);
                });
            };
        } catch (err) {
            console.error('Error al cargar la galería:', err);
        }
    }

    // Eliminar foto seleccionada
    if (modalDeleteBtn) {
        modalDeleteBtn.addEventListener('click', async () => {
            if (!currentSelectedId) return;
            try {
                const db = await openDB();
                const tx = db.transaction('gallery_photos', 'readwrite');
                tx.objectStore('gallery_photos').delete(currentSelectedId);
                tx.oncomplete = () => {
                    modal.classList.add('hidden');
                    loadGallery(); // Recargar grid
                };
            } catch (err) {
                console.error('Error al eliminar foto:', err);
            }
        });
    }

    // Cerrar modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    // Cargar la galería al inicio
    loadGallery();
});
