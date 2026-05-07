let games = [];
let filteredGames = [];
let activeCategory = 'All';
let searchQuery = '';

// DOM Elements
const gameGrid = document.getElementById('game-grid');
const searchInput = document.getElementById('search-input');
const categoryContainer = document.getElementById('category-list');
const gameModal = document.getElementById('game-modal');
const closeBtn = document.getElementById('close-modal');
const modalFrame = document.getElementById('modal-frame');
const modalTitle = document.getElementById('modal-title');
const modalCategory = document.getElementById('modal-category');
const modalDescription = document.getElementById('modal-description');
const gameCount = document.getElementById('game-count');

// Initialize
async function init() {
    try {
        const response = await fetch('./games.json');
        games = await response.json();
        filteredGames = [...games];
        renderCategories();
        renderGames();
    } catch (error) {
        console.error('Failed to load games:', error);
    }
}

function renderCategories() {
    const categories = ['All', ...new Set(games.map(g => g.category))];
    categoryContainer.innerHTML = categories.map(cat => `
        <button 
            onclick="setCategory('${cat}')"
            class="category-btn px-3 py-2 text-left text-[11px] font-bold uppercase transition-all border-l-2 ${activeCategory === cat ? 'bg-[#00FF00]/10 border-[#00FF00] text-[#00FF00]' : 'border-transparent text-[#555] hover:text-white hover:bg-[#111]'}"
            data-category="${cat}"
        >
            ${cat}
        </button>
    `).join('');
}

function renderGames() {
    gameGrid.innerHTML = filteredGames.map((game, i) => `
        <div class="group relative cursor-pointer" onclick="openGame('${game.id}')">
            <div class="relative aspect-[16/10] overflow-hidden border-2 border-[#222] bg-[#111] transition-colors group-hover:border-[#00FF00]">
                <img 
                    src="${game.thumbnail}" 
                    alt="${game.title}"
                    class="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105"
                    referrerpolicy="no-referrer"
                >
                <div class="absolute top-2 left-2 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 text-[8px] font-mono tracking-widest text-[#00FF00] uppercase">
                    ${game.category}
                </div>
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-20 transition-opacity"></div>
                <div class="absolute inset-0 flex items-center justify-center translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                    <div class="px-6 py-2 bg-[#00FF00] text-black text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_0_20px_#00FF0044]">
                        Initialize
                    </div>
                </div>
            </div>
            <div class="mt-4 flex items-start justify-between">
                <div class="space-y-1">
                    <h3 class="text-sm font-black uppercase tracking-tight group-hover:text-[#00FF00] transition-colors">
                        ${game.title}
                    </h3>
                    <p class="text-[10px] font-medium text-[#444] line-clamp-1 max-w-[200px]">
                        ${game.description}
                    </p>
                </div>
                <div class="text-[9px] font-mono text-[#222] group-hover:text-[#444] transition-colors">
                    #${(i + 1).toString().padStart(3, '0')}
                </div>
            </div>
        </div>
    `).join('');
    
    gameCount.textContent = `${filteredGames.length} NODES_LOCALIZED`;

    if (filteredGames.length === 0) {
        gameGrid.innerHTML = `
            <div class="col-span-full py-20 flex flex-col items-center justify-center border border-[#222] bg-[#111]/50 backdrop-blur-sm">
                <div class="text-[#00FF00] text-4xl mb-4 opacity-20">
                    <i data-lucide="gamepad-2" class="w-16 h-16"></i>
                </div>
                <div class="text-[#444] mb-2 uppercase font-black text-2xl tracking-tighter">Null_Reference</div>
                <p class="text-[#666] text-[10px] uppercase tracking-[0.3em]">No matching entities found</p>
            </div>
        `;
        lucide.createIcons();
    }
}

window.setCategory = (cat) => {
    activeCategory = cat;
    filterGames();
    renderCategories();
};

function filterGames() {
    filteredGames = games.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = activeCategory === 'All' || game.category === activeCategory;
        return matchesSearch && matchesCategory;
    });
    renderGames();
}

searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    filterGames();
});

window.openGame = (id) => {
    const game = games.find(g => g.id === id);
    if (!game) return;

    modalTitle.textContent = game.title;
    modalCategory.textContent = `${game.category}_MODULE_ACTIVE`;
    modalDescription.textContent = game.description;

    // Cleanup previous state
    const existingPlayer = document.getElementById('ruffle-player');
    if (existingPlayer) existingPlayer.remove();
    modalFrame.classList.remove('hidden');

    if (game.isFlash) {
        modalFrame.classList.add('hidden');
        modalFrame.src = '';
        
        if (window.RufflePlayer) {
            const ruffle = window.RufflePlayer.newest();
            const player = ruffle.createPlayer();
            player.id = 'ruffle-player';
            player.style.width = '100%';
            player.style.height = '100%';
            modalFrame.parentNode.appendChild(player);
            player.load(game.url);
        } else {
            modalDescription.textContent = 'RUFFLE_EMULATOR_MISSING';
        }
    } else {
        modalFrame.setAttribute('allow', 'autoplay; focus-without-user-activation; fullscreen; gamepad; microphone; midi; xr-spatial-tracking; screen-wake-lock');
        modalFrame.setAttribute('sandbox', 'allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-scripts allow-same-origin');
        modalFrame.src = game.url;
    }

    gameModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

closeBtn.addEventListener('click', () => {
    gameModal.classList.add('hidden');
    modalFrame.src = '';
    const existingPlayer = document.getElementById('ruffle-player');
    if (existingPlayer) existingPlayer.remove();
    document.body.style.overflow = '';
});

// Close modal on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !gameModal.classList.contains('hidden')) {
        closeBtn.click();
    }
});

init();
