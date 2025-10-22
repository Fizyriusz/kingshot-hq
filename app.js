// === KROK 1: KONFIGURACJA SUPABASE ===
const SUPABASE_URL = 'https://tkpadqrbkknrscxjtatr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcGFkcXJia2tucnNjeGp0YXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzAxMDEsImV4cCI6MjA3NjY0NjEwMX0._KoZoOjLVW_2JxM8FBVLXuPQkJ5lP3tgCMPrgTj9q0A';

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
const eventsListContainer = document.getElementById('events-list-container');

// === KROK 3: GŁÓWNA LOGIKA APLIKACJI ===

// Funkcja do przełączania zakładek
function switchTab(tabId) {
    // Ukryj wszystkie panele i usuń aktywną klasę z przycisków
    tabPanes.forEach(pane => pane.classList.add('hidden'));
    tabs.forEach(tab => tab.classList.remove('active-tab'));

    // Pokaż wybrany panel i aktywuj przycisk
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelector(`button[data-tab="${tabId}"]`).classList.add('active-tab');

    // Załaduj dane dla aktywnej zakładki
    if (tabId === 'members-view') {
        renderMembersView();
    } else if (tabId === 'events-view') {
        renderEventsView();
    }
}

// --- LOGIKA ZAKŁADKI "CZŁONKOWIE" ---

// Renderowanie listy graczy
async function renderMembersView() {
    const { data: players, error } = await supabaseClient
        .from('players')
        .select('*')
        .eq('is_active', true) // Pobieramy tylko aktywnych członków
        .order('name', { ascending: true });

    if (error) {
        console.error("Błąd pobierania graczy:", error);
        return;
    }

    playersListContainer.innerHTML = players.map(player => `
        <div class="player-item">
            <span>${player.name}</span>
            <button class="delete-player-button" data-player-id="${player.id}" data-player-name="${player.name}">Usuń</button>
        </div>
    `).join('');
}

// Obsługa dodawania nowego gracza
addPlayerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newName = playerNameInput.value.trim();
    if (!newName) return;

    const { error } = await supabaseClient.from('players').insert({ name: newName });
    if (error) {
        console.error("Błąd dodawania gracza:", error);
        alert(`Nie udało się dodać gracza. Być może gracz o tej nazwie już istnieje.`);
    } else {
        playerNameInput.value = '';
        renderMembersView(); // Odśwież listę
    }
});

// Obsługa usuwania gracza (delegacja zdarzeń)
playersListContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-player-button')) {
        const playerId = event.target.dataset.playerId;
        const playerName = event.target.dataset.playerName;
        
        const reason = prompt(`Czy na pewno chcesz usunąć gracza "${playerName}"?\n\nPodaj powód usunięcia (lub zostaw puste, jeśli gracz odszedł sam). Anulowanie odwoła akcję.`);

        // Jeśli użytkownik kliknął "Anuluj", prompt zwróci null
        if (reason !== null) {
            // Zamiast kasować, "deaktywujemy" gracza i dodajemy notatkę
            const { error } = await supabaseClient
                .from('players')
                .update({ is_active: false, notes: reason })
                .eq('id', playerId);

            if (error) {
                console.error("Błąd usuwania gracza:", error);
            } else {
                renderMembersView(); // Odśwież listę
            }
        }
    }
});


// --- LOGIKA ZAKŁADKI "EVENTY" ---

// Na razie pusta funkcja, którą rozwiniemy później
async function renderEventsView() {
    eventsListContainer.innerHTML = `<p>Tutaj wkrótce pojawi się lista eventów i możliwość zarządzania nimi.</p>`;
}

// --- OGÓLNE FUNKCJE UI I AUTENTYKACJI ---

function updateUI(user) {
    if (user) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        // Po zalogowaniu domyślnie pokazuj pierwszą zakładkę
        switchTab('members-view');
    } else {
        authView.classList.remove('hidden');
        appView.classList.add('hidden');
        logoutButton.classList.add('hidden');
    }
}

// Inicjalizacja aplikacji
function init() {
    // Logika przycisków nawigacji
    tabs.forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.tab));
    });

    // Logika wylogowania
    logoutButton.addEventListener('click', async () => {
        await supabaseClient.auth.signOut();
        updateUI(null);
    });
    
    // Logika formularza logowania
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

        if (error) {
            errorMessage.textContent = 'Nieprawidłowy email lub hasło.';
        } else {
            errorMessage.textContent = '';
            updateUI(data.user);
        }
    });

    // Sprawdź status logowania przy starcie
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        const user = session ? session.user : null;
        updateUI(user);
    });
}

// Uruchom aplikację
init();
