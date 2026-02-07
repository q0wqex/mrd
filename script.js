const ROLES_DB = {
    MAFIA: { name: 'Мафия', icon: 'crosshair', color: 'border-mafia', bg: 'bg-mafia', desc: 'Устраните всех мирных жителей' },
    BOSS: { name: 'Босс', icon: 'crown', color: 'border-boss', bg: 'bg-boss', desc: 'Неуязвим для проверок комиссара' },
    CIVILIAN: { name: 'Мирный', icon: 'users', color: 'border-civilian', bg: 'bg-civilian', desc: 'Вычислите предателей среди своих' },
    COMMISSIONER: { name: 'Комиссар', icon: 'search', color: 'border-comm', bg: 'bg-comm', desc: 'Проверяйте роли игроков ночью' },
    DOCTOR: { name: 'Доктор', icon: 'heart-pulse', color: 'border-doc', bg: 'bg-doc', desc: 'Лечите выбранного игрока ночью' },
    BEAUTY: { name: 'Красотка', icon: 'sparkles', color: 'border-beauty', bg: 'bg-beauty', desc: 'Отвлекайте игроков и блокируйте босса' },
    MANIAC: { name: 'Маньяк', icon: 'skull', color: 'border-maniac', bg: 'bg-maniac', desc: 'Убейте всех, чтобы победить соло' },
    KAMIKAZE: { name: 'Камикадзе', icon: 'bomb', color: 'border-kamikaze', bg: 'bg-kamikaze', desc: 'Если вас убьют, вы заберете убийцу с собой' }
};

const config = [
    { id: 'BOSS', name: 'Босс мафии', icon: 'briefcase', active: true },
    { id: 'COMMISSIONER', name: 'Комиссар', icon: 'search', active: true },
    { id: 'DOCTOR', name: 'Доктор', icon: 'shield-plus', active: true },
    { id: 'BEAUTY', name: 'Красотка', icon: 'heart', active: false },
    { id: 'MANIAC', name: 'Маньяк', icon: 'axe', active: false },
    { id: 'KAMIKAZE', name: 'Камикадзе', icon: 'bomb', active: false }
];

let gameSession = [];
let currIdx = 0;

// Initialize Lucide
window.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});

// Render Sidebar Toggles
const roleListElement = document.getElementById('roleList');
if (roleListElement) {
    config.forEach(role => {
        const label = document.createElement('label');
        label.className = 'glass role-toggle';
        label.innerHTML = `
            <div class="toggle-info">
                <span class="toggle-icon"><i data-lucide="${role.icon}"></i></span>
                <span class="toggle-name">${role.name}</span>
            </div>
            <input type="checkbox" id="role-${role.id}" style="display: none;" ${role.active ? 'checked' : ''}>
            <div class="switch"></div>
        `;
        roleListElement.appendChild(label);
    });
    lucide.createIcons();
}

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const startBtn = document.getElementById('startBtn');
if (startBtn) {
    startBtn.onclick = () => {
        const playerCountInput = document.getElementById('playerCount');
        const n = parseInt(playerCountInput.value);
        if (n < 4) return alert('Минимум 4 игрока');

        gameSession = [];
        let mafCount = Math.floor(n / 3);

        const bossCheck = document.getElementById('role-BOSS');
        if (bossCheck && bossCheck.checked && mafCount > 0) {
            gameSession.push(ROLES_DB.BOSS);
            mafCount--;
        }
        while (mafCount-- > 0) gameSession.push(ROLES_DB.MAFIA);

        const commCheck = document.getElementById('role-COMMISSIONER');
        if (commCheck && commCheck.checked) gameSession.push(ROLES_DB.COMMISSIONER);

        const docCheck = document.getElementById('role-DOCTOR');
        if (docCheck && docCheck.checked) gameSession.push(ROLES_DB.DOCTOR);

        const beautyCheck = document.getElementById('role-BEAUTY');
        if (beautyCheck && beautyCheck.checked) gameSession.push(ROLES_DB.BEAUTY);

        const maniacCheck = document.getElementById('role-MANIAC');
        if (maniacCheck && maniacCheck.checked) gameSession.push(ROLES_DB.MANIAC);

        const kamikazeCheck = document.getElementById('role-KAMIKAZE');
        if (kamikazeCheck && kamikazeCheck.checked) gameSession.push(ROLES_DB.KAMIKAZE);

        if (gameSession.length > n) return alert('Слишком много ролей!');
        while (gameSession.length < n) gameSession.push(ROLES_DB.CIVILIAN);

        shuffle(gameSession);
        currIdx = 0;

        document.getElementById('sidebar').classList.add('hidden');
        document.getElementById('revealZone').classList.remove('hidden');

        const card = document.getElementById('mainCard');
        if (card) card.classList.remove('is-flipped');

        const mainHeader = document.getElementById('mainHeader');
        if (mainHeader) {
            mainHeader.style.transform = 'scale(0.8)';
            mainHeader.style.marginBottom = '1rem';
        }
        updateRevealState();
    };
}

function updateRevealState() {
    const role = gameSession[currIdx];

    const playerHeading = document.getElementById('playerHeading');
    if (playerHeading) playerHeading.innerText = `Игрок #${currIdx + 1}`;

    const statusHint = document.getElementById('statusHint');
    if (statusHint) statusHint.innerText = 'Нажмите на карту, чтобы открыть роль';

    const front = document.getElementById('cardFront');
    if (front) {
        front.className = `card-face card-front glass ${role.bg} ${role.color}`;
        document.getElementById('rIcon').innerHTML = `<i data-lucide="${role.icon}" style="width: 64px; height: 64px;"></i>`;
        document.getElementById('rName').innerText = role.name;
        document.getElementById('rDesc').innerText = role.desc;
    }
    lucide.createIcons();
}

function showSummary() {
    document.getElementById('revealZone').classList.add('hidden');
    document.getElementById('summaryZone').classList.remove('hidden');
    const grid = document.getElementById('summaryGrid');
    if (grid) {
        grid.innerHTML = '';
        gameSession.forEach((role, i) => {
            const div = document.createElement('div');
            div.className = `glass summary-card ${role.bg} ${role.color}`;
            div.innerHTML = `
                <div class="card-info">
                    <span class="player-num serif">${(i + 1).toString().padStart(2, '0')}</span>
                    <span class="role-name-mini serif">${role.name}</span>
                </div>
                <span><i data-lucide="${role.icon}" style="width: 20px; height: 20px;"></i></span>
            `;
            div.onclick = () => div.classList.toggle('eliminated');
            grid.appendChild(div);
        });
        lucide.createIcons();
    }
}

const mainCard = document.getElementById('mainCard');
if (mainCard) {
    mainCard.onclick = () => {
        if (!mainCard.classList.contains('is-flipped')) {
            // Flip to reveal role
            mainCard.classList.add('is-flipped');
            const statusHint = document.getElementById('statusHint');
            if (statusHint) statusHint.innerText = 'Запомните роль и нажмите еще раз';
        } else {
            // Proceed to next player or summary
            if (currIdx < gameSession.length - 1) {
                // Remove flip first
                mainCard.classList.remove('is-flipped');
                const statusHint = document.getElementById('statusHint');
                if (statusHint) statusHint.innerText = 'Готовим роль...';

                currIdx++;

                // Delay content update to avoid flash
                setTimeout(() => {
                    updateRevealState();
                }, 400);
            } else {
                showSummary();
            }
        }
    };
}
