// === KROK 1: KONFIGURACJA SUPABASE ===
const SUPABASE_URL = 'https://tkpadqrbkknrscxjtatr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcGFkcXJia2tucnNjeGp0YXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzAxMDEsImV4cCI6MjA3NjY0NjEwMX0._KoZoOjLVW_2JxM8FBVLXuPQkJ5lP3tgCMPrgTj9q0A';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === NOWY SŁOWNIK TŁUMACZEŃ ===
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
        // Dynamiczne
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
        selectPlayer: "Wybierz gracza..."
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
        // Dynamic
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
        selectPlayer: "Select player..."
    }
};

let currentLang = localStorage.getItem('kingshotLang') || 'pl';
let currentTabId = 'members-view'; // Przechowuj stan aktywnej zakładki

// NOWA FUNKCJA POMOCNICZA DO TŁUMACZEŃ
function t(key, args = null) {
    let string = translations[currentLang][key] || translations['en'][key] || key;
    if (typeof string === 'function') {
        return string(args);
    }
    return string;
}

// NOWA FUNKCJA DO USTAWIANIA JĘZYKA
function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('kingshotLang', lang);
    applyStaticTranslations();
    
    // Odśwież bieżący widok, aby załadować dynamiczne tłumaczenia
    switchTab(currentTabId, false);
}

// NOWA FUNKCJA DO TŁUMACZENIA STATYCZNEGO HTML
function applyStaticTranslations() {
    document.documentElement.lang = currentLang; // Zaktualizuj atrybut lang w HTML
    document.title = t('appTitle'); // Zaktualizuj tytuł strony

    document.querySelectorAll('[data-translate-key]').forEach(el => {
        el.textContent = t(el.dataset.translateKey);
    });

    // Tłumaczenie placeholderów
    emailInput.placeholder = t('emailPlaceholder');
    passwordInput.placeholder = t('passwordPlaceholder');
    playerNameInput.placeholder = t('playerNamePlaceholder');
    playerThInput.placeholder = t('thPlaceholder');
    playerPowerInput.placeholder = t('powerPlaceholder');
    bulkPlayersInput.placeholder = t('bulkAddPlaceholder');
    eventNameInput.placeholder = t('eventNamePlaceholder');
    
    // Zaktualizuj style przycisków języka
    document.querySelectorAll('#lang-switcher button').forEach(btn => {
        btn.classList.toggle('active-lang', btn.dataset.lang === currentLang);
    });
}


// === POBRANIE ELEMENTÓW === (Reszta bez zmian)
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


// === LOGIKA APLIKACJI ===

function switchTab(tabId, updateCurrent = true) {
    if (updateCurrent) {
        currentTabId = tabId;
    }
    tabPanes.forEach(pane => pane.classList.add('hidden'));
    tabs.forEach(tab => tab.classList.remove('active-tab'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelector(`button[data-tab="${tabId}"]`).classList.add('active-tab');

    if (tabId === 'members-view') {
        renderMembersView();
    } else if (tabId === 'events-view') {
        renderEventsListView();
    } else if (tabId === 'snapshots-view') {
        renderSnapshotsView();
    }
}

// --- ZAKŁADKA "CZŁONKOWIE" (PRZETŁUMACZONA) ---

async function renderMembersView() {
    const showInactive = showInactiveToggle.checked;
    
    const { data: players, error } = await supabaseClient.from('players').select('*').eq('is_active', !showInactive).order('name', { ascending: true });
    if (error) { console.error("Błąd pobierania graczy:", error); return; }
    
    if (showInactive) {
        membersListHeader.textContent = t('inactiveMembers');
        playersListContainer.innerHTML = players.map(player => `
            <div class="player-item">
                <span class="player-name">${player.name}</span>
                <div class="player-details">
                    <span class="player-notes">${t('reasonLabel')}: ${player.notes || t('noReason')}</span>
                </div>
                <button class="restore-player-button" data-player-id="${player.id}">${t('restore')}</button>
            </div>
        `).join('');
    } else {
        membersListHeader.textContent = t('activeMembers');
        playersListContainer.innerHTML = players.map(player => `
            <div class="player-item">
                <span class="player-name">${player.name}</span>
                <div class="player-details">
                    <label>${t('thLabel')}:</label>
                    <input type="number" class="player-th-input" value="${player.th_level || ''}" data-player-id="${player.id}" min="1" placeholder="${t('lvlPlaceholder')}">
                    <label>${t('powerLabel')}:</label>
                    <input type="text" class="player-power-input" value="${player.power_level || ''}" data-player-id="${player.id}" placeholder="${t('powerPlaceholderShort')}">
                    <label>${t('marchesLabel')}:</label>
                    <select class="player-marches-select" data-player-id="${player.id}">
                        <option value="" ${!player.marches ? 'selected' : ''}>?</option>
                        <option value="4" ${player.marches == 4 ? 'selected' : ''}>4</option>
                        <option value="5" ${player.marches == 5 ? 'selected' : ''}>5</option>
                        <option value="6" ${player.marches == 6 ? 'selected' : ''}>6</option>
                    </select>
                </div>
                <button class="delete-player-button" data-player-id="${player.id}" data-player-name="${player.name}">${t('delete')}</button>
            </div>
        `).join('');
    }
}

// --- ZAKŁADKA "EVENTY" (PRZETŁUMACZONA) ---
async function renderEventsListView() {
    addEventForm.classList.remove('hidden');
    const { data: events, error } = await supabaseClient.from('events').select('*').order('created_at', { ascending: false });
    if (error) { console.error("Błąd pobierania eventów:", error); return; }
    eventsListContainer.innerHTML = events.map(event => `
        <div class="event-item" data-event-id="${event.id}">
            ${event.name}
        </div>
    `).join('');
}

async function renderEventDetailView(eventId) {
    addEventForm.classList.add('hidden');
    const { data: event, error: eventError } = await supabaseClient.from('events').select(`name, groups (id, name, group_members (id, status, players ( id, name )))`).eq('id', eventId).single();
    const { data: allPlayers, error: playersError } = await supabaseClient.from('players').select('id, name').eq('is_active', true);
    if (eventError || playersError) { console.error("Błąd ładowania szczegółów eventu:", eventError || playersError); eventsListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; }

    let html = `<div class="event-detail-header"><h2>${t('manageEventTitle', event.name)}</h2><button id="back-to-events-list">${t('backToList')}</button></div><form id="create-group-form"><input type="text" name="group-name" placeholder="${t('createGroupPlaceholder')}" required><button type="submit">${t('createGroupButton')}</button></form><div id="groups-management-container">`;
    event.groups.forEach(group => {
        const membersInThisGroupIds = group.group_members.map(gm => gm.players.id);
        const availablePlayers = allPlayers.filter(p => !membersInThisGroupIds.includes(p.id));
        html += `<div class="group-card"><h3>${group.name}</h3><ul>${group.group_members.map(member => `<li><span>${member.players.name}</span><div><select class="status-select" data-member-id="${member.id}"><option value="Nieokreślony" ${member.status === 'Nieokreślony' ? 'selected' : ''}>${t('statusUndefined')}</option><option value="Aktywny" ${member.status === 'Aktywny' ? 'selected' : ''}>${t('statusActive')}</option><option value="Nieaktywny" ${member.status === 'Nieaktywny' ? 'selected' : ''}>${t('statusInactive')}</option><option value="Problem" ${member.status === 'Problem' ? 'selected' : ''}>${t('statusProblem')}</option></select><button class="remove-from-group-button" data-member-id="${member.id}">X</button></div></li>`).join('') || `<li>${t('noGroupMembers')}</li>`}</ul><form class="add-player-to-group-form"><input type="hidden" name="group-id" value="${group.id}"><select name="player-id" required><option value="" disabled selected>${t('selectPlayer')}</option>${availablePlayers.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select><button type="submit">${t('addButton')}</button></form></div>`;
    });
    html += `</div>`;
    eventsListContainer.innerHTML = html;
    attachDetailViewListeners(eventId);
}

function attachDetailViewListeners(eventId) {
    document.getElementById('back-to-events-list').addEventListener('click', renderEventsListView);
    document.getElementById('create-group-form').addEventListener('submit', async (e) => {
        e.preventDefault(); const groupName = e.target.querySelector('input[name="group-name"]').value.trim(); if (!groupName) return;
        const { error } = await supabaseClient.from('groups').insert({ name: groupName, event_id: eventId });
        if (error) console.error(t('groupCreateError'), error); else renderEventDetailView(eventId);
    });
    document.querySelectorAll('.add-player-to-group-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); const groupId = e.target.querySelector('input[name="group-id"]').value; const playerId = e.target.querySelector('select[name="player-id"]').value; if (!playerId) return;
            const { error } = await supabaseClient.from('group_members').insert({ group_id: groupId, player_id: playerId });
            if (error) console.error(t('groupAddPlayerError'), error); else renderEventDetailView(eventId);
        });
    });
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const memberId = e.target.dataset.memberId; const newStatus = e.target.value;
            const { error } = await supabaseClient.from('group_members').update({ status: newStatus }).eq('id', memberId);
            if (error) console.error(t('statusUpdateError'), error);
        });
    });
    document.querySelectorAll('.remove-from-group-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            const memberId = e.target.dataset.memberId;
            if (confirm(t('groupRemoveConfirm'))) {
                 const { error } = await supabaseClient.from('group_members').delete().eq('id', memberId);
                 if (error) console.error(t('groupRemoveError'), error); else renderEventDetailView(eventId);
            }
        });
    });
}

// --- ZAKŁADKA "SNAPSHOTY" (PRZETŁUMACZONA) ---

async function renderSnapshotsView() {
    createSnapshotButton.classList.remove('hidden');
    const { data, error } = await supabaseClient.from('player_snapshots').select('snapshot_date').order('snapshot_date', { ascending: false });
    if (error) {
        console.error(t('loadingError'), error);
        snapshotsListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`;
        return;
    }
    const uniqueDates = [...new Set(data.map(item => item.snapshot_date))];
    if (uniqueDates.length === 0) {
        snapshotsListContainer.innerHTML = `<p>${t('noHistory')}</p>`;
    } else {
        snapshotsListContainer.innerHTML = uniqueDates.map(date => `
            <div class="snapshot-item" data-date="${date}">
                ${t('snapshotFromDate')} ${new Date(date).toLocaleDateString(currentLang)}
            </div>
        `).join('');
    }
}

async function renderSnapshotDetailView(date) {
    createSnapshotButton.classList.add('hidden');
    const { data: snapshotData, error } = await supabaseClient.from('player_snapshots').select('*').eq('snapshot_date', date).order('player_name', { ascending: true });
    if (error) {
        console.error(t('loadingError'), error);
        snapshotsListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`;
        return;
    }
    const formattedDate = new Date(date).toLocaleDateString(currentLang);
    let html = `
        <div class="event-detail-header">
            <h2>${t('snapshotDetailTitle', formattedDate)}</h2>
            <button id="back-to-snapshots-list">${t('backToList')}</button>
        </div>
    `;
    html += snapshotData.map(player => `
        <div class="player-item">
            <span class="player-name">${player.player_name}</span>
            <div class="player-details">
                <span>${t('thLabel')}: <strong>${player.th_level || '?'}</strong></span>
                <span>${t('powerLabel')}: <strong>${player.power_level || '?'}</strong></span>
                <span>${t('marchesLabel')}: <strong>${player.marches || '?'}</strong></span>
            </div>
        </div>
    `).join('');
    snapshotsListContainer.innerHTML = html;
    document.getElementById('back-to-snapshots-list').addEventListener('click', renderSnapshotsView);
}


// --- FUNKCJE UI I AUTENTYKACJI (PRZETŁUMACZONE) ---
function updateUI(user) {
    if (user) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        switchTab(currentTabId); // Użyj zapisanej zakładki
    } else {
        authView.classList.remove('hidden');
        appView.classList.add('hidden');
        logoutButton.classList.add('hidden');
    }
    applyStaticTranslations(); // Zastosuj tłumaczenia dla widoku logowania/wylogowania
}

function init() {
    // Ustaw język na samym początku
    applyStaticTranslations();

    // Logika przełącznika języka
    document.getElementById('lang-switcher').addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        if (lang && lang !== currentLang) {
            setLanguage(lang);
        }
    });

    logoutButton.addEventListener('click', async () => { await supabaseClient.auth.signOut(); updateUI(null); });
    
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email: emailInput.value, password: passwordInput.value });
        if (error) { errorMessage.textContent = t('invalidLogin'); } 
        else { errorMessage.textContent = ''; updateUI(data.user); }
    });
    
    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
    
    addPlayerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        const newName = playerNameInput.value.trim(); 
        const thLevel = playerThInput.value;
        const powerLevel = playerPowerInput.value.trim();
        const marches = playerMarchesInput.value;
        if (!newName) return;
        const { error } = await supabaseClient.from('players').insert({ name: newName, th_level: thLevel || null, power_level: powerLevel || null, marches: marches || null });
        if (error) alert(t('playerAddError')); 
        else { 
            playerNameInput.value = ''; playerThInput.value = ''; playerPowerInput.value = ''; playerMarchesInput.value = '';
            renderMembersView(); 
        }
    });
    
    bulkAddPlayersForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const namesText = bulkPlayersInput.value.trim();
        if (!namesText) return;
        try {
            const playersArray = namesText.split('\n').map(line => line.trim()).filter(line => line.length > 0).map(line => {
                const parts = line.split(',');
                if (!parts[0]) throw new Error(t('bulkParseError', 'Każdy wiersz musi mieć przynajmniej nazwę.'));
                return { name: parts[0].trim(), th_level: parts[1] ? parseInt(parts[1].trim()) || null : null, power_level: parts[2] ? parts[2].trim() || null : null, marches: null };
            });
            if (playersArray.length === 0) return;
            const { error } = await supabaseClient.from('players').insert(playersArray);
            if (error) {
                console.error("Błąd dodawania hurtowego:", error);
                alert(t('bulkInsertError', error.message));
            } else {
                bulkPlayersInput.value = ''; renderMembersView(); alert(t('playerAddSuccess', playersArray.length));
            }
        } catch (parseError) {
            alert(t('bulkParseError', parseError.message));
        }
    });

    playersListContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-player-button')) {
            const playerId = e.target.dataset.playerId; const playerName = e.target.dataset.playerName;
            const reason = prompt(t('deleteConfirm', playerName));
            if (reason !== null) {
                const { error } = await supabaseClient.from('players').update({ is_active: false, notes: reason || t('noReason') }).eq('id', playerId);
                if (error) { console.error(t('playerDeleteError'), error); } else { renderMembersView(); }
            }
        }
        
        if (e.target.classList.contains('restore-player-button')) {
            const playerId = e.target.dataset.playerId;
            if (confirm(t('restoreConfirm'))) {
                const { error } = await supabaseClient.from('players').update({ is_active: true, notes: null }).eq('id', playerId);
                if (error) { console.error(t('playerRestoreError'), error); } else { renderMembersView(); }
            }
        }
    });

    playersListContainer.addEventListener('change', async (e) => {
        const playerId = e.target.dataset.playerId;
        if (!playerId) return;
        let updateData = {};
        if (e.target.classList.contains('player-th-input')) { updateData.th_level = e.target.value || null; }
        if (e.target.classList.contains('player-marches-select')) { updateData.marches = e.target.value || null; }
        if (e.target.classList.contains('player-power-input')) { updateData.power_level = e.target.value.trim() || null; }
        if (Object.keys(updateData).length > 0) {
            const { error } = await supabaseClient.from('players').update(updateData).eq('id', playerId);
            if (error) { console.error(t('playerUpdateError'), error); alert(t('playerUpdateError')); } 
            else { console.log(`Zaktualizowano gracza ${playerId} z:`, updateData); }
        }
    });

    showInactiveToggle.addEventListener('change', () => {
        renderMembersView();
    });

    addEventForm.addEventListener('submit', async(e) => {
        e.preventDefault(); const newName = eventNameInput.value.trim(); if (!newName) return;
        const { error } = await supabaseClient.from('events').insert({ name: newName });
        if (error) alert(t('eventAddError')); else { eventNameInput.value = ''; renderEventsListView(); }
    });
    
    eventsListContainer.addEventListener('click', (e) => {
        const eventItem = e.target.closest('.event-item');
        if (eventItem) {
            const eventId = eventItem.dataset.eventId;
            renderEventDetailView(eventId);
        }
    });

    createSnapshotButton.addEventListener('click', async () => {
        if (!confirm(t('snapshotConfirm'))) { return; }
        const { data: players, error: fetchError } = await supabaseClient.from('players').select('id, name, th_level, power_level, marches').eq('is_active', true);
        if (fetchError) { alert(t('snapshotFetchError')); console.error(fetchError); return; }
        const snapshotDate = new Date().toISOString().split('T')[0]; 
        const snapshotData = players.map(player => ({
            player_id: player.id, snapshot_date: snapshotDate, player_name: player.name,
            th_level: player.th_level, power_level: player.power_level, marches: player.marches
        }));
        const { error: insertError } = await supabaseClient.from('player_snapshots').insert(snapshotData);
        if (insertError) { alert(t('snapshotSaveError', insertError.message)); console.error(insertError); } 
        else { alert(t('snapshotSaveSuccess', players.length)); renderSnapshotsView(); }
    });

    snapshotsListContainer.addEventListener('click', (e) => {
        const snapshotItem = e.target.closest('.snapshot-item');
        if (snapshotItem) {
            const snapshotDate = snapshotItem.dataset.date;
            renderSnapshotDetailView(snapshotDate);
        }
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUI(session ? session.user : null);
    });
}

// Uruchom aplikację
init();