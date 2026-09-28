document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    const closeBtn = document.getElementById('modal-close-btn');
    const filterBtns = document.querySelectorAll('.filter-circle-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Definición de los 5 filtros visuales
    const FILTERS = {
        'pixelated': 'url(#pixelate) contrast(120%)',
        'thermal': 'invert(100%) hue-rotate(240deg) saturate(350%) contrast(160%)',
        'smooth': 'blur(1.0px) contrast(96%) brightness(104%) saturate(100%)', // NUEVO: Filtro de suavizado
        'unfocused': 'blur(8px) brightness(105%)',
        'high-sat': 'saturate(300%) contrast(125%)'
    };


    let activeFilter = 'none';

    // Función auxiliar para aplicar filtros al medio actual (imagen o video)
    const applyFilter = (filterStyle) => {
        activeFilter = filterStyle;
        if (modalImg) modalImg.style.filter = filterStyle;
        if (modalVideo) modalVideo.style.filter = filterStyle;
    };

    // Función para limpiar el estado de los botones
    const clearButtonStyles = () => {
        filterBtns.forEach(b => {
            b.classList.remove('bg-white', 'border-[#C1121F]', 'scale-125', 'shadow-2xl');
            b.classList.add('bg-white/80', 'border-white');
        });
    };


    // Abrir Modal al hacer clic en una foto o video
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const video = item.querySelector('video');

            // Resetear filtros al abrir una nueva vista
            clearButtonStyles();
            applyFilter('none');

            if (img) {
                if (modalVideo) {
                    modalVideo.pause();
                    modalVideo.classList.add('hidden');
                }
                modalImg.src = img.src;
                modalImg.classList.remove('hidden');
                modal.classList.remove('hidden');
            } else if (video) {
                if (modalImg) {
                    modalImg.classList.add('hidden');
                }
                modalVideo.src = video.src;
                modalVideo.classList.remove('hidden');
                modalVideo.play();
                modal.classList.remove('hidden');
            }
        });
    });

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

    // Control de los botones de filtro
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
