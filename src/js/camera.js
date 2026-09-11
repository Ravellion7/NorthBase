document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('camera-status');
    const teamTargets = document.querySelectorAll('.team-target');
    let currentActiveModel = null;
    let availableAnimations = [];

    // Listeners para la detección de los equipos
    teamTargets.forEach(target => {
        const teamName = target.getAttribute('data-team') || 'Equipo';
        const model = target.querySelector('a-gltf-model');

        // Escuchar cuando el modelo 3D termine de cargar para listar sus animaciones en la consola
        if (model) {
            model.addEventListener('model-loaded', () => {
                const mesh = model.getObject3D('mesh');
                if (mesh && mesh.animations && mesh.animations.length > 0) {
                    console.log(`Animaciones encontradas en ${teamName}:`, mesh.animations.map(a => a.name));
                }
            });
        }

        target.addEventListener('targetFound', () => {
            console.log(`¡Logo de ${teamName} detectado!`);
            currentActiveModel = model;

            // Extraer las animaciones disponibles del modelo detectado
            if (model) {
                const mesh = model.getObject3D('mesh');
                availableAnimations = (mesh && mesh.animations) ? mesh.animations.map(a => a.name) : [];
            }

            if (statusText) {
                statusText.textContent = `¡Logo de ${teamName} detectado!`;
                statusText.classList.add('bg-emerald-600/80', 'border-emerald-400');
                statusText.classList.remove('bg-black/60');
            }
        });

        target.addEventListener('targetLost', () => {
            console.log(`Logo de ${teamName} fuera de vista`);
            if (currentActiveModel === model) {
                // Detener cualquier animación al perder el logo
                if (currentActiveModel) {
                    currentActiveModel.removeAttribute('animation-mixer');
                }
                currentActiveModel = null;
                availableAnimations = [];
            }

            if (statusText) {
                statusText.textContent = 'Apunta la cámara al logo de un equipo';
                statusText.classList.remove('bg-emerald-600/80', 'border-emerald-400');
                statusText.classList.add('bg-black/60');
            }
        });
    });

    // Control de los botones de animación inferiores
    const animButtons = document.querySelectorAll('.camera-anim-btn');
    animButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!currentActiveModel) {
                console.warn('No hay ningún modelo detectado actualmente.');
                return;
            }

            // Efecto visual al presionar el botón activo
            animButtons.forEach(b => {
                b.classList.remove('bg-[#F5F5F5]', 'text-black', 'scale-110');
                b.classList.add('bg-transparent', 'text-white');
            });
            btn.classList.remove('bg-transparent', 'text-white');
            btn.classList.add('bg-[#F5F5F5]', 'text-black', 'scale-110');

            const animIndex = btn.getAttribute('data-anim-index');

            if (animIndex === 'stop') {
                // Detener animación y volver a estado de reposo (idle)
                currentActiveModel.removeAttribute('animation-mixer');
                console.log('Animación detenida (Idle).');
                return;
            }

            const index = parseInt(animIndex, 10);
            if (availableAnimations.length > index) {
                const clipName = availableAnimations[index];
                console.log(`Reproduciendo animación: ${clipName}`);

                // Aplicar el componente animation-mixer con el clip correspondiente
                currentActiveModel.removeAttribute('animation-mixer');
                currentActiveModel.setAttribute('animation-mixer', {
                    clip: clipName,
                    loop: 'repeat',
                    crossFadeDuration: 0.3
                });
            } else {
                console.warn(`No se encontró animación en el índice ${index}. Animaciones disponibles:`, availableAnimations);
            }
        });
    });
});
