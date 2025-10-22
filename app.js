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
    const { data: events, error } = await supabaseClient.from('events').select('*').order('created_at', { ascending: false });
    if (error) { console.error("Błąd pobierania eventów:", error); return; }
    eventsListContainer.innerHTML = events.map(event => `
        <div class="event-item" data-event-id="${event.id}">
            ${event.name}
        </div>
    `).join('');
}

function renderEventDetailView(eventId) {
    console.log(`Próba otwarcia szczegółów eventu o ID: ${eventId}`);
    eventsListContainer.innerHTML = `
        <h2>Ładowanie szczegółów eventu... (ID: ${eventId})</h2>
        <button id="back-to-events-list">Powrót do listy eventów</button>
    `;
    document.getElementById('back-to-events-list').addEventListener('click', renderEventsListView);
}

// --- OGÓLNE FUNKCJE UI I AUTENTYKACJI ---
function updateUI(user) {
    if (user) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        switchTab('members-view');
    } else {
        authView.classList.remove('hidden');
        appView.classList.add('hidden');
        logoutButton.classList.add('hidden');
    }
}

// Inicjalizacja całej aplikacji
function init() {
    // Logika wylogowania
    logoutButton.addEventListener('click', async () => { await supabaseClient.auth.signOut(); updateUI(null); });

    // Logika formularza logowania
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email: email.value, password: password.value });
        if (error) { errorMessage.textContent = 'Nieprawidłowy email lub hasło.'; } 
        else { errorMessage.textContent = ''; updateUI(data.user); }
    });

    // Logika zakładek
    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));

    // Logika dodawania gracza
    addPlayerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const newName = playerNameInput.value.trim();
        if (!newName) return;
        const { error } = await supabaseClient.from('players').insert({ name: newName });
        if (error) { alert(`Nie udało się dodać gracza.`); } 
        else { playerNameInput.value = ''; renderMembersView(); }
    });

    // Logika usuwania gracza
    playersListContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('delete-player-button')) {
            const playerId = event.target.dataset.playerId;
            const playerName = event.target.dataset.playerName;
            const reason = prompt(`Czy na pewno chcesz usunąć gracza "${playerName}"? Podaj powód.`);
            if (reason !== null) {
                const { error } = await supabaseClient.from('players').update({ is_active: false, notes: reason }).eq('id', playerId);
                if (error) { console.error("Błąd usuwania gracza:", error); } 
                else { renderMembersView(); }
            }
        }
    });

    // Logika dodawania eventu
    addEventForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        const newName = eventNameInput.value.trim();
        if (!newName) return;
        const { error } = await supabaseClient.from('events').insert({ name: newName });
        if (error) { alert('Nie udało się dodać eventu.'); }
        else { eventNameInput.value = ''; renderEventsListView(); }
    });

    // Logika kliknięcia w event
    eventsListContainer.addEventListener('click', (event) => {
        const eventItem = event.target.closest('.event-item');
        if (eventItem) {
            const eventId = eventItem.dataset.eventId;
            renderEventDetailView(eventId);
        }
    });

    // Sprawdź status logowania przy starcie
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUI(session ? session.user : null);
    });
}

// Uruchom aplikację
init();
