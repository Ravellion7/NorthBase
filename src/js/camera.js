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

// ==========================================
// LÓGICA PRINCIPAL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const statusText = document.getElementById('camera-status');
    const teamTargets = document.querySelectorAll('.team-target');
    let currentActiveTarget = null;
    let currentActiveModel = null;
    let availableAnimations = [];
    let sultanesAnimations = []; // Animaciones maestras exclusivas de Sultanes
    let currentEffectName = null;

    // ==========================================
    // 1. LISTENERS DE DETECCIÓN AR (TARGETS)
    // ==========================================

    teamTargets.forEach(target => {
        const teamName = target.getAttribute('data-team') || 'Equipo';
        const model = target.querySelector('a-gltf-model');

        if (model) {
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

        target.addEventListener('targetFound', () => {
            console.log(`¡Logo de ${teamName} detectado!`);
            currentActiveTarget = target;
            currentActiveModel = model;

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

            if (statusText) {
                statusText.textContent = `¡Logo de ${teamName} detectado!`;
                statusText.classList.add('bg-emerald-600/80', 'border-emerald-400');
                statusText.classList.remove('bg-black/60');
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
                availableAnimations = [];
            }

            if (statusText) {
                statusText.textContent = 'Apunta la cámara al logo de un equipo';
                statusText.classList.remove('bg-emerald-600/80', 'border-emerald-400');
                statusText.classList.add('bg-black/60');
            }
        });

    });



    // ==========================================
    // 2. CONTROL BOTONES DE PARTÍCULAS (IZQUIERDA)
    // ==========================================

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
    // 4. CONTROL PARA TOMAR FOTO (SNAPSHOT)
    // ==========================================
    const captureBtn = document.getElementById('capture-btn');
    const shutterFlash = document.getElementById('shutter-flash');

    if (captureBtn) {
        captureBtn.addEventListener('click', () => {
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

            // 1. FORZAR a A-Frame y Three.js a renderizar el modelo 3D y partículas en este preciso instante
            if (aScene.renderer && aScene.camera) {
                aScene.renderer.render(aScene.object3D, aScene.camera);
            }

            // Crear lienzo temporal de alta resolución
            const snapshotCanvas = document.createElement('canvas');
            const width = aCanvas.width;
            const height = aCanvas.height;
            snapshotCanvas.width = width;
            snapshotCanvas.height = height;
            const ctx = snapshotCanvas.getContext('2d');

            // 2. Dibujar el video de la cámara con el mismo ajuste "object-fit: cover"
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

            // 3. Dibujar la escena 3D (modelo + partículas) encima del video
            ctx.drawImage(aCanvas, 0, 0, width, height);

            // 4. Descargar la imagen
            const imageURL = snapshotCanvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `NorthBase_AR_${Date.now()}.png`;
            downloadLink.href = imageURL;
            downloadLink.click();
            console.log('¡Foto capturada con modelo y partículas!');
        });
    }

});
