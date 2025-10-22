// === KROK 1: KONFIGURACJA SUPABASE ===
const SUPABASE_URL = 'https://tkpadqrbkknrscxjtatr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcGFkcXJia2tucnNjeGp0YXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzAxMDEsImV4cCI6MjA3NjY0NjEwMX0._KoZoOjLVW_2JxM8FBVLXuPQkJ5lP3tgCMPrgTj9q0A';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === KROK 2: POBRANIE ELEMENTÓW ZE STRONY (HTML) ===
// Widoki ogólne
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');
const logoutButton = document.getElementById('logout-button');
const loginForm = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

// Elementy nawigacji i zakładek
const tabs = document.querySelectorAll('#tab-nav button');
const tabPanes = document.querySelectorAll('.tab-pane');

// Elementy zakładki "Członkowie"
const addPlayerForm = document.getElementById('add-player-form');
const playerNameInput = document.getElementById('player-name-input');
const playersListContainer = document.getElementById('players-list-container');

// Elementy zakładki "Eventy"
const addEventForm = document.getElementById('add-event-form');
const eventNameInput = document.getElementById('event-name-input');
const eventsListContainer = document.getElementById('events-list-container');

// === KROK 3: GŁÓWNA LOGIKA APLIKACJI ===

// Funkcja do przełączania zakładek
function switchTab(tabId) {
    tabPanes.forEach(pane => pane.classList.add('hidden'));
    tabs.forEach(tab => tab.classList.remove('active-tab'));

    document.getElementById(tabId).classList.remove('hidden');
    document.querySelector(`button[data-tab="${tabId}"]`).classList.add('active-tab');

    if (tabId === 'members-view') {
        renderMembersView();
    } else if (tabId === 'events-view') {
        renderEventsListView(); // ZMIANA: Nowa nazwa dla widoku listy eventów
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

addPlayerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newName = playerNameInput.value.trim();
    if (!newName) return;
    const { error } = await supabaseClient.from('players').insert({ name: newName });
    if (error) { alert(`Nie udało się dodać gracza. Być może gracz o tej nazwie już istnieje.`); } 
    else { playerNameInput.value = ''; renderMembersView(); }
});

playersListContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-player-button')) {
        const playerId = event.target.dataset.playerId;
        const playerName = event.target.dataset.playerName;
        const reason = prompt(`Czy na pewno chcesz usunąć gracza "${playerName}"?\n\nPodaj powód usunięcia.`);
        if (reason !== null) {
            const { error } = await supabaseClient.from('players').update({ is_active: false, notes: reason }).eq('id', playerId);
            if (error) { console.error("Błąd usuwania gracza:", error); } 
            else { renderMembersView(); }
        }
    }
});

// --- LOGIKA ZAKŁADKI "EVENTY" ---

// NOWA FUNKCJA: Renderowanie listy eventów
async function renderEventsListView() {
    const { data: events, error } = await supabaseClient.from('events').select('*').order('created_at', { ascending: false });
    if (error) { console.error("Błąd pobierania eventów:", error); return; }
    
    // Zmieniamy styl eventu, aby wyglądał jak klikalny przycisk/kafelek
    eventsListContainer.innerHTML = events.map(event => `
        <div class="event-item" data-event-id="${event.id}">
            ${event.name}
        </div>
    `).join('');
}

// NOWA FUNKCJA: Renderowanie widoku szczegółów eventu (na razie zaślepka)
function renderEventDetailView(eventId) {
    console.log(`Próba otwarcia szczegółów eventu o ID: ${eventId}`);
    // Zmieniamy zawartość kontenera na widok szczegółów
    eventsListContainer.innerHTML = `
        <h2>Ładowanie szczegółów eventu... (ID: ${eventId})</h2>
        <button id="back-to-events-list">Powrót do listy eventów</button>
    `;
    // W przyszłości tutaj będzie kod do wyświetlania grup i członków
    
    // Logika przycisku powrotu
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
        authView.classList.add('hidden');
        appView.classList.add('hidden');
        logoutButton.classList.add('hidden');
    }
}

function init() {
    tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
    logoutButton.addEventListener('click', async () => { await supabaseClient.auth.signOut(); updateUI(null); });
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) { errorMessage.textContent = 'Nieprawidłowy email lub hasło.'; } 
        else { errorMessage.textContent = ''; updateUI(data.user); }
    });
    
    // NOWY EVENT LISTENER: Obsługa dodawania eventu
    addEventForm.addEventListener('submit', async(event) => {
        event.preventDefault();
        const newName = eventNameInput.value.trim();
        if (!newName) return;
        const { error } = await supabaseClient.from('events').insert({ name: newName });
        if (error) { alert('Nie udało się dodać eventu.'); }
        else { eventNameInput.value = ''; renderEventsListView(); }
    });

    // NOWY EVENT LISTENER: Obsługa kliknięcia w event na liście
    eventsListContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('event-item')) {
            const eventId = event.target.dataset.eventId;
            renderEventDetailView(eventId);
        }
    });

    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUI(session ? session.user : null);
    });
}

init();
