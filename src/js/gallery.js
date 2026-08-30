document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalVideo = document.getElementById('modal-video');
    const closeBtn = document.getElementById('modal-close-btn');
    const filterBtns = document.querySelectorAll('.filter-circle-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Open Modal with clicked image or video
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const video = item.querySelector('video');

            // Reset all circles to default transparent state
            filterBtns.forEach(btn => {
                btn.classList.remove('bg-[#F5F5F5]', 'scale-125', 'shadow-lg');
                btn.classList.add('bg-transparent');
            });

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

    // Close Modal
    const closeModal = () => {
        modal.classList.add('hidden');
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.src = "";
        }
    };
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Circle click handler: toggle/fill with #F5F5F5 and scale up (same as camera.html)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isFilled = btn.classList.contains('bg-[#F5F5F5]');

            // Clear filled state from sibling circles
            filterBtns.forEach(b => {
                b.classList.remove('bg-[#F5F5F5]', 'scale-125', 'shadow-lg');
                b.classList.add('bg-transparent');
            });

            // Toggle active selection
            if (!isFilled) {
                btn.classList.remove('bg-transparent');
                btn.classList.add('bg-[#F5F5F5]', 'scale-125', 'shadow-lg');
            }
        });
    });
});
