// === KROK 1: KONFIGURACJA SUPABASE ===
const SUPABASE_URL = 'https://tkpadqrbkknrscxjtatr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcGFkcXJia2tucnNjeGp0YXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzAxMDEsImV4cCI6MjA3NjY0NjEwMX0._KoZoOjLVW_2JxM8FBVLXuPQkJ5lP3tgCMPrgTj9q0A';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === KROK 2: POBRANIE ELEMENTÓW ZE STRONY (HTML) ===
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

// === KROK 3: GŁÓWNA LOGIKA APLIKACJI ===

function switchTab(tabId) {
    tabPanes.forEach(pane => pane.classList.add('hidden'));
    tabs.forEach(tab => tab.classList.remove('active-tab'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelector(`button[data-tab="${tabId}"]`).classList.add('active-tab');

    if (tabId === 'members-view') {
        renderMembersView();
    } else if (tabId === 'events-view') {
        renderEventsListView();
    }
}

// --- LOGIKA ZAKŁADKI "CZŁONKOWIE" ---
async function renderMembersView() {
    const { data: players, error } = await supabaseClient.from('players').select('*').eq('is_active', true).order('name', { ascending: true });
    if (error) { console.error("Błąd pobierania graczy:", error); return; }
    playersListContainer.innerHTML = players.map(player => `
        <div class="player-item">
            <span>${player.name}</span>
            <button class="delete-player-button" data-player-id="${player.id}" data-player-name="${player.name}">Usuń</button>
        </div>
    `).join('');
}

// --- LOGIKA ZAKŁADKI "EVENTY" ---
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
    if (eventError || playersError) { console.error("Błąd ładowania szczegółów eventu:", eventError || playersError); eventsListContainer.innerHTML = `<p class="error">Nie udało się załadować danych eventu.</p>`; return; }

    let html = `<div class="event-detail-header"><h2>Zarządzanie eventem: ${event.name}</h2><button id="back-to-events-list">Powrót do listy</button></div><form id="create-group-form"><input type="text" name="group-name" placeholder="Nazwa nowej grupy" required><button type="submit">Stwórz grupę</button></form><div id="groups-management-container">`;
    event.groups.forEach(group => {
        const membersInThisGroupIds = group.group_members.map(gm => gm.players.id);
        const availablePlayers = allPlayers.filter(p => !membersInThisGroupIds.includes(p.id));
        html += `<div class="group-card"><h3>${group.name}</h3><ul>${group.group_members.map(member => `<li>${member.players.name}<div><select class="status-select" data-member-id="${member.id}"><option value="Nieokreślony" ${member.status === 'Nieokreślony' ? 'selected' : ''}>Nieokreślony</option><option value="Aktywny" ${member.status === 'Aktywny' ? 'selected' : ''}>Aktywny</option><option value="Nieaktywny" ${member.status === 'Nieaktywny' ? 'selected' : ''}>Nieaktywny</option><option value="Problem" ${member.status === 'Problem' ? 'selected' : ''}>Problem</option></select><button class="remove-from-group-button" data-member-id="${member.id}">X</button></div></li>`).join('') || '<li>Brak członków.</li>'}</ul><form class="add-player-to-group-form"><input type="hidden" name="group-id" value="${group.id}"><select name="player-id" required><option value="" disabled selected>Wybierz gracza...</option>${availablePlayers.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}</select><button type="submit">Dodaj</button></form></div>`;
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
        if (error) console.error("Błąd tworzenia grupy:", error); else renderEventDetailView(eventId);
    });
    document.querySelectorAll('.add-player-to-group-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); const groupId = e.target.querySelector('input[name="group-id"]').value; const playerId = e.target.querySelector('select[name="player-id"]').value; if (!playerId) return;
            const { error } = await supabaseClient.from('group_members').insert({ group_id: groupId, player_id: playerId });
            if (error) console.error("Błąd dodawania gracza do grupy:", error); else renderEventDetailView(eventId);
        });
    });
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', async (e) => {
            const memberId = e.target.dataset.memberId; const newStatus = e.target.value;
            const { error } = await supabaseClient.from('group_members').update({ status: newStatus }).eq('id', memberId);
            if (error) console.error("Błąd aktualizacji statusu:", error);
        });
    });
    document.querySelectorAll('.remove-from-group-button').forEach(button => {
        button.addEventListener('click', async (e) => {
            const memberId = e.target.dataset.memberId;
            if (confirm("Na pewno usunąć gracza z grupy?")) {
                 const { error } = await supabaseClient.from('group_members').delete().eq('id', memberId);
                 if (error) console.error("Błąd usuwania z grupy:", error); else renderEventDetailView(eventId);
            }
        });
    });
}

// --- OGÓLNE FUNKCJE UI I AUTENTYKACJI ---
function updateUI(user) {
    if (user) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        switchTab('members-view');
    } else {
        // TA JEDNA LINIJKA BYŁA BŁĘDNA:
        authView.classList.remove('hidden'); // POPRAWKA: usuwamy klasę 'hidden', aby POKAZAĆ logowanie
        appView.classList.add('hidden');
        logoutButton.classList.add('hidden');
    }
}

function init() {
    logoutButton.addEventListener('click', async () => { await supabaseClient.auth.signOut(); updateUI(null); });
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email: email.value, password: password.value });
        if (error) { errorMessage.textContent = 'Nieprawidłowy email lub hasło.'; } else { errorMessage.textContent = ''; updateUI(data.user); }
    });
    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
    addPlayerForm.addEventListener('submit', async (e) => {
        e.preventDefault(); const newName = playerNameInput.value.trim(); if (!newName) return;
        const { error } = await supabaseClient.from('players').insert({ name: newName });
        if (error) alert(`Nie udało się dodać gracza.`); else { playerNameInput.value = ''; renderMembersView(); }
    });
    playersListContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-player-button')) {
            const playerId = e.target.dataset.playerId; const playerName = e.target.dataset.playerName;
            const reason = prompt(`Czy na pewno chcesz usunąć gracza "${playerName}"? Podaj powód.`);
            if (reason !== null) {
                const { error } = await supabaseClient.from('players').update({ is_active: false, notes: reason }).eq('id', playerId);
                if (error) console.error("Błąd usuwania gracza:", error); else renderMembersView();
            }
        }
    });
    addEventForm.addEventListener('submit', async(e) => {
        e.preventDefault(); const newName = eventNameInput.value.trim(); if (!newName) return;
        const { error } = await supabaseClient.from('events').insert({ name: newName });
        if (error) alert('Nie udało się dodać eventu.'); else { eventNameInput.value = ''; renderEventsListView(); }
    });
    eventsListContainer.addEventListener('click', (e) => {
        const eventItem = e.target.closest('.event-item');
        if (eventItem) {
            const eventId = eventItem.dataset.eventId;
            renderEventDetailView(eventId);
        }
    });
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUI(session ? session.user : null);
    });
}

init();
