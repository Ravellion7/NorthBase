// ==========================================
// COMPONENTE DE PARTÍCULAS (A-Frame nativo)
// Debe registrarse ANTES de que <a-scene> se cree
// ==========================================
if (typeof AFRAME !== 'undefined') {
    AFRAME.registerComponent('particle-effect', {
        schema: {
            type: { type: 'string', default: 'confetti' }
        },


        init: function () {
            console.log('>>> PARTICLE COMPONENT INIT:', this.data.type);
            this.velocities = [];
            this.points = null;
            this._buildParticles(this.data.type);
            console.log('>>> PARTICLES BUILT. Children in object3D:', this.el.object3D.children.length);
        },


        remove: function () {
            if (this.points) {
                this.el.object3D.remove(this.points);
                if (this.points.geometry) this.points.geometry.dispose();
                if (this.points.material) {
                    if (this.points.material.map) this.points.material.map.dispose();
                    this.points.material.dispose();
                }
                this.points = null;
            }
            this.velocities = [];
        },

        tick: function () {
            if (!this.points) return;
            const pos = this.points.geometry.attributes.position.array;
            const vels = this.velocities;
            const type = this.data.type;
            const count = vels.length;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                if (type === 'confetti') {
                    vels[i].sway += 0.04;
                    pos[i3] += Math.sin(vels[i].sway) * 0.006 + vels[i].x;
                    pos[i3 + 1] += vels[i].y;
                    pos[i3 + 2] += vels[i].z;
                    if (pos[i3 + 1] < -0.3) {
                        pos[i3 + 1] = 1.4;
                        pos[i3] = (Math.random() - 0.5) * 1.6;
                    }
                } else if (type === 'fire') {
                    pos[i3] += vels[i].x;
                    pos[i3 + 1] += vels[i].y;
                    pos[i3 + 2] += vels[i].z;
                    if (pos[i3 + 1] > 1.4) {
                        pos[i3 + 1] = -0.1;
                        pos[i3] = (Math.random() - 0.5) * 0.7;
                        pos[i3 + 2] = (Math.random() - 0.5) * 0.4;
                    }
                } else if (type === 'sparkles') {
                    vels[i].angle += vels[i].speed;
                    pos[i3] = Math.cos(vels[i].angle) * vels[i].radius;
                    pos[i3 + 1] += vels[i].vy;
                    pos[i3 + 2] = Math.sin(vels[i].angle) * vels[i].radius;
                    if (pos[i3 + 1] > 1.2) pos[i3 + 1] = 0.0;
                    if (pos[i3 + 1] < 0.0) pos[i3 + 1] = 1.2;
                } else if (type === 'lightning') {
                    pos[i3] += vels[i].x;
                    pos[i3 + 1] += vels[i].y;
                    pos[i3 + 2] += vels[i].z;
                    if (Math.random() > 0.78) {
                        pos[i3] = (Math.random() - 0.5) * 1.0;
                        pos[i3 + 1] = Math.random() * 1.2;
                        pos[i3 + 2] = (Math.random() - 0.5) * 0.5;
                    }
                }
            }
            this.points.geometry.attributes.position.needsUpdate = true;
        },

        _buildParticles: function (type) {
            let count, size, blending;

            if (type === 'confetti') { count = 200; size = 14; blending = THREE.NormalBlending; }
            else if (type === 'fire') { count = 250; size = 22; blending = THREE.AdditiveBlending; }
            else if (type === 'sparkles') { count = 200; size = 18; blending = THREE.AdditiveBlending; }
            else { count = 220; size = 16; blending = THREE.AdditiveBlending; }

            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            this.velocities = [];

            const confettiPalette = [
                [1, 0.07, 0.12], [0, 0.4, 1], [1, 0.84, 0], [1, 1, 1], [0.06, 0.73, 0.51], [0.96, 0.25, 0.37]
            ];

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                if (type === 'confetti') {
                    positions[i3] = (Math.random() - 0.5) * 1.6;
                    positions[i3 + 1] = Math.random() * 1.4;
                    positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
                    this.velocities.push({
                        x: (Math.random() - 0.5) * 0.01,
                        y: -0.012 - Math.random() * 0.014,
                        z: (Math.random() - 0.5) * 0.006,
                        sway: Math.random() * Math.PI * 2
                    });
                    const c = confettiPalette[Math.floor(Math.random() * confettiPalette.length)];
                    colors[i3] = c[0]; colors[i3 + 1] = c[1]; colors[i3 + 2] = c[2];

                } else if (type === 'fire') {
                    positions[i3] = (Math.random() - 0.5) * 0.7;
                    positions[i3 + 1] = Math.random() * 0.5 - 0.1;
                    positions[i3 + 2] = (Math.random() - 0.5) * 0.4;
                    this.velocities.push({
                        x: (Math.random() - 0.5) * 0.012,
                        y: 0.02 + Math.random() * 0.026,
                        z: (Math.random() - 0.5) * 0.01
                    });
                    const r = Math.random();
                    colors[i3] = 1.0;
                    colors[i3 + 1] = 0.2 + r * 0.7;
                    colors[i3 + 2] = r > 0.85 ? 0.3 : 0.0;

                } else if (type === 'sparkles') {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = 0.25 + Math.random() * 0.5;
                    positions[i3] = Math.cos(angle) * radius;
                    positions[i3 + 1] = Math.random() * 1.2;
                    positions[i3 + 2] = Math.sin(angle) * radius;
                    this.velocities.push({
                        angle: angle, radius: radius,
                        speed: 0.02 + Math.random() * 0.03,
                        vy: (Math.random() - 0.5) * 0.006
                    });
                    colors[i3] = 1.0;
                    colors[i3 + 1] = 0.8 + Math.random() * 0.2;
                    colors[i3 + 2] = 0.2 + Math.random() * 0.6;

                } else { // lightning
                    positions[i3] = (Math.random() - 0.5) * 1.0;
                    positions[i3 + 1] = Math.random() * 1.2;
                    positions[i3 + 2] = (Math.random() - 0.5) * 0.5;
                    this.velocities.push({
                        x: (Math.random() - 0.5) * 0.045,
                        y: (Math.random() - 0.5) * 0.045,
                        z: (Math.random() - 0.5) * 0.03
                    });
                    colors[i3] = 0.2 + Math.random() * 0.5;
                    colors[i3 + 1] = 0.7 + Math.random() * 0.3;
                    colors[i3 + 2] = 1.0;
                }
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const tex = this._createTexture(type);
            const mat = new THREE.PointsMaterial({
                size: size,
                map: tex,
                transparent: true,
                opacity: 1.0,
                vertexColors: true,
                blending: blending,
                depthWrite: false,
                depthTest: false,
                sizeAttenuation: false
            });

            this.points = new THREE.Points(geo, mat);
            this.points.frustumCulled = false;
            this.points.renderOrder = 999;
            this.el.object3D.add(this.points);
        },

        _createTexture: function (type) {
            const c = document.createElement('canvas');
            c.width = 64; c.height = 64;
            const ctx = c.getContext('2d');

            if (type === 'confetti') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(8, 8, 48, 48);
            } else {
                const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
                if (type === 'fire') {
                    grad.addColorStop(0, 'rgba(255,255,255,1)');
                    grad.addColorStop(0.4, 'rgba(255,180,40,1)');
                    grad.addColorStop(1, 'rgba(255,60,0,0)');
                } else if (type === 'sparkles') {
                    grad.addColorStop(0, 'rgba(255,255,255,1)');
                    grad.addColorStop(0.4, 'rgba(255,230,80,1)');
                    grad.addColorStop(1, 'rgba(255,180,0,0)');
                } else {
                    grad.addColorStop(0, 'rgba(255,255,255,1)');
                    grad.addColorStop(0.4, 'rgba(80,220,255,1)');
                    grad.addColorStop(1, 'rgba(0,80,255,0)');
                }
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, 64, 64);
            }

            const tex = new THREE.CanvasTexture(c);
            tex.needsUpdate = true;
            return tex;
        }
    });
}

// Helper para guardar fotos en IndexedDB (Galería local)
function savePhotoToIndexedDB(dataUrl) {
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

    request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction('gallery_photos', 'readwrite');
        tx.objectStore('gallery_photos').add({
            src: dataUrl,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString()
        });
        console.log('Foto guardada en IndexedDB con éxito.');
    };

    request.onerror = (e) => {
        console.error('Error al acceder a IndexedDB:', e.target.error);
    };
}

// Helper para guardar videos en IndexedDB (Galería local)
function saveVideoToIndexedDB(blob, durationSec) {
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

    request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction('gallery_videos', 'readwrite');
        tx.objectStore('gallery_videos').add({
            blob: blob,
            duration: durationSec || 0,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString()
        });
        console.log('Video guardado en IndexedDB con éxito.');
    };

    request.onerror = (e) => {
        console.error('Error al guardar video en IndexedDB:', e.target.error);
    };
}


// ==========================================
// LÓGICA PRINCIPAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('camera-status');
    const teamTargets = document.querySelectorAll('.team-target');
    let currentActiveTarget = null;
    let currentActiveModel = null;
    let activeTeamName = null;
    let lastDetectedTeam = null;
    let lastDetectedTimestamp = 0;
    let availableAnimations = [];
    let sultanesAnimations = []; // Animaciones maestras exclusivas de Sultanes
    let currentEffectName = null;

    // Mapeo oficial de nombres para redirección a página de equipos
    const TEAM_URL_MAP = {
        'acereros': 'acereros',
        'algodoneros': 'algodoneros',
        'caliente': 'caliente',
        'calientes': 'caliente',
        'charros': 'charros',
        'dorados': 'dorados',
        'rieleros': 'rieleros',
        'saraperos': 'saraperos',
        'sultanes': 'sultanes',
        'tecos': 'tecos',
        'toros': 'toros'
    };

    function navigateToTeam(team) {
        if (!team) return;
        const cleanKey = team.toLowerCase().trim();
        const teamKey = TEAM_URL_MAP[cleanKey] || cleanKey;
        console.log(`Redirigiendo a estadísticas del equipo: ${teamKey}`);
        window.location.href = `./sultanes.html?team=${teamKey}`;
    }

    // Listener para el banner flotante (ideal para pulsar en celular)
    if (statusText) {
        statusText.addEventListener('click', () => {
            if (activeTeamName) {
                navigateToTeam(activeTeamName);
            }
        });
    }

    // ==========================================
    // DETECCIÓN ROBUSTA DE CLIC EN EL MODELO 3D (THREE.JS RAYCASTER)
    // ==========================================
    const sceneEl = document.querySelector('a-scene');

    function checkRaycastHit(clientX, clientY) {
        if (!currentActiveTarget || !activeTeamName || !sceneEl) return false;

        const camera = sceneEl.camera;
        if (!camera) return false;

        const canvas = sceneEl.canvas || sceneEl.querySelector('canvas');
        if (!canvas) return false;

        const rect = canvas.getBoundingClientRect();
        const mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);

        // Comprobar colisión con todos los objetos, mallas y hitbox del equipo activo
        const intersects = raycaster.intersectObjects(currentActiveTarget.object3D.children, true);
        if (intersects && intersects.length > 0) {
            console.log(`Three.js Raycaster detectó clic en modelo de ${activeTeamName}`);
            navigateToTeam(activeTeamName);
            return true;
        }
        return false;
    }

    // Escuchar clic en PC/laptop
    window.addEventListener('click', (e) => {
        if (e.target.closest('button, a, #camera-status')) return;
        checkRaycastHit(e.clientX, e.clientY);
    });

    // Escuchar toque táctil en móviles
    window.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const touch = e.changedTouches[0];
        if (touch.target.closest('button, a, #camera-status')) return;
        checkRaycastHit(touch.clientX, touch.clientY);
    });

    // Cursor pointer al pasar el mouse por encima del modelo en PC
    window.addEventListener('mousemove', (e) => {
        if (!currentActiveTarget || !activeTeamName || !sceneEl) return;
        const camera = sceneEl.camera;
        const canvas = sceneEl.canvas || sceneEl.querySelector('canvas');
        if (!camera || !canvas) return;

        const rect = canvas.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), camera);
        const intersects = raycaster.intersectObjects(currentActiveTarget.object3D.children, true);
        if (intersects && intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    });

    // ==========================================
    // 1. LISTENERS DE DETECCIÓN AR (TARGETS)
    // ==========================================

    teamTargets.forEach(target => {
        const teamName = target.getAttribute('data-team') || 'Equipo';
        const model = target.querySelector('a-gltf-model');

        // Clic directo sobre el modelo 3D (para PC/Laptop y pantallas táctiles)
        if (model) {
            model.addEventListener('click', () => {
                navigateToTeam(teamName);
            });

            // Feedback de cursor en mouse
            model.addEventListener('mouseenter', () => {
                document.body.style.cursor = 'pointer';
            });
            model.addEventListener('mouseleave', () => {
                document.body.style.cursor = 'default';
            });

            model.addEventListener('model-loaded', () => {
                const mesh = model.getObject3D('mesh');
                if (!mesh) return;

                // Si es el modelo de Sultanes, guardar sus 3 animaciones como la plantilla maestra
                if (teamName === 'Sultanes' && mesh.animations && mesh.animations.length > 0) {
                    console.log('Animaciones maestras de Sultanes cargadas:', mesh.animations.map(a => a.name));
                    sultanesAnimations = mesh.animations;

                    // Asignar inmediatamente las animaciones de Sultanes a todos los demás modelos
                    document.querySelectorAll('.team-target a-gltf-model').forEach(m => {
                        const otherMesh = m.getObject3D('mesh');
                        if (otherMesh && m.closest('.team-target').getAttribute('data-team') !== 'Sultanes') {
                            otherMesh.animations = sultanesAnimations;
                        }
                    });
                } else if (teamName !== 'Sultanes' && sultanesAnimations.length > 0) {
                    // Reemplazar cualquier animación propia de este equipo con las de Sultanes
                    mesh.animations = sultanesAnimations;
                }
            });
        }

        // Clic en la entidad target completa como respaldo
        target.addEventListener('click', () => {
            navigateToTeam(teamName);
        });

        target.addEventListener('targetFound', () => {
            console.log(`¡Logo de ${teamName} detectado!`);
            currentActiveTarget = target;
            currentActiveModel = model;
            activeTeamName = teamName;
            lastDetectedTeam = teamName;
            lastDetectedTimestamp = Date.now();

            if (model) {
                const mesh = model.getObject3D('mesh');
                if (mesh) {
                    // Si ya cargaron las animaciones de Sultanes, forzarlas en este modelo
                    if (sultanesAnimations.length > 0) {
                        mesh.animations = sultanesAnimations;
                        availableAnimations = sultanesAnimations.map(a => a.name);
                    } else {
                        availableAnimations = mesh.animations ? mesh.animations.map(a => a.name) : [];
                    }
                }
            }

            // Si hay un efecto de partículas seleccionado, adjuntarlo inmediatamente
            if (currentEffectName) {
                currentActiveTarget.setAttribute('particle-effect', { type: currentEffectName });
            }

            // Banner interactivo: muestra información y permite tocar para redirigir
            if (statusText) {
                statusText.innerHTML = `
                    <div class="flex items-center justify-center gap-2">
                        <span class="font-bold">¡Logo de ${teamName} detectado!</span>
                        <span class="text-[11px] bg-white/25 hover:bg-white/40 text-white font-semibold px-2.5 py-0.5 rounded-full transition-all">Ver estadísticas ➔</span>
                    </div>
                `;
                statusText.classList.remove('pointer-events-none', 'bg-black/60', 'border-white/20');
                statusText.classList.add('pointer-events-auto', 'cursor-pointer', 'bg-emerald-600/90', 'border-emerald-400', 'hover:scale-105', 'active:scale-95');
            }
        });

        // Restaurar targetLost para limpiar la animación al perder de vista el logo
        target.addEventListener('targetLost', () => {
            console.log(`Logo de ${teamName} fuera de vista`);
            if (currentActiveTarget === target) {
                if (currentActiveModel) {
                    currentActiveModel.removeAttribute('animation-mixer');
                }
                if (currentActiveTarget) {
                    currentActiveTarget.removeAttribute('particle-effect');
                }
                currentActiveTarget = null;
                currentActiveModel = null;
                activeTeamName = null;
                availableAnimations = [];
            }

            document.body.style.cursor = 'default';

            if (statusText) {
                statusText.textContent = 'Apunta la cámara al logo de un equipo...';
                statusText.classList.remove('pointer-events-auto', 'cursor-pointer', 'bg-emerald-600/90', 'border-emerald-400', 'hover:scale-105', 'active:scale-95');
                statusText.classList.add('pointer-events-none', 'bg-black/60', 'border-white/20');
            }
        });

    });



    // ==========================================
    // 2. TOGGLE Y CONTROL DE BOTONES DE PARTÍCULAS (IZQUIERDA)
    // ==========================================

    const toggleParticlesBtn = document.getElementById('toggle-particles-btn');
    const particleButtonsContainer = document.getElementById('particle-buttons-container');
    const toggleParticlesText = document.getElementById('toggle-particles-text');
    const toggleParticlesIcon = document.getElementById('toggle-particles-icon');

    if (toggleParticlesBtn && particleButtonsContainer) {
        toggleParticlesBtn.addEventListener('click', () => {
            const isHidden = particleButtonsContainer.classList.contains('hidden');
            if (isHidden) {
                // Mostrar botones de partículas
                particleButtonsContainer.classList.remove('hidden');
                if (toggleParticlesText) toggleParticlesText.textContent = 'Cerrar';
                if (toggleParticlesIcon) toggleParticlesIcon.classList.remove('rotate-45');
            } else {
                // Ocultar botones de partículas
                particleButtonsContainer.classList.add('hidden');
                if (toggleParticlesText) toggleParticlesText.textContent = 'Abrir';
                if (toggleParticlesIcon) toggleParticlesIcon.classList.add('rotate-45');
            }
        });
    }

    const particleButtons = document.querySelectorAll('.particle-btn');
    particleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const effect = btn.getAttribute('data-particle-effect');
            const isActive = btn.classList.contains('border-[#C1121F]');

            particleButtons.forEach(b => {
                b.classList.remove('border-[#C1121F]', 'bg-white/30', 'scale-125', 'shadow-2xl');
                b.classList.add('border-white', 'bg-black/40');
            });

            if (isActive) {
                currentEffectName = null;
                if (currentActiveTarget) {
                    currentActiveTarget.removeAttribute('particle-effect');
                }
                console.log('Efecto de partículas desactivado.');
            } else {
                btn.classList.remove('border-white', 'bg-black/40');
                btn.classList.add('border-[#C1121F]', 'bg-white/30', 'scale-125', 'shadow-2xl');
                currentEffectName = effect;
                if (currentActiveTarget) {
                    currentActiveTarget.removeAttribute('particle-effect');
                    currentActiveTarget.setAttribute('particle-effect', { type: effect });
                }
                console.log(`Efecto de partículas activado: ${effect}`);
            }
        });
    });

    // ==========================================
    // 3. CONTROL BOTONES DE ANIMACIÓN (ABAJO)
    // ==========================================

    const animButtons = document.querySelectorAll('.camera-anim-btn');
    animButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!currentActiveModel) {
                console.warn('No hay ningún modelo detectado actualmente.');
                return;
            }

            animButtons.forEach(b => {
                b.classList.remove('bg-[#F5F5F5]', 'text-black', 'scale-110');
                b.classList.add('bg-transparent', 'text-white');
            });
            btn.classList.remove('bg-transparent', 'text-white');
            btn.classList.add('bg-[#F5F5F5]', 'text-black', 'scale-110');

            const animIndex = btn.getAttribute('data-anim-index');

            if (animIndex === 'stop') {
                currentActiveModel.removeAttribute('animation-mixer');
                console.log('Animación detenida (Idle).');
                return;
            }

            const index = parseInt(animIndex, 10);
            if (availableAnimations.length > index) {
                const clipName = availableAnimations[index];
                console.log(`Reproduciendo animación: ${clipName}`);

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

    // ==========================================
    // 4. CONTROL DE CAPTURA (FOTO Y VIDEO)
    // ==========================================
    const captureBtn = document.getElementById('capture-btn');
    const capturePhotoIcon = document.getElementById('capture-photo-icon');
    const captureVideoDot = document.getElementById('capture-video-dot');
    const captureStopBox = document.getElementById('capture-stop-box');

    const modeToggleBtn = document.getElementById('camera-mode-toggle');
    const toggleVideoIcon = document.getElementById('toggle-video-icon');
    const togglePhotoIcon = document.getElementById('toggle-photo-icon');

    const recordingIndicator = document.getElementById('recording-indicator');
    const recordingTimeText = document.getElementById('recording-time-text');
    const shutterFlash = document.getElementById('shutter-flash');

    let currentCameraMode = 'photo'; // 'photo' o 'video'
    let isRecording = false;
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordTimerInterval = null;
    let recordSeconds = 0;
    let recordAnimFrameId = null;
    const MAX_RECORD_SECONDS = 15;

    // Alternar entre modo Foto y modo Video
    if (modeToggleBtn) {
        modeToggleBtn.addEventListener('click', () => {
            if (isRecording) {
                stopVideoRecording();
            }

            if (currentCameraMode === 'photo') {
                currentCameraMode = 'video';
                captureBtn.title = 'Grabar Video';
                modeToggleBtn.title = 'Cambiar a Modo Foto';

                capturePhotoIcon?.classList.add('hidden');
                captureVideoDot?.classList.remove('hidden');
                captureStopBox?.classList.add('hidden');

                toggleVideoIcon?.classList.add('hidden');
                togglePhotoIcon?.classList.remove('hidden');
            } else {
                currentCameraMode = 'photo';
                captureBtn.title = 'Tomar Foto';
                modeToggleBtn.title = 'Cambiar a Modo Video';

                capturePhotoIcon?.classList.remove('hidden');
                captureVideoDot?.classList.add('hidden');
                captureStopBox?.classList.add('hidden');

                toggleVideoIcon?.classList.remove('hidden');
                togglePhotoIcon?.classList.add('hidden');
            }
        });
    }

    // Botón principal de Captura
    if (captureBtn) {
        captureBtn.addEventListener('click', () => {
            if (currentCameraMode === 'photo') {
                takePhotoSnapshot();
            } else {
                if (isRecording) {
                    stopVideoRecording();
                } else {
                    startVideoRecording();
                }
            }
        });
    }

    // Función: Tomar Foto (Snapshot)
    function takePhotoSnapshot() {
        const video = document.querySelector('video');
        const aScene = document.querySelector('a-scene');
        const aCanvas = aScene ? (aScene.canvas || aScene.querySelector('canvas')) : null;

        if (!video || !aCanvas) {
            console.warn('Cámara o lienzo 3D no disponibles.');
            return;
        }

        // Efecto de flash fotográfico
        if (shutterFlash) {
            shutterFlash.classList.remove('opacity-0');
            shutterFlash.classList.add('opacity-90');
            setTimeout(() => {
                shutterFlash.classList.remove('opacity-90');
                shutterFlash.classList.add('opacity-0');
            }, 120);
        }

        // 1. Forzar a Three.js a renderizar la escena en este frame
        if (aScene.renderer && aScene.camera) {
            aScene.renderer.render(aScene.object3D, aScene.camera);
        }

        const snapshotCanvas = document.createElement('canvas');
        const width = aCanvas.width || 1280;
        const height = aCanvas.height || 720;
        snapshotCanvas.width = width;
        snapshotCanvas.height = height;
        const ctx = snapshotCanvas.getContext('2d');

        // 2. Dibujar el video de la cámara
        if (video.videoWidth && video.videoHeight) {
            const videoRatio = video.videoWidth / video.videoHeight;
            const canvasRatio = width / height;
            let drawW, drawH, drawX, drawY;

            if (videoRatio > canvasRatio) {
                drawH = height;
                drawW = height * videoRatio;
                drawX = (width - drawW) / 2;
                drawY = 0;
            } else {
                drawW = width;
                drawH = width / videoRatio;
                drawX = 0;
                drawY = (height - drawH) / 2;
            }
            ctx.drawImage(video, drawX, drawY, drawW, drawH);
        }

        // 3. Dibujar la escena 3D encima
        ctx.drawImage(aCanvas, 0, 0, width, height);

        // 4. Descargar y guardar en IndexedDB
        const imageURL = snapshotCanvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `NorthBase_AR_${Date.now()}.png`;
        downloadLink.href = imageURL;
        downloadLink.click();
        savePhotoToIndexedDB(imageURL);

        // Desbloqueo de Coleccionables
        awardCameraCollectibles();
    }

    // Función: Iniciar Grabación de Video
    function startVideoRecording() {
        const video = document.querySelector('video');
        const aScene = document.querySelector('a-scene');
        const aCanvas = aScene ? (aScene.canvas || aScene.querySelector('canvas')) : null;

        if (!video || !aCanvas) {
            console.warn('Cámara o lienzo 3D no disponibles para grabar.');
            return;
        }

        const width = Math.min(aCanvas.width || 1280, 1280);
        const height = Math.min(aCanvas.height || 720, 720);

        const compCanvas = document.createElement('canvas');
        compCanvas.width = width;
        compCanvas.height = height;
        const ctx = compCanvas.getContext('2d');

        const stream = compCanvas.captureStream(30);

        // Agregar audio si el stream de la cámara contiene pistas de audio
        if (video.srcObject && typeof video.srcObject.getAudioTracks === 'function') {
            video.srcObject.getAudioTracks().forEach(track => stream.addTrack(track));
        }

        // Selección de formato compatible
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/mp4';
        if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = '';

        try {
            mediaRecorder = mimeType
                ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2500000 })
                : new MediaRecorder(stream);
        } catch (err) {
            console.warn('Fallo al inicializar MediaRecorder con opciones, usando valores estándar:', err);
            mediaRecorder = new MediaRecorder(stream);
        }

        recordedChunks = [];
        mediaRecorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) {
                recordedChunks.push(e.data);
            }
        };

        mediaRecorder.onstop = () => {
            finishVideoRecording();
        };

        isRecording = true;
        recordSeconds = 0;
        mediaRecorder.start(100);

        // Bucle de renderizado cuadro por cuadro
        function drawFrame() {
            if (!isRecording) return;

            if (aScene.renderer && aScene.camera) {
                aScene.renderer.render(aScene.object3D, aScene.camera);
            }

            if (video.videoWidth && video.videoHeight) {
                const videoRatio = video.videoWidth / video.videoHeight;
                const canvasRatio = width / height;
                let drawW, drawH, drawX, drawY;

                if (videoRatio > canvasRatio) {
                    drawH = height;
                    drawW = height * videoRatio;
                    drawX = (width - drawW) / 2;
                    drawY = 0;
                } else {
                    drawW = width;
                    drawH = width / videoRatio;
                    drawX = 0;
                    drawY = (height - drawH) / 2;
                }
                ctx.drawImage(video, drawX, drawY, drawW, drawH);
            }

            ctx.drawImage(aCanvas, 0, 0, width, height);
            recordAnimFrameId = requestAnimationFrame(drawFrame);
        }
        recordAnimFrameId = requestAnimationFrame(drawFrame);

        // Interfaz visual de grabación
        if (recordingIndicator) {
            recordingIndicator.classList.remove('hidden');
            recordingIndicator.classList.add('flex');
        }
        if (recordingTimeText) recordingTimeText.textContent = '00:00';
        captureVideoDot?.classList.add('hidden');
        captureStopBox?.classList.remove('hidden');
        captureBtn.title = 'Detener Grabación';

        // Temporizador de grabación (Límite: 15 segundos)
        recordTimerInterval = setInterval(() => {
            recordSeconds++;
            const mm = String(Math.floor(recordSeconds / 60)).padStart(2, '0');
            const ss = String(recordSeconds % 60).padStart(2, '0');
            if (recordingTimeText) recordingTimeText.textContent = `${mm}:${ss}`;

            if (recordSeconds >= MAX_RECORD_SECONDS) {
                stopVideoRecording();
            }
        }, 1000);
    }

    // Función: Detener Grabación
    function stopVideoRecording() {
        if (!isRecording) return;
        isRecording = false;

        if (recordAnimFrameId) cancelAnimationFrame(recordAnimFrameId);
        if (recordTimerInterval) clearInterval(recordTimerInterval);

        if (recordingIndicator) {
            recordingIndicator.classList.add('hidden');
            recordingIndicator.classList.remove('flex');
        }
        captureStopBox?.classList.add('hidden');
        captureVideoDot?.classList.remove('hidden');
        captureBtn.title = 'Grabar Video';

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    }

    window.addEventListener('beforeunload', () => {
        if (isRecording) {
            stopVideoRecording();
        }
    });

    // Función: Guardar y descargar video terminado
    function finishVideoRecording() {
        if (!recordedChunks || recordedChunks.length === 0) return;

        const mime = (mediaRecorder && mediaRecorder.mimeType) || 'video/webm';
        const videoBlob = new Blob(recordedChunks, { type: mime });
        const duration = recordSeconds || 1;

        // 1. Guardar en IndexedDB
        saveVideoToIndexedDB(videoBlob, duration);

        // 2. Descargar archivo en el dispositivo
        const ext = mime.includes('mp4') ? 'mp4' : 'webm';
        const url = URL.createObjectURL(videoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `NorthBase_AR_Video_${Date.now()}.${ext}`;
        a.click();

        // Desbloqueo de Coleccionables
        awardCameraCollectibles();
    }

    // Helper: Desbloqueo de Coleccionables
    function awardCameraCollectibles() {
        if (typeof awardCollectible === 'function') {
            const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

            if (!user) {
                console.warn('[NorthBase AR] No hay usuario logueado en este dispositivo/navegador. Inicia sesión para guardar tus coleccionables.');
            }

            // ID 29: Ramón Santiago (Efectos de cámara interactivos)
            if (currentEffectName) {
                setTimeout(() => {
                    awardCollectible(29);
                }, 400);
            }

            // ID 30: Óscar Robles (Con modelo 3D escaneado del equipo)
            // Se valida si el modelo está activo en el fotograma o si se detectó en los últimos 6 segundos
            const wasModelRecentlyVisible = currentActiveModel !== null || (Date.now() - lastDetectedTimestamp < 6000);
            if (wasModelRecentlyVisible) {
                setTimeout(() => {
                    awardCollectible(30);
                }, 800);
            }
        }
    }

    // ==========================================
    // 5. MODAL INTERACTIVO DE GUÍA (TUTORIAL AR)
    // ==========================================
    const cameraInfoBtn = document.getElementById('camera-info-btn');
    const guideModal = document.getElementById('camera-guide-modal');
    const guideCloseBtn = document.getElementById('guide-close-btn');
    const guideStepBadge = document.getElementById('guide-step-badge');
    const guideStepContainer = document.getElementById('guide-step-container');
    const guideDotsContainer = document.getElementById('guide-dots-container');
    const guidePrevBtn = document.getElementById('guide-prev-btn');
    const guideNextBtn = document.getElementById('guide-next-btn');
    const guideNextText = document.getElementById('guide-next-text');

    let currentGuideStep = 0;

    const guideSteps = [
        {
            title: "¡Bienvenido a la Cámara AR!",
            description: "Para empezar, ten en cuenta que puedes cambiar entre modo foto y video con el botón de alternar junto al disparador.",
            hint: "Usa el botón circular a la derecha del disparador para elegir si prefieres capturar una foto fija o grabar un clip de video (hasta 15 segundos).",
            highlightSelector: "#capture-btn, #camera-mode-toggle",
            visual: `
                <div class="flex items-center justify-center gap-3 sm:gap-6 my-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div class="flex flex-col items-center gap-1.5">
                        <div class="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h4.05l1.83-2h4.24l1.83 2H20v12z"/></svg>
                        </div>
                        <span class="text-xs font-semibold text-slate-700">Modo Foto</span>
                    </div>
                    <div class="text-[#C1121F] font-bold text-xl">⇄</div>
                    <div class="flex flex-col items-center gap-1.5">
                        <div class="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md">
                            <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                        </div>
                        <span class="text-xs font-semibold text-slate-700">Modo Video (15s)</span>
                    </div>
                </div>
            `
        },
        {
            title: "¡Escanea tu Equipo Favorito!",
            description: "Ahora, ¡muestra el logo de tu equipo favorito de la Zona Norte en la LMB!",
            hint: "Apunta la cámara al escudo oficial (en una pantalla, imagen o gorra). El modelo 3D del equipo aparecerá en realidad aumentada en tu pantalla.",
            highlightSelector: "#camera-status",
            visual: `
                <div class="flex items-center justify-center gap-4 my-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <img src="./src/assets/LMB Logo.png" alt="LMB" class="w-12 h-12 object-contain drop-shadow" />
                    <div class="text-[#C1121F] font-bold text-lg">➔</div>
                    <div class="w-14 h-14 rounded-2xl bg-[#0A1A32] text-white flex flex-col items-center justify-center shadow-md border border-slate-700">
                        <span class="text-base font-black">3D</span>
                        <span class="text-[9px] font-semibold tracking-wider text-slate-300 uppercase">Modelo</span>
                    </div>
                </div>
            `
        },
        {
            title: "¡Prueba las Animaciones!",
            description: "¡Intenta probar agregarle animaciones al modelo!",
            hint: "Usa los botones numéricos (1, 2, 3) en la parte inferior para reproducir animaciones de bateo o lanzamiento. Pulsa ■ para pausar o regresar a Idle.",
            highlightSelector: ".camera-anim-btn",
            visual: `
                <div class="flex items-center justify-center gap-2.5 my-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                    <span class="w-10 h-10 rounded-full bg-[#0A1A32] text-white flex items-center justify-center font-bold text-sm shadow">1</span>
                    <span class="w-10 h-10 rounded-full bg-[#0A1A32] text-white flex items-center justify-center font-bold text-sm shadow">2</span>
                    <span class="w-10 h-10 rounded-full bg-[#0A1A32] text-white flex items-center justify-center font-bold text-sm shadow">3</span>
                    <span class="w-10 h-10 rounded-full bg-[#C1121F] text-white flex items-center justify-center font-bold text-sm shadow">■</span>
                </div>
            `
        },
        {
            title: "¡Efectos de Partículas!",
            description: "¡Puedes agregarle partículas al modelo también!",
            hint: "Abre el menú lateral izquierdo para activar confeti festivo, fuego ardiente, destellos o rayos eléctricos alrededor de tu modelo. Puedes desactivar las particula activada, pulsando el mismo botón que está activo.",
            highlightSelector: "#particle-buttons-container, #toggle-particles-btn",
            visual: `
                <div class="grid grid-cols-4 gap-2 my-4 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div class="flex flex-col items-center gap-1">
                        <img src="./src/assets/confetti icon.png" alt="Confetti" class="w-9 h-9 object-contain drop-shadow p-1 bg-white rounded-full border border-slate-200" />
                        <span class="text-[10px] font-semibold text-slate-600">Confeti</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <img src="./src/assets/fire icon.png" alt="Fuego" class="w-9 h-9 object-contain drop-shadow p-1 bg-white rounded-full border border-slate-200" />
                        <span class="text-[10px] font-semibold text-slate-600">Fuego</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <img src="./src/assets/sparkles icon.png" alt="Sparkles" class="w-9 h-9 object-contain drop-shadow p-1 bg-white rounded-full border border-slate-200" />
                        <span class="text-[10px] font-semibold text-slate-600">Destellos</span>
                    </div>
                    <div class="flex flex-col items-center gap-1">
                        <img src="./src/assets/lightning icon.png" alt="Rayos" class="w-9 h-9 object-contain drop-shadow p-1 bg-white rounded-full border border-slate-200" />
                        <span class="text-[10px] font-semibold text-slate-600">Rayos</span>
                    </div>
                </div>
            `
        },
        {
            title: "¡Tus Recuerdos en la Galería!",
            description: "Cualquier foto o video que grabes aquí se va a descargar automáticamente y se almacenará en tu galería.",
            hint: "Podrás consultar, reproducir y revivir todas tus capturas cuando quieras visitando la pestaña 'Galería' en la barra superior.",
            highlightSelector: null,
            visual: `
                <div class="flex flex-col items-center justify-center my-4 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                    <div class="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md mb-2">
                        <svg class="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
                    </div>
                    <p class="text-xs font-bold text-emerald-900">Descarga automática + Guardado local</p>
                    <p class="text-[11px] text-emerald-700 mt-0.5">Visita la sección de Galería cuando quieras</p>
                </div>
            `
        }
    ];

    function clearGuideHighlights() {
        document.querySelectorAll('.guide-highlight').forEach(el => {
            el.classList.remove('guide-highlight', 'ring-4', 'ring-[#C1121F]', 'ring-offset-2', 'animate-pulse');
        });
    }

    function applyGuideHighlight(selector) {
        clearGuideHighlights();
        if (!selector) return;
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('guide-highlight', 'ring-4', 'ring-[#C1121F]', 'ring-offset-2', 'animate-pulse');
        });
    }

    function renderGuideStep(index) {
        if (!guideStepContainer) return;
        currentGuideStep = index;
        const step = guideSteps[index];

        if (guideStepBadge) {
            guideStepBadge.textContent = `Paso ${index + 1} de ${guideSteps.length}`;
        }

        guideStepContainer.innerHTML = `
            <div class="flex flex-col animate-in fade-in duration-200">
                <h3 class="text-lg sm:text-xl font-bold text-[#0A1A32] leading-snug">
                    ${step.title}
                </h3>
                <p class="text-xs sm:text-sm text-slate-600 mt-2 font-medium leading-relaxed">
                    ${step.description}
                </p>
                ${step.visual || ''}
                <div class="flex items-start gap-2 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200/60 mt-1">
                    <p class="text-[11px] text-slate-500 leading-normal">${step.hint}</p>
                </div>
            </div>
        `;

        // Renderizar puntos (dots)
        if (guideDotsContainer) {
            guideDotsContainer.innerHTML = '';
            guideSteps.forEach((_, i) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = i === index
                    ? 'w-6 h-2 rounded-full bg-[#C1121F] transition-all cursor-pointer'
                    : 'w-2 h-2 rounded-full bg-slate-300 hover:bg-slate-400 transition-all cursor-pointer';
                dot.title = `Ir al paso ${i + 1}`;
                dot.addEventListener('click', () => renderGuideStep(i));
                guideDotsContainer.appendChild(dot);
            });
        }

        // Estado de botones Anterior / Siguiente
        if (guidePrevBtn) {
            if (index === 0) {
                guidePrevBtn.classList.add('hidden');
            } else {
                guidePrevBtn.classList.remove('hidden');
            }
        }

        if (guideNextText) {
            guideNextText.textContent = index === guideSteps.length - 1 ? '¡Entendido!' : 'Next';
        }

        // Resaltar elementos en la pantalla de la cámara
        applyGuideHighlight(step.highlightSelector);
    }

    function openGuide() {
        if (!guideModal) return;
        renderGuideStep(0);
        guideModal.classList.remove('hidden');
        guideModal.classList.add('flex');
    }

    function closeGuide() {
        if (!guideModal) return;
        guideModal.classList.add('hidden');
        guideModal.classList.remove('flex');
        clearGuideHighlights();
    }

    if (cameraInfoBtn) {
        cameraInfoBtn.addEventListener('click', openGuide);
    }

    if (guideCloseBtn) {
        guideCloseBtn.addEventListener('click', closeGuide);
    }

    if (guideNextBtn) {
        guideNextBtn.addEventListener('click', () => {
            if (currentGuideStep < guideSteps.length - 1) {
                renderGuideStep(currentGuideStep + 1);
            } else {
                closeGuide();
            }
        });
    }

    if (guidePrevBtn) {
        guidePrevBtn.addEventListener('click', () => {
            if (currentGuideStep > 0) {
                renderGuideStep(currentGuideStep - 1);
            }
        });
    }

    if (guideModal) {
        guideModal.addEventListener('click', (e) => {
            if (e.target === guideModal) {
                closeGuide();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && guideModal && !guideModal.classList.contains('hidden')) {
            closeGuide();
        }
    });
});
