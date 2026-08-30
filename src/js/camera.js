document.addEventListener('DOMContentLoaded', async () => {
    const video = document.getElementById('camera-stream');
    const statusText = document.getElementById('camera-status');

    try {
        // Request access to the user's camera
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user', // Uses front camera by default
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        // Attach stream to the video element
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            if (statusText) statusText.style.display = 'none';
            video.play();
        };
    } catch (err) {
        console.error("Error al acceder a la cámara:", err);
        if (statusText) {
            statusText.textContent = "Permiso de cámara denegado o no disponible.";
        }
    }

    // Click handler to fill selected circle with #F5F5F5 and scale up
    const circleButtons = document.querySelectorAll('.camera-circle-btn');
    circleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isFilled = btn.classList.contains('bg-[#F5F5F5]');

            // Clear filled and scaled state from siblings in the same group
            btn.parentElement.querySelectorAll('.camera-circle-btn').forEach(b => {
                b.classList.remove('bg-[#F5F5F5]', 'scale-125', 'shadow-lg');
                b.classList.add('bg-transparent');
            });

            // Toggle selection
            if (!isFilled) {
                btn.classList.remove('bg-transparent');
                btn.classList.add('bg-[#F5F5F5]', 'scale-125', 'shadow-lg');
            }
        });
    });

});
