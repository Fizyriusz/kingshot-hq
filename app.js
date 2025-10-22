// === KROK 1: KONFIGURACJA SUPABASE ===
// Wklej tutaj swój URL i klucz 'anon' ze strony Supabase.
const SUPABASE_URL = 'https://tkpadqrbkknrscxjtatr.supabase.co'; // <-- ZASTĄP TO
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcGFkcXJia2tucnNjeGp0YXRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwNzAxMDEsImV4cCI6MjA3NjY0NjEwMX0._KoZoOjLVW_2JxM8FBVLXuPQkJ5lP3tgCMPrgTj9q0A';   // <-- ZASTĄP TO

// Tworzymy klienta Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// === KROK 2: POBRANIE ELEMENTÓW ZE STRONY (HTML) ===
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const errorMessage = document.getElementById('error-message');
const groupsContainer = document.getElementById('groups-container');

// === KROK 3: LOGIKA LOGOWANIA I WYLOGOWYWANIA ===

// Co się stanie, gdy ktoś kliknie "Zaloguj"
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Zapobiegaj przeładowaniu strony
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        errorMessage.textContent = 'Nieprawidłowy email lub hasło.';
        console.error('Błąd logowania:', error);
    } else {
        errorMessage.textContent = '';
        updateUI(data.user); 
    }
});

// Co się stanie, gdy ktoś kliknie "Wyloguj"
logoutButton.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    updateUI(null);
});


// === KROK 4: POBIERANIE, WYŚWIETLANIE I MODYFIKACJA DANYCH ===

// ZASTĄP STARĄ WERSJĘ TEJ FUNKCJI
async function fetchAndDisplayGroups() {
    const { data: events, error } = await supabaseClient
        .from('events')
        .select(`
            name,
            groups (
                id,
                name,
                group_members (
                    id,
                    player_name,
                    status
                )
            )
        `)
        .eq('id', 1);

    if (error) {
        console.error('Błąd pobierania danych:', error);
        groupsContainer.innerHTML = '<p class="error">Nie udało się załadować danych.</p>';
        return;
    }

    groupsContainer.innerHTML = '';
    if (events && events.length > 0) {
        const event = events[0];
        appView.querySelector('h2').textContent = `Aktywny Event: ${event.name}`;

        event.groups.forEach(group => {
            const groupCard = document.createElement('div');
            groupCard.className = 'group-card';

            // ZMIANA: Tworzymy teraz listę z listą rozwijaną (select) dla każdego członka
            let membersHtml = group.group_members.map(member => `
                <li>
                    ${member.player_name}
                    <select class="status-select" data-member-id="${member.id}">
                        <option value="Nieokreślony" ${member.status === 'Nieokreślony' ? 'selected' : ''}>Nieokreślony</option>
                        <option value="Aktywny" ${member.status === 'Aktywny' ? 'selected' : ''}>Aktywny</option>
                        <option value="Nieaktywny" ${member.status === 'Nieaktywny' ? 'selected' : ''}>Nieaktywny</option>
                        <option value="Problem" ${member.status === 'Problem' ? 'selected' : ''}>Problem</option>
                    </select>
                </li>
            `).join('');

            groupCard.innerHTML = `
                <h3>${group.name}</h3>
                <ul>${membersHtml || '<li>Brak członków w tej grupie.</li>'}</ul>
                <form class="add-member-form">
                    <input type="hidden" name="group-id" value="${group.id}">
                    <input type="text" name="player-name" placeholder="Nazwa gracza" required>
                    <button type="submit">Dodaj członka</button>
                </form>
            `;
            groupsContainer.appendChild(groupCard);
        });

        attachEventListeners(); // ZMIANA: Zmieniliśmy nazwę funkcji
    } else {
        groupsContainer.innerHTML = '<p>Brak aktywnego eventu lub grup do wyświetlenia.</p>';
    }
}

// ZASTĄP STARĄ FUNKCJĘ 'attachFormListeners' TĄ NOWĄ
function attachEventListeners() {
    // Logika dla formularzy dodawania (bez zmian)
    const forms = document.querySelectorAll('.add-member-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const playerName = form.querySelector('input[name="player-name"]').value;
            const groupId = form.querySelector('input[name="group-id"]').value;
            const { error } = await supabaseClient.from('group_members').insert({ group_id: groupId, player_name: playerName, status: 'Nieokreślony' });

            if (error) {
                console.error('Błąd dodawania członka:', error);
                alert('Nie udało się dodać członka.');
            } else {
                form.querySelector('input[name="player-name"]').value = '';
                fetchAndDisplayGroups();
            }
        });
    });

    // NOWY KOD: Logika dla list rozwijanych do zmiany statusu
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', async (event) => {
            const memberId = event.target.dataset.memberId;
            const newStatus = event.target.value;

            // Używamy .update() do zmiany danych w bazie
            const { error } = await supabaseClient
                .from('group_members')
                .update({ status: newStatus })
                .eq('id', memberId); // .eq() zapewnia, że aktualizujemy właściwy wiersz

            if (error) {
                console.error('Błąd aktualizacji statusu:', error);
                alert('Nie udało się zaktualizować statusu.');
            } else {
                console.log(`Status członka ${memberId} zmieniony na ${newStatus}`);
                // Nie musimy odświeżać całej listy, bo zmiana jest już widoczna w UI!
            }
        });
    });
}// ZASTĄP STARĄ WERSJĘ TEJ FUNKCJI
async function fetchAndDisplayGroups() {
    const { data: events, error } = await supabaseClient
        .from('events')
        .select(`
            name,
            groups (
                id,
                name,
                group_members (
                    id,
                    player_name,
                    status
                )
            )
        `)
        .eq('id', 1);

    if (error) {
        console.error('Błąd pobierania danych:', error);
        groupsContainer.innerHTML = '<p class="error">Nie udało się załadować danych.</p>';
        return;
    }

    groupsContainer.innerHTML = '';
    if (events && events.length > 0) {
        const event = events[0];
        appView.querySelector('h2').textContent = `Aktywny Event: ${event.name}`;

        event.groups.forEach(group => {
            const groupCard = document.createElement('div');
            groupCard.className = 'group-card';

            // ZMIANA: Tworzymy teraz listę z listą rozwijaną (select) dla każdego członka
            let membersHtml = group.group_members.map(member => `
                <li>
                    ${member.player_name}
                    <select class="status-select" data-member-id="${member.id}">
                        <option value="Nieokreślony" ${member.status === 'Nieokreślony' ? 'selected' : ''}>Nieokreślony</option>
                        <option value="Aktywny" ${member.status === 'Aktywny' ? 'selected' : ''}>Aktywny</option>
                        <option value="Nieaktywny" ${member.status === 'Nieaktywny' ? 'selected' : ''}>Nieaktywny</option>
                        <option value="Problem" ${member.status === 'Problem' ? 'selected' : ''}>Problem</option>
                    </select>
                </li>
            `).join('');

            groupCard.innerHTML = `
                <h3>${group.name}</h3>
                <ul>${membersHtml || '<li>Brak członków w tej grupie.</li>'}</ul>
                <form class="add-member-form">
                    <input type="hidden" name="group-id" value="${group.id}">
                    <input type="text" name="player-name" placeholder="Nazwa gracza" required>
                    <button type="submit">Dodaj członka</button>
                </form>
            `;
            groupsContainer.appendChild(groupCard);
        });

        attachEventListeners(); // ZMIANA: Zmieniliśmy nazwę funkcji
    } else {
        groupsContainer.innerHTML = '<p>Brak aktywnego eventu lub grup do wyświetlenia.</p>';
    }
}

// ZASTĄP STARĄ FUNKCJĘ 'attachFormListeners' TĄ NOWĄ
function attachEventListeners() {
    // Logika dla formularzy dodawania (bez zmian)
    const forms = document.querySelectorAll('.add-member-form');
    forms.forEach(form => {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const playerName = form.querySelector('input[name="player-name"]').value;
            const groupId = form.querySelector('input[name="group-id"]').value;
            const { error } = await supabaseClient.from('group_members').insert({ group_id: groupId, player_name: playerName, status: 'Nieokreślony' });

            if (error) {
                console.error('Błąd dodawania członka:', error);
                alert('Nie udało się dodać członka.');
            } else {
                form.querySelector('input[name="player-name"]').value = '';
                fetchAndDisplayGroups();
            }
        });
    });

    // NOWY KOD: Logika dla list rozwijanych do zmiany statusu
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', async (event) => {
            const memberId = event.target.dataset.memberId;
            const newStatus = event.target.value;

            // Używamy .update() do zmiany danych w bazie
            const { error } = await supabaseClient
                .from('group_members')
                .update({ status: newStatus })
                .eq('id', memberId); // .eq() zapewnia, że aktualizujemy właściwy wiersz

            if (error) {
                console.error('Błąd aktualizacji statusu:', error);
                alert('Nie udało się zaktualizować statusu.');
            } else {
                console.log(`Status członka ${memberId} zmieniony na ${newStatus}`);
                // Nie musimy odświeżać całej listy, bo zmiana jest już widoczna w UI!
            }
        });
    });
}


// === KROK 5: ZARZĄDZANIE WIDOKIEM I SESJĄ ===

function updateUI(user) {
    if (user) {
        authView.classList.add('hidden');
        appView.classList.remove('hidden');
        logoutButton.classList.remove('hidden');
        fetchAndDisplayGroups();
    } else {
        authView.classList.remove('hidden');
        appView.classList.add('hidden');
        logoutButton.classList.add('hidden');
        groupsContainer.innerHTML = '';
    }
}

// Sprawdź status logowania, gdy strona się załaduje
supabaseClient.auth.onAuthStateChange((event, session) => {
    const user = session ? session.user : null;
    updateUI(user);
});