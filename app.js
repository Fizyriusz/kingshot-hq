// === KROK 1: KONFIGURACJA SUPABASE ===
const SUPABASE_URL = 'https://tkpadqrbkknrscxjtatr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcGFkcXJia2tucnNjeGp0YXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzAxMDEsImV4cCI6MjA3NjY0NjEwMX0._KoZoOjLVW_2JxM8FBVLXuPQkJ5lP3tgCMPrgTj9q0A';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === SŁOWNIK TŁUMACZEŃ (ZAKTUALIZOWANY O SORTOWANIE) ===
const translations = {
    pl: {
        appTitle: "Kingshot HQ - Centrum Dowodzenia",
        logout: "Wyloguj",
        loginTitle: "Logowanie",
        loginButton: "Zaloguj",
        emailPlaceholder: "Email",
        passwordPlaceholder: "Hasło",
        tabMembers: "Członkowie",
        tabEvents: "Eventy",
        tabSnapshots: "Snapshoty",
        addSingleMember: "Dodaj Pojedynczego Członka",
        playerNamePlaceholder: "Nazwa nowego gracza",
        thPlaceholder: "TH Lvl",
        powerPlaceholder: "Power (np. 122,8m)",
        marchesPlaceholder: "Marsze?",
        addButton: "Dodaj",
        bulkAdd: "Dodawanie Hurtowe",
        bulkAddPlaceholder: "Wklej listę graczy: Nazwa, TH, Power (np. 122,8m)",
        addAllButton: "Dodaj wszystkich z listy",
        showInactive: "Pokaż nieaktywnych",
        activeMembers: "Aktywni Członkowie",
        inactiveMembers: "Nieaktywni Członkowie",
        manageEvents: "Zarządzanie Eventami",
        eventNamePlaceholder: "Nazwa nowego eventu",
        createEventButton: "Stwórz Event",
        manageSnapshots: "Zarządzanie Snapshotami",
        snapshotDescription: "Snapshot zapisuje aktualny stan (TH, Power, Marsze) wszystkich **aktywnych** graczy. Rób to regularnie, np. raz w tygodniu, aby śledzić postępy.",
        createSnapshotButton: "Stwórz nowy snapshot",
        snapshotHistory: "Historia Snapshotów",
        invalidLogin: "Nieprawidłowy email lub hasło.",
        reasonLabel: "Powód",
        noReason: "Brak",
        restore: "Przywróć",
        delete: "Usuń",
        lvlPlaceholder: "Lvl",
        powerPlaceholderShort: "np. 122,8m",
        marchesLabel: "Marsze",
        powerLabel: "Power",
        thLabel: "TH",
        deleteConfirm: (name) => `Czy na pewno chcesz usunąć gracza "${name}"? Podaj powód.`,
        restoreConfirm: "Czy na pewno chcesz przywrócić tego gracza?",
        playerAddError: "Nie udało się dodać gracza (może już istnieje?).",
        playerAddSuccess: (count) => `Pomyślnie dodano ${count} graczy!`,
        bulkParseError: (msg) => `Błąd przetwarzania danych: ${msg}\n\nUpewnij się, że format to: Nazwa, TH, Power`,
        bulkInsertError: (msg) => `Nie udało się dodać graczy. Błąd: ${msg}\n\n(Prawdopodobnie któryś z graczy już istnieje)`,
        playerUpdateError: "Nie udało się zaktualizować danych gracza.",
        playerDeleteError: "Błąd usuwania gracza.",
        playerRestoreError: "Błąd przywracania gracza.",
        eventAddError: "Nie udało się dodać eventu.",
        snapshotFromDate: "Snapshot z dnia",
        snapshotDetailTitle: (date) => `Snapshot z dnia: ${date}`,
        backToList: "Powrót do listy",
        loadingError: "Nie udało się załadować danych.",
        noHistory: "Brak zapisanej historii. Stwórz swój pierwszy snapshot!",
        snapshotConfirm: "Czy na pewno chcesz zapisać snapshot stanu wszystkich AKTYWNYCH graczy?",
        snapshotFetchError: "Błąd pobierania danych graczy. Snapshot anulowany.",
        snapshotSaveError: (msg) => `Nie udało się zapisać snapshotu. Błąd: ${msg}`,
        snapshotSaveSuccess: (count) => `Pomyślnie zapisano snapshot dla ${count} graczy!`,
        groupCreateError: "Błąd tworzenia grupy.",
        groupAddPlayerError: "Błąd dodawania gracza do grupy.",
        groupRemoveConfirm: "Na pewno usunąć gracza z grupy?",
        groupRemoveError: "Błąd usuwania z grupy.",
        statusUpdateError: "Błąd aktualizacji statusu.",
        statusUndefined: "Nieokreślony",
        statusActive: "Aktywny",
        statusInactive: "Nieaktywny",
        statusProblem: "Problem",
        noGroupMembers: "Brak członków w tej grupie.",
        manageEventTitle: (name) => `Zarządzanie eventem: ${name}`,
        createGroupPlaceholder: "Nazwa nowej grupy",
        createGroupButton: "Stwórz grupę",
        selectPlayer: "Wybierz gracza...",
        deleteEventConfirm: (name) => `Czy na pewno chcesz usunąć event "${name}"? Spowoduje to usunięcie wszystkich jego grup i uczestników.`,
        eventDeleteError: "Błąd usuwania eventu.",
        renameGroupPrompt: "Wprowadź nową nazwę dla grupy:",
        groupRenameError: "Błąd zmiany nazwy grupy.",
        filterByMarches: "Filtruj marsze:",
        all: "Wszyscy",
        noAvailablePlayers: "Brak dostępnych graczy (lub wszyscy pasujący do filtra są już w grupach).",
        filterByName: "Filtruj po nicku:",
        filterByPower: "Filtruj po power:",
        bulkUpdateMarches: "Hurtowa Aktualizacja Marszy",
        bulkUpdatePlaceholder: "Wklej listę: Nazwa, Marsze (np. GraczA, 5)",
        updateMarchesButton: "Aktualizuj Marsze",
        bulkUpdateError: (msg) => `Nie udało się zaktualizować marszy. Błąd: ${msg}`,
        bulkUpdateSuccess: (count) => `Pomyślnie zaktualizowano marsze dla ${count} graczy!`,
        invalidMarchesValue: (val) => `Nieprawidłowa wartość marszy "${val}". Dozwolone: 4, 5, 6.`,
        nameFilterPlaceholder: "Wpisz nick...",
        powerFilterPlaceholder: "Wpisz moc...",
        statisticsTitle: "Statystyki",
        unlockedUnits: "Odblokowane Jednostki",
        tier8: "T8 (TH 22-25)",
        tier9: "T9 (TH 26-29)",
        tier10: "T10 (TH 30+)",
        powerBrackets: "Przedziały Mocy",
        powerBracketLabel: (bracket) => `+${bracket}m`,
        // NOWE TŁUMACZENIA DLA SORTOWANIA
        sortBy: "Sortuj po:",
        sortName: "Nick",
        sortTH: "TH",
        sortPower: "Power",
        sortMarches: "Marsze"
    },
    en: {
        appTitle: "Kingshot HQ - Command Center",
        logout: "Logout",
        loginTitle: "Login",
        loginButton: "Login",
        emailPlaceholder: "Email",
        passwordPlaceholder: "Password",
        tabMembers: "Members",
        tabEvents: "Events",
        tabSnapshots: "Snapshots",
        addSingleMember: "Add Single Member",
        playerNamePlaceholder: "New player's name",
        thPlaceholder: "TH Lvl",
        powerPlaceholder: "Power (e.g. 122.8m)",
        marchesPlaceholder: "Marches?",
        addButton: "Add",
        bulkAdd: "Bulk Add",
        bulkAddPlaceholder: "Paste player list: Name, TH, Power (comma separated, one per line)",
        addAllButton: "Add All From List",
        showInactive: "Show inactive",
        activeMembers: "Active Members",
        inactiveMembers: "Inactive Members",
        manageEvents: "Manage Events",
        eventNamePlaceholder: "New event name",
        createEventButton: "Create Event",
        manageSnapshots: "Manage Snapshots",
        snapshotDescription: "A snapshot saves the current state (TH, Power, Marches) of all **active** players. Do this regularly (e.g., weekly) to track progress.",
        createSnapshotButton: "Create new snapshot",
        snapshotHistory: "Snapshot History",
        invalidLogin: "Invalid email or password.",
        reasonLabel: "Reason",
        noReason: "None",
        restore: "Restore",
        delete: "Delete",
        lvlPlaceholder: "Lvl",
        powerPlaceholderShort: "e.g. 122.8m",
        marchesLabel: "Marches",
        powerLabel: "Power",
        thLabel: "TH",
        deleteConfirm: (name) => `Are you sure you want to remove "${name}"? Provide a reason.`,
        restoreConfirm: "Are you sure you want to restore this player?",
        playerAddError: "Failed to add player (name might already exist).",
        playerAddSuccess: (count) => `Successfully added ${count} players!`,
        bulkParseError: (msg) => `Error parsing data: ${msg}\n\Make sure the format is: Name, TH, Power`,
        bulkInsertError: (msg) => `Failed to add players. Error: ${msg}\n\n(One of the players might already exist)`,
        playerUpdateError: "Failed to update player data.",
        playerDeleteError: "Error removing player.",
        playerRestoreError: "Error restoring player.",
        eventAddError: "Failed to add event.",
        snapshotFromDate: "Snapshot from",
        snapshotDetailTitle: (date) => `Snapshot from: ${date}`,
        backToList: "Back to list",
        loadingError: "Failed to load data.",
        noHistory: "No history saved. Create your first snapshot!",
        snapshotConfirm: "Are you sure you want to save a snapshot of all ACTIVE players?",
        snapshotFetchError: "Error fetching player data. Snapshot canceled.",
        snapshotSaveError: (msg) => `Failed to save snapshot. Error: ${msg}`,
        snapshotSaveSuccess: (count) => `Successfully saved snapshot for ${count} players!`,
        groupCreateError: "Error creating group.",
        groupAddPlayerError: "Error adding player to group.",
        groupRemoveConfirm: "Remove player from group?",
        groupRemoveError: "Error removing from group.",
        statusUpdateError: "Error updating status.",
        statusUndefined: "Undefined",
        statusActive: "Active",
        statusInactive: "Inactive",
        statusProblem: "Problem",
        noGroupMembers: "No members in this group.",
        manageEventTitle: (name) => `Managing Event: ${name}`,
        createGroupPlaceholder: "New group name",
        createGroupButton: "Create Group",
        selectPlayer: "Select player...",
        deleteEventConfirm: (name) => `Are you sure you want to delete the event "${name}"? This will delete all its groups and participants.`,
        eventDeleteError: "Error deleting event.",
        renameGroupPrompt: "Enter new name for the group:",
        groupRenameError: "Error renaming group.",
        filterByMarches: "Filter marches:",
        all: "All",
        noAvailablePlayers: "No available players (or all filtered players are already in groups).",
        filterByName: "Filter by name:",
        filterByPower: "Filter by power:",
        bulkUpdateMarches: "Bulk Update Marches",
        bulkUpdatePlaceholder: "Paste list: Name, Marches (e.g. PlayerA, 5)",
        updateMarchesButton: "Update Marches",
        bulkUpdateError: (msg) => `Failed to update marches. Error: ${msg}`,
        bulkUpdateSuccess: (count) => `Successfully updated marches for ${count} players!`,
        invalidMarchesValue: (val) => `Invalid marches value "${val}". Allowed: 4, 5, 6.`,
        nameFilterPlaceholder: "Enter name...",
        powerFilterPlaceholder: "Enter power...",
        statisticsTitle: "Statistics",
        unlockedUnits: "Unlocked Units",
        tier8: "T8 (TH 22-25)",
        tier9: "T9 (TH 26-29)",
        tier10: "T10 (TH 30+)",
        powerBrackets: "Power Brackets",
        powerBracketLabel: (bracket) => `+${bracket}m`,
        // NOWE TŁUMACZENIA DLA SORTOWANIA
        sortBy: "Sort by:",
        sortName: "Name",
        sortTH: "TH",
        sortPower: "Power",
        sortMarches: "Marches"
    }
};

let currentLang = localStorage.getItem('kingshotLang') || 'pl';
let currentTabId = 'members-view';
let eventDetailFilters = { marches: '', name: '', power: '' };
let memberFilters = { name: '', power: '' };
let memberSort = { column: 'name', direction: 'asc' }; // Stan sortowania członków

// FUNKCJE TŁUMACZEŃ
function t(key, args = null) { let string = translations[currentLang][key] || translations['en'][key] || key; if (typeof string === 'function') { return string(args); } return string; }
function setLanguage(lang) { currentLang = lang; localStorage.setItem('kingshotLang', lang); applyStaticTranslations(); switchTab(currentTabId, false); }
function applyStaticTranslations() {
    document.documentElement.lang = currentLang; document.title = t('appTitle');
    document.querySelectorAll('[data-translate-key]').forEach(el => { el.textContent = t(el.dataset.translateKey); });
    emailInput.placeholder = t('emailPlaceholder'); passwordInput.placeholder = t('passwordPlaceholder');
    playerNameInput.placeholder = t('playerNamePlaceholder'); playerThInput.placeholder = t('thPlaceholder'); playerPowerInput.placeholder = t('powerPlaceholder');
    bulkPlayersInput.placeholder = t('bulkAddPlaceholder'); eventNameInput.placeholder = t('eventNamePlaceholder');
    bulkMarchesInput.placeholder = t('bulkUpdatePlaceholder'); memberFilterNameInput.placeholder = t('nameFilterPlaceholder'); memberFilterPowerInput.placeholder = t('powerFilterPlaceholder');
    // Tłumaczenie przycisków sortowania
    document.querySelector('.sort-button[data-sort="name"]').textContent = t('sortName');
    document.querySelector('.sort-button[data-sort="th_level"]').textContent = t('sortTH');
    document.querySelector('.sort-button[data-sort="power_level"]').textContent = t('sortPower');
    document.querySelector('.sort-button[data-sort="marches"]').textContent = t('sortMarches');

    document.querySelectorAll('#lang-switcher button').forEach(btn => { btn.classList.toggle('active-lang', btn.dataset.lang === currentLang); });
}

// === POBRANIE ELEMENTÓW ===
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');
const logoutButton = document.getElementById('logout-button');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');
const tabs = document.querySelectorAll('#tab-nav button');
const tabPanes = document.querySelectorAll('.tab-pane');
const addPlayerForm = document.getElementById('add-player-form');
const playerNameInput = document.getElementById('player-name-input');
const playersListContainer = document.getElementById('players-list-container');
const addEventForm = document.getElementById('add-event-form');
const eventNameInput = document.getElementById('event-name-input');
const eventsListContainer = document.getElementById('events-list-container');
const bulkAddPlayersForm = document.getElementById('bulk-add-players-form');
const bulkPlayersInput = document.getElementById('bulk-players-input');
const playerThInput = document.getElementById('player-th-input');
const playerMarchesInput = document.getElementById('player-marches-input');
const playerPowerInput = document.getElementById('player-power-input');
const showInactiveToggle = document.getElementById('show-inactive-toggle');
const membersListHeader = document.getElementById('members-list-header');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const createSnapshotButton = document.getElementById('create-snapshot-button');
const snapshotsListContainer = document.getElementById('snapshots-list-container');
const bulkUpdateMarchesForm = document.getElementById('bulk-update-marches-form');
const bulkMarchesInput = document.getElementById('bulk-marches-input');
const memberFilterNameInput = document.getElementById('member-filter-name');
const memberFilterPowerInput = document.getElementById('member-filter-power');
const statsContent = document.getElementById('stats-content');
const sortControlsContainer = document.querySelector('.sort-controls');
const sortDirectionButton = document.getElementById('sort-direction-button');


// === LOGIKA APLIKACJI ===

function switchTab(tabId, updateCurrent = true) {
    if (updateCurrent) {
        currentTabId = tabId;
        if (tabId !== 'events-view') { eventDetailFilters = { marches: '', name: '', power: '' }; }
        if (tabId !== 'members-view') { memberFilters = { name: '', power: '' }; memberSort = { column: 'name', direction: 'asc' }; }
    }
    tabPanes.forEach(pane => pane.classList.add('hidden'));
    tabs.forEach(tab => tab.classList.remove('active-tab'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelector(`button[data-tab="${tabId}"]`).classList.add('active-tab');

    renderStatistics();

    if (tabId === 'members-view') { renderMembersView(); }
    else if (tabId === 'events-view') { renderEventsListView(); }
    else if (tabId === 'snapshots-view') { renderSnapshotsView(); }
}

// --- ZAKŁADKA "CZŁONKOWIE" ---

async function renderMembersView() {
    const showInactive = showInactiveToggle.checked;

    let query = supabaseClient.from('players').select('*').eq('is_active', !showInactive);

    if (memberSort.column !== 'power_level') {
        query = query.order(memberSort.column, { ascending: memberSort.direction === 'asc' });
    } else {
        query = query.order('name', { ascending: true }); // Domyślne sortowanie dla Power Level przed pobraniem
    }

    const { data: allPlayers, error } = await query;
    if (error) { console.error("Błąd pobierania graczy:", error); return; }

    let playersToRender = allPlayers;

    if (!showInactive) {
        if (memberFilters.name) { const filterName = memberFilters.name.toLowerCase(); playersToRender = playersToRender.filter(p => p.name.toLowerCase().includes(filterName)); }
        if (memberFilters.power) { const filterPower = memberFilters.power.toLowerCase(); playersToRender = playersToRender.filter(p => (p.power_level || '').toLowerCase().includes(filterPower)); }
        memberFilterNameInput.value = memberFilters.name;
        memberFilterPowerInput.value = memberFilters.power;

        if (memberSort.column === 'power_level') {
            playersToRender.sort((a, b) => {
                const powerA = parsePower(a.power_level);
                const powerB = parsePower(b.power_level);
                // Gracze bez mocy na końcu
                if (powerA === 0 && powerB !== 0) return memberSort.direction === 'asc' ? 1 : -1;
                if (powerB === 0 && powerA !== 0) return memberSort.direction === 'asc' ? -1 : 1;
                return memberSort.direction === 'asc' ? powerA - powerB : powerB - powerA;
            });
        }
    }

    document.querySelectorAll('.sort-button').forEach(btn => {
        btn.classList.toggle('active-sort', btn.dataset.sort === memberSort.column);
    });
    sortDirectionButton.textContent = memberSort.direction === 'asc' ? '🔼' : '🔽';
    sortDirectionButton.dataset.direction = memberSort.direction;

    if (showInactive) {
        membersListHeader.textContent = t('inactiveMembers');
         playersListContainer.innerHTML = playersToRender.map(player => `
            <div class="player-item">
                <span class="player-name">${player.name}</span>
                <div class="player-details"> <span class="player-notes">${t('reasonLabel')}: ${player.notes || t('noReason')}</span> </div>
                <button class="restore-player-button" data-player-id="${player.id}">${t('restore')}</button>
            </div>
        `).join('');
    } else {
        membersListHeader.textContent = t('activeMembers');
         playersListContainer.innerHTML = playersToRender.map(player => `
            <div class="player-item">
                <span class="player-name">${player.name}</span>
                <div class="player-details">
                    <label>${t('thLabel')}:</label> <input type="number" class="player-th-input" value="${player.th_level || ''}" data-player-id="${player.id}" min="1" placeholder="${t('lvlPlaceholder')}">
                    <label>${t('powerLabel')}:</label> <input type="text" class="player-power-input" value="${player.power_level || ''}" data-player-id="${player.id}" placeholder="${t('powerPlaceholderShort')}">
                    <label>${t('marchesLabel')}:</label> <select class="player-marches-select" data-player-id="${player.id}"> <option value="" ${!player.marches ? 'selected' : ''}>?</option> <option value="4" ${player.marches == 4 ? 'selected' : ''}>4</option> <option value="5" ${player.marches == 5 ? 'selected' : ''}>5</option> <option value="6" ${player.marches == 6 ? 'selected' : ''}>6</option> </select>
                </div>
                <button class="delete-player-button" data-player-id="${player.id}" data-player-name="${player.name}">${t('delete')}</button>
            </div>
        `).join('');
    }
}

// --- ZAKŁADKA "EVENTY" ---
async function renderEventsListView() {
    addEventForm.classList.remove('hidden');
    const { data: events, error } = await supabaseClient.from('events').select('*').order('created_at', { ascending: false });
    if (error) { console.error("Błąd pobierania eventów:", error); return; }
    eventsListContainer.innerHTML = events.map(event => `
        <div class="event-item" data-event-id="${event.id}" data-event-name="${event.name}">
            <span class="event-name-span">${event.name}</span>
            <button class="delete-event-button" data-event-id="${event.id}" data-event-name="${event.name}">${t('delete')}</button>
        </div>
    `).join('');
}

async function renderEventDetailView(eventId) {
    addEventForm.classList.add('hidden');
    const { data: event, error: eventError } = await supabaseClient.from('events').select(`name, groups (id, name, group_members (id, status, players ( id, name )))`).eq('id', eventId).single();
    const { data: allPlayers, error: playersError } = await supabaseClient.from('players').select('*').eq('is_active', true);
    if (eventError || playersError) { console.error(t('loadingError'), eventError || playersError); eventsListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; }

    const assignedPlayerIds = event.groups.flatMap(g => g.group_members.map(gm => gm.players.id));
    let filteredPlayers = allPlayers.filter(p => !assignedPlayerIds.includes(p.id));
    if (eventDetailFilters.marches) { filteredPlayers = filteredPlayers.filter(p => p.marches == eventDetailFilters.marches); }
    if (eventDetailFilters.name) { const filterName = eventDetailFilters.name.toLowerCase(); filteredPlayers = filteredPlayers.filter(p => p.name.toLowerCase().includes(filterName)); }
    if (eventDetailFilters.power) { const filterPower = eventDetailFilters.power.toLowerCase(); filteredPlayers = filteredPlayers.filter(p => (p.power_level || '').toLowerCase().includes(filterPower)); }
    
    let html = `
        <div class="event-detail-header"><h2>${t('manageEventTitle', event.name)}</h2><button id="back-to-events-list">${t('backToList')}</button></div>
        <form id="create-group-form"><input type="text" name="group-name" placeholder="${t('createGroupPlaceholder')}" required><button type="submit">${t('createGroupButton')}</button></form>
        <div class="player-filters">
            <label for="filter-marches">${t('filterByMarches')}</label> <select id="filter-marches"><option value="" ${eventDetailFilters.marches === '' ? 'selected' : ''}>${t('all')}</option><option value="4" ${eventDetailFilters.marches === '4' ? 'selected' : ''}>4</option><option value="5" ${eventDetailFilters.marches === '5' ? 'selected' : ''}>5</option><option value="6" ${eventDetailFilters.marches === '6' ? 'selected' : ''}>6</option></select>
            <label for="filter-name">${t('filterByName')}</label> <input type="text" id="filter-name" value="${eventDetailFilters.name}">
            <label for="filter-power">${t('filterByPower')}</label> <input type="text" id="filter-power" value="${eventDetailFilters.power}">
        </div>
        <div id="groups-management-container">`;
    const playerOptionsHtml = filteredPlayers.length > 0 ? filteredPlayers.map(p => `<option value="${p.id}">${p.name} (TH: ${p.th_level || '?'}, ${p.power_level || '?'}, ${t('marchesLabel')}: ${p.marches || '?'})</option>`).join('') : `<option value="" disabled>${t('noAvailablePlayers')}</option>`;
     event.groups.forEach(group => {
        html += `<div class="group-card">
            <h3><span>${group.name}</span><button class="edit-group-name-button" data-group-id="${group.id}" data-group-name="${group.name}">✏️</button></h3>
            <ul>${group.group_members.map(member => `<li><span>${member.players.name}</span><div><select class="status-select" data-member-id="${member.id}"><option value="Nieokreślony" ${member.status === 'Nieokreślony' ? 'selected' : ''}>${t('statusUndefined')}</option><option value="Aktywny" ${member.status === 'Aktywny' ? 'selected' : ''}>${t('statusActive')}</option><option value="Nieaktywny" ${member.status === 'Nieaktywny' ? 'selected' : ''}>${t('statusInactive')}</option><option value="Problem" ${member.status === 'Problem' ? 'selected' : ''}>${t('statusProblem')}</option></select><button class="remove-from-group-button" data-member-id="${member.id}">X</button></div></li>`).join('') || `<li>${t('noGroupMembers')}</li>`}</ul>
            <form class="add-player-to-group-form"><input type="hidden" name="group-id" value="${group.id}"><select name="player-id" required><option value="" disabled selected>${t('selectPlayer')}</option>${playerOptionsHtml}</select><button type="submit">${t('addButton')}</button></form>
        </div>`;
    });
    html += `</div>`;
    eventsListContainer.innerHTML = html;
    attachDetailViewListeners(eventId);
}

function attachDetailViewListeners(eventId) {
    document.getElementById('back-to-events-list').addEventListener('click', renderEventsListView);
    document.getElementById('create-group-form').addEventListener('submit', async (e) => { e.preventDefault(); const groupName = e.target.querySelector('input[name="group-name"]').value.trim(); if (!groupName) return; const { error } = await supabaseClient.from('groups').insert({ name: groupName, event_id: eventId }); if (error) console.error(t('groupCreateError'), error); else renderEventDetailView(eventId); });
    document.getElementById('filter-marches').addEventListener('change', (e) => { eventDetailFilters.marches = e.target.value; renderEventDetailView(eventId); });
    document.getElementById('filter-name').addEventListener('input', (e) => { eventDetailFilters.name = e.target.value; renderEventDetailView(eventId); });
    document.getElementById('filter-power').addEventListener('input', (e) => { eventDetailFilters.power = e.target.value; renderEventDetailView(eventId); });
    document.querySelectorAll('.edit-group-name-button').forEach(button => { button.addEventListener('click', async (e) => { const groupId = button.dataset.groupId; const currentName = button.dataset.groupName; const newName = prompt(t('renameGroupPrompt'), currentName); if (newName && newName.trim() !== '' && newName !== currentName) { const { error } = await supabaseClient.from('groups').update({ name: newName.trim() }).eq('id', groupId); if (error) alert(t('groupRenameError')); else renderEventDetailView(eventId); } }); });
    document.querySelectorAll('.add-player-to-group-form').forEach(form => { form.addEventListener('submit', async (e) => { e.preventDefault(); const groupId = form.querySelector('input[name="group-id"]').value; const playerId = form.querySelector('select[name="player-id"]').value; if (!playerId) return; const { error } = await supabaseClient.from('group_members').insert({ group_id: groupId, player_id: playerId }); if (error) console.error(t('groupAddPlayerError'), error); else renderEventDetailView(eventId); }); });
    document.querySelectorAll('.status-select').forEach(select => { select.addEventListener('change', async (e) => { const memberId = e.target.dataset.memberId; const newStatus = e.target.value; const { error } = await supabaseClient.from('group_members').update({ status: newStatus }).eq('id', memberId); if (error) console.error(t('statusUpdateError'), error); }); });
     document.querySelectorAll('.remove-from-group-button').forEach(button => { button.addEventListener('click', async (e) => { const memberId = e.target.dataset.memberId; if (confirm(t('groupRemoveConfirm'))) { const { error } = await supabaseClient.from('group_members').delete().eq('id', memberId); if (error) console.error(t('groupRemoveError'), error); else renderEventDetailView(eventId); } }); });
}

// --- ZAKŁADKA "SNAPSHOTY" ---
async function renderSnapshotsView() { createSnapshotButton.classList.remove('hidden'); const { data, error } = await supabaseClient.from('player_snapshots').select('snapshot_date').order('snapshot_date', { ascending: false }); if (error) { console.error(t('loadingError'), error); snapshotsListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; } const uniqueDates = [...new Set(data.map(item => item.snapshot_date))]; if (uniqueDates.length === 0) { snapshotsListContainer.innerHTML = `<p>${t('noHistory')}</p>`; } else { snapshotsListContainer.innerHTML = uniqueDates.map(date => `<div class="snapshot-item" data-date="${date}">${t('snapshotFromDate')} ${new Date(date).toLocaleDateString(currentLang)}</div>`).join(''); } }
async function renderSnapshotDetailView(date) { createSnapshotButton.classList.add('hidden'); const { data: snapshotData, error } = await supabaseClient.from('player_snapshots').select('*').eq('snapshot_date', date).order('player_name', { ascending: true }); if (error) { console.error(t('loadingError'), error); snapshotsListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; } const formattedDate = new Date(date).toLocaleDateString(currentLang); let html = `<div class="event-detail-header"><h2>${t('snapshotDetailTitle', formattedDate)}</h2><button id="back-to-snapshots-list">${t('backToList')}</button></div>`; html += snapshotData.map(player => ` <div class="player-item"> <span class="player-name">${player.player_name}</span> <div class="player-details"> <span>${t('thLabel')}: <strong>${player.th_level || '?'}</strong></span> <span>${t('powerLabel')}: <strong>${player.power_level || '?'}</strong></span> <span>${t('marchesLabel')}: <strong>${player.marches || '?'}</strong></span> </div> </div> `).join(''); snapshotsListContainer.innerHTML = html; document.getElementById('back-to-snapshots-list').addEventListener('click', renderSnapshotsView); }

// --- FUNKCJA PARSOWANIA MOCY ---
function parsePower(powerString) { if (!powerString) return 0; const cleanedString = powerString.toLowerCase().replace(/,/g, '.').trim(); let multiplier = 1; if (cleanedString.endsWith('m')) { multiplier = 1000000; } else if (cleanedString.endsWith('b')) { multiplier = 1000000000; } const numberPart = parseFloat(cleanedString); if (isNaN(numberPart)) return 0; return numberPart * multiplier; }

// --- FUNKCJA RENDEROWANIA STATYSTYK ---
async function renderStatistics() {
    const { data: players, error } = await supabaseClient.from('players').select('th_level, power_level').eq('is_active', true);
    if (error) { statsContent.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; }
    let t8Count = 0, t9Count = 0, t10Count = 0;
    const powerBrackets = {};
    players.forEach(player => {
        const th = player.th_level; if (th >= 22 && th <= 25) { t8Count++; } else if (th >= 26 && th <= 29) { t9Count++; } else if (th >= 30) { t10Count++; }
        const powerNum = parsePower(player.power_level); if (powerNum > 0) { const bracket = Math.floor(powerNum / 10000000) * 10; powerBrackets[bracket] = (powerBrackets[bracket] || 0) + 1; }
    });
    let statsHtml = `<p><strong>${t('unlockedUnits')}:</strong></p><p>${t('tier8')}: <strong>${t8Count}</strong></p><p>${t('tier9')}: <strong>${t9Count}</strong></p><p>${t('tier10')}: <strong>${t10Count}</strong></p><hr class="divider" style="margin: 15px 0;"><p><strong>${t('powerBrackets')}:</strong></p>`;
    const sortedBrackets = Object.keys(powerBrackets).map(Number).sort((a, b) => a - b);
    if (sortedBrackets.length > 0) { sortedBrackets.forEach(bracket => { if (bracket >= 10) { statsHtml += `<p>${t('powerBracketLabel', bracket)}: <strong>${powerBrackets[bracket]}</strong></p>`; } }); }
    else { statsHtml += `<p>Brak danych o mocy.</p>`; }
    statsContent.innerHTML = statsHtml;
}

// --- FUNKCJE UI I AUTENTYKACJI ---
function updateUI(user) { if (user) { authView.classList.add('hidden'); appView.classList.remove('hidden'); logoutButton.classList.remove('hidden'); renderStatistics(); switchTab(currentTabId); } else { authView.classList.remove('hidden'); appView.classList.add('hidden'); logoutButton.classList.add('hidden'); statsContent.innerHTML = ''; } applyStaticTranslations(); }

function init() {
    applyStaticTranslations();
    document.getElementById('lang-switcher').addEventListener('click', (e) => { const lang = e.target.dataset.lang; if (lang && lang !== currentLang) { setLanguage(lang); } });
    logoutButton.addEventListener('click', async () => { await supabaseClient.auth.signOut(); updateUI(null); });
    loginForm.addEventListener('submit', async (e) => { e.preventDefault(); const { data, error } = await supabaseClient.auth.signInWithPassword({ email: emailInput.value, password: passwordInput.value }); if (error) { errorMessage.textContent = t('invalidLogin'); } else { errorMessage.textContent = ''; updateUI(data.user); } });
    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
    addPlayerForm.addEventListener('submit', async (e) => { e.preventDefault(); const newName = playerNameInput.value.trim(); const thLevel = playerThInput.value; const powerLevel = playerPowerInput.value.trim(); const marches = playerMarchesInput.value; if (!newName) return; const { error } = await supabaseClient.from('players').insert({ name: newName, th_level: thLevel || null, power_level: powerLevel || null, marches: marches || null }); if (error) alert(t('playerAddError')); else { playerNameInput.value = ''; playerThInput.value = ''; playerPowerInput.value = ''; playerMarchesInput.value = ''; renderMembersView(); renderStatistics(); } });
    bulkAddPlayersForm.addEventListener('submit', async (e) => { e.preventDefault(); const namesText = bulkPlayersInput.value.trim(); if (!namesText) return; try { const playersArray = namesText.split('\n').map(line => line.trim()).filter(line => line.length > 0).map(line => { const parts = line.split(','); if (!parts[0]) throw new Error(t('bulkParseError', 'Każdy wiersz musi mieć przynajmniej nazwę.')); return { name: parts[0].trim(), th_level: parts[1] ? parseInt(parts[1].trim()) || null : null, power_level: parts[2] ? parts[2].trim() || null : null, marches: null }; }); if (playersArray.length === 0) return; const { error } = await supabaseClient.from('players').insert(playersArray); if (error) { console.error("Błąd dodawania hurtowego:", error); alert(t('bulkInsertError', error.message)); } else { bulkPlayersInput.value = ''; renderMembersView(); renderStatistics(); alert(t('playerAddSuccess', playersArray.length)); } } catch (parseError) { alert(t('bulkParseError', parseError.message)); } });
    bulkUpdateMarchesForm.addEventListener('submit', async (e) => { e.preventDefault(); const dataText = bulkMarchesInput.value.trim(); if (!dataText) return; let updates = []; let parseErrors = []; const lines = dataText.split('\n').map(line => line.trim()).filter(line => line.length > 0); for (const line of lines) { const parts = line.split(','); if (parts.length !== 2 || !parts[0] || !parts[1]) { parseErrors.push(`Pominięto błędną linię: "${line}"`); continue; } const name = parts[0].trim(); const marchesValue = parseInt(parts[1].trim()); if (![4, 5, 6].includes(marchesValue)) { parseErrors.push(t('invalidMarchesValue', parts[1].trim()) + ` dla "${name}"`); continue; } updates.push({ name: name, marches: marchesValue }); } if (parseErrors.length > 0) { alert("Wystąpiły błędy podczas przetwarzania danych:\n" + parseErrors.join('\n') + "\n\nŻadne dane nie zostały zaktualizowane."); return; } if (updates.length === 0) { alert("Nie znaleziono poprawnych danych do aktualizacji."); return; } console.log(`Przygotowano ${updates.length} aktualizacji marszy. Rozpoczynanie...`); let successCount = 0; let errorCount = 0; for (const player of updates) { const { error } = await supabaseClient.from('players').update({ marches: player.marches }).eq('name', player.name); if (error) { console.error(`Błąd aktualizacji marszy dla "${player.name}":`, error.message); errorCount++; } else { successCount++; } } console.log(`--- Zakończono aktualizację marszy ---`); console.log(`Sukcesów: ${successCount}`); console.log(`Błędów: ${errorCount}`); alert(t('bulkUpdateSuccess', successCount) + (errorCount > 0 ? ` Błędów: ${errorCount}` : '')); bulkMarchesInput.value = ''; renderMembersView(); renderStatistics(); });
    playersListContainer.addEventListener('click', async (e) => { if (e.target.classList.contains('delete-player-button')) { const playerId = e.target.dataset.playerId; const playerName = e.target.dataset.playerName; const reason = prompt(t('deleteConfirm', playerName)); if (reason !== null) { const { error } = await supabaseClient.from('players').update({ is_active: false, notes: reason || t('noReason') }).eq('id', playerId); if (error) { console.error(t('playerDeleteError'), error); } else { renderMembersView(); renderStatistics(); } } } if (e.target.classList.contains('restore-player-button')) { const playerId = e.target.dataset.playerId; if (confirm(t('restoreConfirm'))) { const { error } = await supabaseClient.from('players').update({ is_active: true, notes: null }).eq('id', playerId); if (error) { console.error(t('playerRestoreError'), error); } else { renderMembersView(); renderStatistics(); } } } });
    playersListContainer.addEventListener('change', async (e) => { const playerId = e.target.dataset.playerId; if (!playerId) return; let updateData = {}; if (e.target.classList.contains('player-th-input')) { updateData.th_level = e.target.value || null; } if (e.target.classList.contains('player-marches-select')) { updateData.marches = e.target.value || null; } if (e.target.classList.contains('player-power-input')) { updateData.power_level = e.target.value.trim() || null; } if (Object.keys(updateData).length > 0) { const { error } = await supabaseClient.from('players').update(updateData).eq('id', playerId); if (error) { console.error(t('playerUpdateError'), error); alert(t('playerUpdateError')); } else { console.log(`Zaktualizowano gracza ${playerId} z:`, updateData); renderStatistics(); } } });
    memberFilterNameInput.addEventListener('input', (e) => { memberFilters.name = e.target.value; renderMembersView(); });
    memberFilterPowerInput.addEventListener('input', (e) => { memberFilters.power = e.target.value; renderMembersView(); });
    showInactiveToggle.addEventListener('change', () => { renderMembersView(); });
    addEventForm.addEventListener('submit', async(e) => { e.preventDefault(); const newName = eventNameInput.value.trim(); if (!newName) return; const { error } = await supabaseClient.from('events').insert({ name: newName }); if (error) alert(t('eventAddError')); else { eventNameInput.value = ''; renderEventsListView(); } });
    eventsListContainer.addEventListener('click', async (e) => { const eventItem = e.target.closest('.event-item'); const deleteButton = e.target.closest('.delete-event-button'); if (deleteButton) { e.stopPropagation(); const eventId = deleteButton.dataset.eventId; const eventName = deleteButton.dataset.eventName; if (confirm(t('deleteEventConfirm', eventName))) { const { error } = await supabaseClient.from('events').delete().eq('id', eventId); if (error) { alert(t('eventDeleteError')); } else { renderEventsListView(); } } } else if (eventItem) { if (e.target.classList.contains('event-name-span') || e.target === eventItem) { const eventId = eventItem.dataset.eventId; renderEventDetailView(eventId); } } });
    createSnapshotButton.addEventListener('click', async () => { if (!confirm(t('snapshotConfirm'))) { return; } const { data: players, error: fetchError } = await supabaseClient.from('players').select('id, name, th_level, power_level, marches').eq('is_active', true); if (fetchError) { alert(t('snapshotFetchError')); console.error(fetchError); return; } const snapshotDate = new Date().toISOString().split('T')[0]; const snapshotData = players.map(player => ({ player_id: player.id, snapshot_date: snapshotDate, player_name: player.name, th_level: player.th_level, power_level: player.power_level, marches: player.marches })); const { error: insertError } = await supabaseClient.from('player_snapshots').insert(snapshotData); if (insertError) { alert(t('snapshotSaveError', insertError.message)); console.error(insertError); } else { alert(t('snapshotSaveSuccess', players.length)); renderSnapshotsView(); } });
    snapshotsListContainer.addEventListener('click', (e) => { const snapshotItem = e.target.closest('.snapshot-item'); if (snapshotItem) { const snapshotDate = snapshotItem.dataset.date; renderSnapshotDetailView(snapshotDate); } });

    // NOWE LISTENERY DLA PRZYCISKÓW SORTOWANIA
    sortControlsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('sort-button')) {
            const newColumn = target.dataset.sort;
            if (memberSort.column === newColumn) {
                memberSort.direction = memberSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                memberSort.column = newColumn;
                memberSort.direction = 'asc';
            }
            renderMembersView();
        }
        if (target.id === 'sort-direction-button') {
            memberSort.direction = memberSort.direction === 'asc' ? 'desc' : 'asc';
            renderMembersView();
        }
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => { updateUI(session ? session.user : null); });
}

init();