document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('camera-status');
    const teamTargets = document.querySelectorAll('.team-target');

    // Listeners para los equipos
    teamTargets.forEach(target => {
        const teamName = target.getAttribute('data-team') || 'Equipo';

        target.addEventListener('targetFound', () => {
            console.log(`¡Logo de ${teamName} detectado!`);
            if (statusText) {
                statusText.textContent = `¡Logo de ${teamName} detectado! 🎉`;
                statusText.classList.add('bg-emerald-600/80', 'border-emerald-400');
                statusText.classList.remove('bg-black/60');
            }
        });

        target.addEventListener('targetLost', () => {
            console.log(`Logo de ${teamName} fuera de vista`);
            if (statusText) {
                statusText.textContent = 'Apunta la cámara al logo de un equipo...';
                statusText.classList.remove('bg-emerald-600/80', 'border-emerald-400');
                statusText.classList.add('bg-black/60');
            }
        });
    });

    const circleButtons = document.querySelectorAll('.camera-circle-btn');
    circleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isFilled = btn.classList.contains('bg-[#F5F5F5]');

            btn.parentElement.querySelectorAll('.camera-circle-btn').forEach(b => {
                b.classList.remove('bg-[#F5F5F5]', 'scale-125', 'shadow-lg');
                b.classList.add('bg-transparent');
            });

            if (!isFilled) {
                btn.classList.remove('bg-transparent');
                btn.classList.add('bg-[#F5F5F5]', 'scale-125', 'shadow-lg');
            }
        });
    });
});
