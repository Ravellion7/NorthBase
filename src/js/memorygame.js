// ==========================================
// NORTHBASE - MEMORY GAME (MEMORAMA)
// ==========================================

// Base de datos de equipos, jugadores y mánagers de la Zona Norte
const MEMORY_TEAMS = [
    {
        id: 'sultanes',
        name: 'Sultanes de Monterrey',
        shortName: 'Sultanes',
        logo: './src/assets/Sultanes logo.png',
        player: 'Ramiro Peña',
        playerPhoto: './src/assets/Memory Game/Players/RamiroPeña.png',
        manager: 'Henry Blanco',
        managerPhoto: './src/assets/Memory Game/Managers/HenryBlanco.png'
    },
    {
        id: 'toros',
        name: 'Toros de Tijuana',
        shortName: 'Toros',
        logo: './src/assets/toros logo.png',
        player: 'Junior Lake',
        playerPhoto: './src/assets/Memory Game/Players/JuniorLake.png',
        manager: 'Roberto Kelly',
        managerPhoto: './src/assets/Memory Game/Managers/RobertoKelly.png'
    },
    {
        id: 'charros',
        name: 'Charros de Jalisco',
        shortName: 'Charros',
        logo: './src/assets/Charros logo.png',
        player: 'Christian Villanueva',
        playerPhoto: './src/assets/Memory Game/Players/ChristianVillanueva.png',
        manager: 'Benjamín Gil',
        managerPhoto: './src/assets/Memory Game/Managers/BenjaminGil.png'
    },
    {
        id: 'acereros',
        name: 'Acereros de Monclova',
        shortName: 'Acereros',
        logo: './src/assets/acereros logo.png',
        player: 'Addison Russell',
        playerPhoto: './src/assets/Memory Game/Players/AddisonRussell.png',
        manager: 'Juan Gabriel Castro',
        managerPhoto: './src/assets/Memory Game/Managers/JuanGabrielCastro.png'
    },
    {
        id: 'rieleros',
        name: 'Rieleros de Aguascalientes',
        shortName: 'Rieleros',
        logo: './src/assets/rieleros logo.png',
        player: 'Ángel Reyes',
        playerPhoto: './src/assets/Memory Game/Players/AngelReyes.png',
        manager: 'Enrique Reyes',
        managerPhoto: './src/assets/Memory Game/Managers/EnriqueReyes.png'
    },
    {
        id: 'saraperos',
        name: 'Saraperos de Saltillo',
        shortName: 'Saraperos',
        logo: './src/assets/saraperos logo.png',
        player: 'Henry Urrutia',
        playerPhoto: './src/assets/Memory Game/Players/HenryUrrutia.png',
        manager: 'José Molina',
        managerPhoto: './src/assets/Memory Game/Managers/JoseMolina.png'
    },
    {
        id: 'tecos',
        name: 'Tecos de los Dos Laredos',
        shortName: 'Tecos',
        logo: './src/assets/tecos logo.png',
        player: 'Kennys Vargas',
        playerPhoto: './src/assets/Memory Game/Players/KennysVargas.png',
        manager: 'Mendy López',
        managerPhoto: './src/assets/Memory Game/Managers/MendyLopez.png'
    },
    {
        id: 'dorados',
        name: 'Dorados de Chihuahua',
        shortName: 'Dorados',
        logo: './src/assets/dorados logo.png',
        player: 'Sebastián Elizalde',
        playerPhoto: './src/assets/Memory Game/Players/SebastianElizalde.png',
        manager: 'Tony DeFrancesco',
        managerPhoto: './src/assets/Memory Game/Managers/TonyDeFrancesco.png'
    },
    {
        id: 'algodoneros',
        name: 'Algodoneros de Unión Laguna',
        shortName: 'Algodoneros',
        logo: './src/assets/algodoneros logo.png',
        player: 'Nick Torres',
        playerPhoto: './src/assets/Memory Game/Players/NickTorres.png',
        manager: 'Ramón Santiago',
        managerPhoto: './src/assets/Memory Game/Managers/RamonSantiago.png'
    },
    {
        id: 'caliente',
        name: 'Caliente de Durango',
        shortName: 'Caliente',
        logo: './src/assets/calientes logo.png',
        player: 'Jonathan Villar',
        playerPhoto: './src/assets/Memory Game/Players/JonathanVillar.png',
        manager: 'Óscar Robles',
        managerPhoto: './src/assets/Memory Game/Managers/OscarRobles.png'
    }
];

// Estado global del juego
let currentDifficulty = 'facil'; // 'facil' | 'medio' | 'dificil'
let cardsData = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 5;
let moves = 0;
let timerSeconds = 0;
let timerInterval = null;
let isBoardLocked = false;
let gameStarted = false;

document.addEventListener('DOMContentLoaded', () => {
    initControls();
    startNewGame('facil');
});

// Inicializar botones y listeners
function initControls() {
    const diffButtons = document.querySelectorAll('.diff-btn');
    diffButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const selectedDiff = e.currentTarget.getAttribute('data-diff');
            if (selectedDiff && selectedDiff !== currentDifficulty) {
                diffButtons.forEach(b => {
                    b.classList.remove('bg-[#C1121F]', 'text-white', 'shadow-md');
                    b.classList.add('bg-white', 'text-slate-700');
                });
                e.currentTarget.classList.remove('bg-white', 'text-slate-700');
                e.currentTarget.classList.add('bg-[#C1121F]', 'text-white', 'shadow-md');

                startNewGame(selectedDiff);
            }
        });
    });

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            startNewGame(currentDifficulty);
        });
    }

    const modalPlayAgain = document.getElementById('victory-play-again-btn');
    if (modalPlayAgain) {
        modalPlayAgain.addEventListener('click', () => {
            const modal = document.getElementById('victory-modal');
            if (modal) modal.classList.add('hidden');
            startNewGame(currentDifficulty);
        });
    }
}

// Iniciar nueva partida según la dificultad
function startNewGame(difficulty) {
    currentDifficulty = difficulty;
    clearInterval(timerInterval);
    timerInterval = null;
    timerSeconds = 0;
    moves = 0;
    matchedPairs = 0;
    flippedCards = [];
    isBoardLocked = false;
    gameStarted = false;

    updateStatsDisplay();

    // Actualizar indicador de dificultad
    const diffLabel = document.getElementById('current-mode-label');
    if (diffLabel) {
        if (difficulty === 'facil') {
            diffLabel.textContent = 'Fácil (10 Cartas: 5 Equipos y sus Jugadores)';
        } else if (difficulty === 'medio') {
            diffLabel.textContent = 'Medio (20 Cartas: 10 Equipos y sus Jugadores)';
        } else {
            diffLabel.textContent = 'Difícil (20 Cartas: 10 Equipos y sus Mánagers)';
        }
    }

    // Generar cartas
    cardsData = generateCards(difficulty);
    totalPairs = cardsData.length / 2;
    updateStatsDisplay();

    // Renderizar tablero
    renderBoard();
}

// Generar baraja según la dificultad
function generateCards(difficulty) {
    let teamsSubset = [];

    if (difficulty === 'facil') {
        // 5 equipos principales (10 cartas)
        teamsSubset = MEMORY_TEAMS.slice(0, 5);
    } else {
        // Los 10 equipos completos (20 cartas)
        teamsSubset = MEMORY_TEAMS.slice(0, 10);
    }

    const deck = [];

    teamsSubset.forEach(team => {
        // Carta 1: Escudo del equipo
        deck.push({
            matchId: team.id,
            cardType: 'team',
            teamName: team.name,
            shortName: team.shortName,
            title: team.shortName,
            subtitle: 'Equipo LMB',
            image: team.logo
        });

        // Carta 2: Jugador estrella o Mánager
        if (difficulty === 'dificil') {
            // Mánager oficial con su foto .png
            deck.push({
                matchId: team.id,
                cardType: 'manager',
                teamName: team.name,
                shortName: team.shortName,
                title: team.manager,
                subtitle: `Mánager de ${team.shortName}`,
                image: team.managerPhoto || team.logo,
                teamLogo: team.logo,
                isManager: true
            });
        } else {
            // Jugador estrella
            deck.push({
                matchId: team.id,
                cardType: 'player',
                teamName: team.name,
                shortName: team.shortName,
                title: team.player,
                subtitle: `Estrella de ${team.shortName}`,
                image: team.playerPhoto || team.logo,
                isPlayer: true
            });
        }
    });

    // Barajado aleatorio (Fisher-Yates)
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
}

// Renderizar las cartas en el contenedor del DOM
function renderBoard() {
    const grid = document.getElementById('cards-grid');
    if (!grid) return;

    grid.innerHTML = '';

    // Ajustar columnas de la cuadrícula
    if (currentDifficulty === 'facil') {
        grid.className = 'w-full max-w-sm sm:max-w-xl md:w-[90vw] md:max-w-4xl lg:max-w-5xl grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 md:gap-5 justify-center';
    } else {
        grid.className = 'w-full max-w-sm sm:max-w-2xl md:w-[90vw] md:max-w-4xl lg:max-w-5xl grid grid-cols-4 sm:grid-cols-5 gap-2.5 sm:gap-3.5 md:gap-4 justify-center';
    }

    cardsData.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card aspect-[3/4] relative select-none cursor-pointer';
        cardEl.setAttribute('data-index', index);
        cardEl.setAttribute('data-match-id', card.matchId);

        let frontContentHtml = '';

        if (card.cardType === 'team') {
            // Carta de Equipo
            frontContentHtml = `
                <div class="w-full h-full p-2.5 sm:p-3 flex flex-col items-center justify-between bg-white border-2 border-slate-800 rounded-xl sm:rounded-2xl shadow-md">
                    <span class="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-500">EQUIPO</span>
                    <div class="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 flex items-center justify-center my-auto">
                        <img src="${card.image}" alt="${card.title}" class="max-w-full max-h-full object-contain drop-shadow" />
                    </div>
                    <span class="font-['Poppins',sans-serif] font-bold text-[10px] sm:text-xs text-slate-900 text-center leading-tight">
                        ${card.title}
                    </span>
                </div>
            `;
        } else if (card.isManager) {
            // Carta de Mánager con foto oficial .png
            frontContentHtml = `
                <div class="w-full h-full p-2 sm:p-2.5 flex flex-col items-center justify-between bg-gradient-to-b from-[#0A1A32] to-[#132c54] text-white border-2 border-amber-400 rounded-xl sm:rounded-2xl shadow-md overflow-hidden relative">
                    <span class="absolute top-1.5 left-1.5 z-10 text-[7px] sm:text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 shadow-sm">MÁNAGER</span>
                    <div class="w-full h-[62%] sm:h-[65%] rounded-lg overflow-hidden bg-slate-900/60 flex items-center justify-center p-1 mt-3">
                        <img src="${card.image}" alt="${card.title}" class="w-full h-full object-contain object-bottom drop-shadow-md" />
                    </div>
                    <div class="text-center w-full mt-1">
                        <p class="font-['Poppins',sans-serif] font-bold text-[10px] sm:text-xs text-amber-300 leading-tight truncate">
                            ${card.title}
                        </p>
                        <span class="text-[8px] sm:text-[9px] text-white/80 block truncate">
                            ${card.shortName}
                        </span>
                    </div>
                </div>
            `;
        } else {
            // Carta de Jugador con foto oficial .png
            frontContentHtml = `
                <div class="w-full h-full p-2 sm:p-2.5 flex flex-col items-center justify-between bg-white border-2 border-[#C1121F] rounded-xl sm:rounded-2xl shadow-md overflow-hidden relative">
                    <span class="absolute top-1.5 left-1.5 z-10 text-[7px] sm:text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#C1121F] text-white shadow-sm">JUGADOR</span>
                    <div class="w-full h-[62%] sm:h-[65%] rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center p-1 mt-3">
                        <img src="${card.image}" alt="${card.title}" class="w-full h-full object-contain object-bottom drop-shadow-sm" />
                    </div>
                    <div class="text-center w-full mt-1">
                        <span class="font-['Poppins',sans-serif] font-bold text-[10px] sm:text-xs text-slate-900 block leading-tight truncate">
                            ${card.title}
                        </span>
                        <span class="text-[8px] sm:text-[9px] text-[#C1121F] font-semibold block truncate">
                            ${card.shortName}
                        </span>
                    </div>
                </div>
            `;
        }

        cardEl.innerHTML = `
            <div class="memory-card-inner w-full h-full relative transition-transform duration-500 [transform-style:preserve-3d]">
                <!-- Reverso de la Carta -->
                <div class="memory-card-back absolute inset-0 w-full h-full bg-white rounded-xl sm:rounded-2xl border-t-0 border-l-0 border-b-[5px] border-r-[5px] md:border-b-8 md:border-r-8 border-b-black border-r-black shadow-md flex items-center justify-center p-2 sm:p-4 hover:scale-105 active:scale-95 transition-all [backface-visibility:hidden]">
                    <img src="./src/assets/NorthBaseLogo.png" alt="NorthBase" class="max-h-[55%] max-w-[55%] object-contain drop-shadow-sm pointer-events-none" />
                </div>

                <!-- Frente de la Carta -->
                <div class="memory-card-front absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    ${frontContentHtml}
                </div>
            </div>
        `;

        cardEl.addEventListener('click', () => handleCardClick(cardEl, card));
        grid.appendChild(cardEl);
    });
}

// Clic sobre una carta
function handleCardClick(cardEl, cardData) {
    if (isBoardLocked) return;
    if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

    // Iniciar cronómetro al primer clic de la partida
    if (!gameStarted) {
        gameStarted = true;
        startTimer();
    }

    // Voltear carta
    cardEl.classList.add('flipped');
    flippedCards.push({ element: cardEl, data: cardData });

    if (flippedCards.length === 2) {
        moves++;
        updateStatsDisplay();
        checkMatch();
    }
}

// Evaluar si las dos cartas volteadas coinciden
function checkMatch() {
    isBoardLocked = true;
    const [card1, card2] = flippedCards;

    const isMatch = card1.data.matchId === card2.data.matchId;

    if (isMatch) {
        // ¡Coincidencia!
        matchedPairs++;
        updateStatsDisplay();

        setTimeout(() => {
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');

            // Efecto visual de hit
            card1.element.querySelector('.memory-card-front').classList.add('ring-4', 'ring-emerald-400', 'ring-offset-2');
            card2.element.querySelector('.memory-card-front').classList.add('ring-4', 'ring-emerald-400', 'ring-offset-2');

            flippedCards = [];
            isBoardLocked = false;

            // Verificar si ganó la partida
            if (matchedPairs === totalPairs) {
                handleVictory();
            }
        }, 400);

    } else {
        // No coinciden: dar tiempo para memorizar y volver a voltear
        setTimeout(() => {
            card1.element.classList.remove('flipped');
            card2.element.classList.remove('flipped');
            flippedCards = [];
            isBoardLocked = false;
        }, 1000);
    }
}

// Cronómetro del juego
function startTimer() {
    timerInterval = setInterval(() => {
        timerSeconds++;
        updateStatsDisplay();
    }, 1000);
}

// Formatear segundos a MM:SS
function formatTime(totalSecs) {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Actualizar contadores en la interfaz
function updateStatsDisplay() {
    const timerEl = document.getElementById('timer-display');
    const movesEl = document.getElementById('moves-display');
    const pairsEl = document.getElementById('pairs-display');

    if (timerEl) timerEl.textContent = formatTime(timerSeconds);
    if (movesEl) movesEl.textContent = moves;
    if (pairsEl) pairsEl.textContent = `${matchedPairs} / ${totalPairs}`;
}

// Manejo de la Victoria
async function handleVictory() {
    clearInterval(timerInterval);

    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    // Mostrar modal de victoria
    const modal = document.getElementById('victory-modal');
    const finalTimeEl = document.getElementById('victory-final-time');
    const finalMovesEl = document.getElementById('victory-final-moves');
    const finalDiffEl = document.getElementById('victory-final-diff');
    const syncStatusEl = document.getElementById('victory-sync-status');

    if (finalTimeEl) finalTimeEl.textContent = formatTime(timerSeconds);
    if (finalMovesEl) finalMovesEl.textContent = `${moves} movimientos`;
    if (finalDiffEl) finalDiffEl.textContent = currentDifficulty.toUpperCase();

    if (modal) {
        modal.classList.remove('hidden');
    }

    // Guardar en la base de datos MySQL si está autenticado
    if (user && user.id_usuario) {
        if (syncStatusEl) {
            syncStatusEl.textContent = 'Guardando récord en la base de datos...';
            syncStatusEl.className = 'text-xs text-amber-600 font-semibold mt-2';
        }

        try {
            const response = await fetch(`${API_BASE_URL}/memorama/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_usuario: user.id_usuario,
                    dificultad: currentDifficulty,
                    movimientos: moves,
                    tiempo_segundos: timerSeconds,
                    completado: true
                })
            });

            if (response.ok) {
                if (syncStatusEl) {
                    syncStatusEl.innerHTML = '✓ ¡Récord guardado y coleccionable desbloqueado en tu perfil!';
                    syncStatusEl.className = 'text-xs text-emerald-600 font-semibold mt-2';
                }
            } else {
                if (syncStatusEl) {
                    syncStatusEl.textContent = 'Partida completada localmente.';
                }
            }
        } catch (err) {
            console.warn('Error al guardar partida de memorama:', err);
            if (syncStatusEl) {
                syncStatusEl.textContent = 'Partida completada.';
            }
        }
    } else {
        if (syncStatusEl) {
            syncStatusEl.innerHTML = '<a href="./login.html" class="underline text-[#C1121F]">Inicia sesión</a> para guardar tus récords y ganar coleccionables.';
            syncStatusEl.className = 'text-xs text-slate-500 mt-2 block';
        }
    }
}
