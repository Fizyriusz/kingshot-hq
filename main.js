// main.js
import { supabaseClient } from './config.js';
import * as dom from './dom.js';
import * as state from './state.js';
import {
    setLang, setView, setEventDetailFilters, setMemberFilters,
    setMemberSort, setLastSyncAnalysis, setEventDetailSort
} from './state.js';
import { t } from './utils.js';
import {
    applyStaticTranslations,
    renderMembersView,
    renderPlayerHistoryView,
    renderSyncResults,
    renderEventsListView,
    renderEventDetailView,
    renderSnapshotsView,
    renderSnapshotDetailView,
    // renderKvkEventsList, // Usunięto
    // renderKvkDetailView, // Usunięto
    renderStatistics
} from './render.js';

// --- GŁÓWNA LOGIKA APLIKACJI ---

function setLanguage(lang) {
    setLang(lang);
    localStorage.setItem('kingshotLang', lang);
    applyStaticTranslations(dom, t, state);
    switchTab(state.currentView.tabId, state.currentView.params, false);
}

// Zmieniona logika switchTab, aby poprawnie obsługiwać "pod-widoki"
function switchTab(tabId, params = {}, updateState = true) {
    if (updateState) {
        setView(tabId, params); // Zapisz nowy stan
    }
    
    // Resetuj stany tylko przy przejściu do GŁÓWNEGO widoku zakładki
    if (updateState && Object.keys(params).length === 0) { 
        if (tabId !== 'events-view') { 
            setEventDetailFilters({ marches: '', name: '', power: '' }); 
            setEventDetailSort({ column: 'power_level', direction: 'desc' });
        }
        if (tabId !== 'members-view') { 
            setMemberFilters({ name: '', power: '' }); 
            setMemberSort({ column: 'name', direction: 'asc' }); 
        }
        if (tabId === 'members-view') {
            dom.syncResultsContainer.innerHTML = '';
            setLastSyncAnalysis(null);
        }
    }
    
    dom.tabPanes.forEach(pane => pane.classList.add('hidden'));
    dom.tabs.forEach(tab => tab.classList.remove('active-tab'));
    
    // Pokaż kontener główny zakładki (np. 'members-view')
    document.getElementById(tabId).classList.remove('hidden');
    // Ustaw przycisk zakładki jako aktywny
    const tabButton = document.querySelector(`button[data-tab="${tabId}"]`);
    if (tabButton) {
        tabButton.classList.add('active-tab');
    }

    renderStatistics();

    // Logika routingu (kierowania do odpowiedniej funkcji renderującej)
    if (tabId === 'members-view') {
        if (params.playerId) {
            renderPlayerHistoryView(params.playerId, params.playerName, switchTab);
        } else {
            renderMembersView();
        }
    } else if (tabId === 'events-view') {
        if (params.eventId) {
            renderEventDetailView(params.eventId, params.eventName, switchTab);
        } else {
            renderEventsListView();
        }
    } else if (tabId === 'snapshots-view') {
        if (params.date) {
            renderSnapshotDetailView(params.date, switchTab);
        } else {
            renderSnapshotsView();
        }
    }
    // Usunięto 'kvk-view'
}

// --- HANDLERY SYNCHRONIZACJI ---
async function handleSyncAnalysis(event) {
    event.preventDefault();
    dom.syncResultsContainer.innerHTML = `<p>${t('syncAnalyzing')}</p>`;
    const pastedText = dom.syncPlayersInput.value.trim();
    const pastedListMap = new Map();
    try {
        const lines = pastedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        lines.forEach(line => {
            const parts = line.split(',');
            if (!parts[0]) throw new Error(t('bulkParseError', 'Każdy wiersz musi mieć przynajmniej nazwę.'));
            const name = parts[0].trim();
            if (pastedListMap.has(name)) { console.warn(`Zduplikowany nick w liście wklejonej: ${name}. Użyto ostatniego wpisu.`); }
            pastedListMap.set(name, { name: name, th_level: parts[1] ? parseInt(parts[1].trim()) || null : null, power_level: parts[2] ? parts[2].trim() || null : null });
        });
    } catch (parseError) {
        alert(t('bulkParseError', parseError.message));
        dom.syncResultsContainer.innerHTML = '';
        return;
    }
    const { data: dbPlayers, error } = await supabaseClient.from('players').select('*').eq('is_active', true);
    if (error) { alert(t('loadingError')); dom.syncResultsContainer.innerHTML = ''; return; }
    const dbListMap = new Map(dbPlayers.map(p => [p.name, p]));
    const toAdd = [], toUpdate = [], toRemove = [];
    for (const [name, pastedPlayer] of pastedListMap.entries()) {
        const dbPlayer = dbListMap.get(name);
        if (!dbPlayer) { toAdd.push(pastedPlayer); } 
        else {
            const db_th = dbPlayer.th_level || null, pasted_th = pastedPlayer.th_level || null;
            const db_power = dbPlayer.power_level || null, pasted_power = pastedPlayer.power_level || null;
            if (db_th !== pasted_th || db_power !== pasted_power) {
                toUpdate.push({ id: dbPlayer.id, name: name, oldData: { th: db_th, power: db_power }, newData: { th_level: pasted_th, power_level: pasted_power } });
            }
        }
    }
    for (const [name, dbPlayer] of dbListMap.entries()) {
        if (!pastedListMap.has(name)) { toRemove.push(dbPlayer); }
    }
    setLastSyncAnalysis({ toAdd, toUpdate, toRemove });
    renderSyncResults({ toAdd, toUpdate, toRemove });
}

async function handleSyncExecute(e) {
    if (!e.target.classList.contains('sync-execute-button')) return;
    if (!state.lastSyncAnalysis) return;
    e.target.disabled = true; e.target.textContent = t('syncAnalyzing');
    const toAdd = [], toUpdate = [], toRemove = [], toRename = [];
    const newPlayerMap = new Map(state.lastSyncAnalysis.toAdd.map(p => [p.name, p]));
    const renameTargets = new Set();
    document.querySelectorAll('input[data-sync-type="remove"]:checked').forEach(checkbox => {
        const index = checkbox.dataset.index; const playerToRemove = state.lastSyncAnalysis.toRemove[index];
        const renameSelect = document.querySelector(`select[data-remove-index="${index}"]`); const newName = renameSelect ? renameSelect.value : '';
        if (newName) {
            const newPlayerData = newPlayerMap.get(newName);
            if (newPlayerData) { toRename.push({ id: playerToRemove.id, newData: { name: newPlayerData.name, th_level: newPlayerData.th_level, power_level: newPlayerData.power_level } }); renameTargets.add(newName); }
        } else { toRemove.push(playerToRemove); }
    });
    document.querySelectorAll('input[data-sync-type="add"]:checked').forEach(checkbox => {
        const index = checkbox.dataset.index; const playerToAdd = state.lastSyncAnalysis.toAdd[index];
        if (!renameTargets.has(playerToAdd.name)) { toAdd.push(playerToAdd); }
    });
    document.querySelectorAll('input[data-sync-type="update"]:checked').forEach(checkbox => {
        const index = checkbox.dataset.index; toUpdate.push(state.lastSyncAnalysis.toUpdate[index]);
    });
    let errors = [];
    try {
        if (toAdd.length > 0) { const { error } = await supabaseClient.from('players').insert(toAdd); if (error) errors.push(`Add: ${error.message}`); }
        if (toUpdate.length > 0) { const promises = toUpdate.map(p => supabaseClient.from('players').update(p.newData).eq('id', p.id)); const results = await Promise.all(promises); results.forEach((r, i) => { if (r.error) errors.push(`Update (${toUpdate[i].name}): ${r.error.message}`); }); }
        if (toRename.length > 0) { const promises = toRename.map(p => supabaseClient.from('players').update(p.newData).eq('id', p.id)); const results = await Promise.all(promises); results.forEach((r, i) => { if (r.error) errors.push(`Rename (${toRename[i].newData.name}): ${r.error.message}`); }); }
        if (toRemove.length > 0) { const ids = toRemove.map(p => p.id); const { error } = await supabaseClient.from('players').update({ is_active: false, notes: 'Removed by sync' }).in('id', ids); if (error) errors.push(`Remove: ${error.message}`); }
    } catch (e) { errors.push(e.message); }
    if (errors.length > 0) { alert(t('syncError') + "\n" + errors.join('\n')); } else { alert(t('syncSuccess')); }
    dom.syncResultsContainer.innerHTML = ''; dom.syncPlayersInput.value = ''; state.setLastSyncAnalysis(null); renderMembersView(); renderStatistics();
}

// --- FUNKCJE UI I AUTENTYKACJI ---
function updateUI(user) {
    if (user) {
        dom.authView.classList.add('hidden'); dom.appView.classList.remove('hidden'); dom.logoutButton.classList.remove('hidden');
        renderStatistics();
        switchTab(state.currentView.tabId, state.currentView.params, false); 
    } else {
        dom.authView.classList.remove('hidden'); dom.appView.classList.add('hidden'); dom.logoutButton.classList.add('hidden');
        dom.statsContent.innerHTML = '';
        localStorage.removeItem('kingshotCurrentView');
    }
    applyStaticTranslations(dom, t, state);
}

function init() {
    applyStaticTranslations(dom, t, state);

    // --- GŁÓWNE LISTENERY ---
    document.getElementById('lang-switcher').addEventListener('click', (e) => { const lang = e.target.dataset.lang; if (lang && lang !== state.currentLang) { setLanguage(lang); } });
    dom.logoutButton.addEventListener('click', async () => { await supabaseClient.auth.signOut(); updateUI(null); });
    dom.loginForm.addEventListener('submit', async (e) => { e.preventDefault(); const { data, error } = await supabaseClient.auth.signInWithPassword({ email: dom.emailInput.value, password: dom.passwordInput.value }); if (error) { dom.errorMessage.textContent = t('invalidLogin'); } else { dom.errorMessage.textContent = ''; updateUI(data.user); } });
    dom.tabs.forEach(tab => tab.addEventListener('click', () => switchTab(tab.dataset.tab)));
    
    // --- LISTENERY ZAKŁADKI CZŁONKOWIE ---
    dom.addPlayerForm.addEventListener('submit', async (e) => { e.preventDefault(); const newName = dom.playerNameInput.value.trim(); const thLevel = dom.playerThInput.value; const powerLevel = dom.playerPowerInput.value.trim(); const marches = dom.playerMarchesInput.value; if (!newName) return; const { error } = await supabaseClient.from('players').insert({ name: newName, th_level: thLevel || null, power_level: powerLevel || null, marches: marches || null }); if (error) alert(t('playerAddError')); else { dom.playerNameInput.value = ''; dom.playerThInput.value = ''; dom.playerPowerInput.value = ''; dom.playerMarchesInput.value = ''; renderMembersView(); renderStatistics(); } });
    dom.syncPlayersForm.addEventListener('submit', handleSyncAnalysis);
    dom.syncResultsContainer.addEventListener('click', handleSyncExecute);
    dom.playersListContainer.addEventListener('click', async (e) => {
        if (e.target.classList.contains('delete-player-button')) { const playerId = e.target.dataset.playerId; const playerName = e.target.dataset.playerName; const reason = prompt(t('deleteConfirm', playerName)); if (reason !== null) { const { error } = await supabaseClient.from('players').update({ is_active: false, notes: reason || t('noReason') }).eq('id', playerId); if (error) { console.error(t('playerDeleteError'), error); } else { renderMembersView(); renderStatistics(); } } }
        if (e.target.classList.contains('restore-player-button')) { const playerId = e.target.dataset.playerId; if (confirm(t('restoreConfirm'))) { const { error } = await supabaseClient.from('players').update({ is_active: true, notes: null }).eq('id', playerId); if (error) { console.error(t('playerRestoreError'), error); } else { renderMembersView(); renderStatistics(); } } }
        if (e.target.classList.contains('history-player-button')) { const playerId = e.target.dataset.playerId; const playerName = e.target.dataset.playerName; switchTab('members-view', { playerId, playerName }); }
        if (e.target.id === 'back-to-members-list') { switchTab('members-view'); }
    });
    dom.playersListContainer.addEventListener('change', async (e) => { const playerId = e.target.dataset.playerId; if (!playerId) return; let updateData = {}; if (e.target.classList.contains('player-th-input')) { updateData.th_level = e.target.value || null; } if (e.target.classList.contains('player-marches-select')) { updateData.marches = e.target.value || null; } if (e.target.classList.contains('player-power-input')) { updateData.power_level = e.target.value.trim() || null; } if (Object.keys(updateData).length > 0) { const { error } = await supabaseClient.from('players').update(updateData).eq('id', playerId); if (error) { console.error(t('playerUpdateError'), error); alert(t('playerUpdateError')); } else { console.log(`Zaktualizowano gracza ${playerId} z:`, updateData); renderStatistics(); } } });
    dom.memberFilterNameInput.addEventListener('input', (e) => { state.setMemberFilters({ ...state.memberFilters, name: e.target.value }); renderMembersView(); });
    dom.memberFilterPowerInput.addEventListener('input', (e) => { state.setMemberFilters({ ...state.memberFilters, power: e.target.value }); renderMembersView(); });
    dom.showInactiveToggle.addEventListener('change', () => { renderMembersView(); });
    dom.memberSortControlsContainer.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('sort-button')) {
            const newColumn = target.dataset.sort;
            if (state.memberSort.column === newColumn) { state.setMemberSort({ ...state.memberSort, direction: state.memberSort.direction === 'asc' ? 'desc' : 'asc' }); }
            else { state.setMemberSort({ column: newColumn, direction: 'asc' }); }
            renderMembersView();
        }
        if (target.id === 'sort-direction-button') {
            state.setMemberSort({ ...state.memberSort, direction: state.memberSort.direction === 'asc' ? 'desc' : 'asc' });
            renderMembersView();
        }
    });

    // --- LISTENERY ZAKŁADKI EVENTY ---
    dom.addEventForm.addEventListener('submit', async(e) => { e.preventDefault(); const newName = dom.eventNameInput.value.trim(); if (!newName) return; const { error } = await supabaseClient.from('events').insert({ name: newName }); if (error) alert(t('eventAddError')); else { dom.eventNameInput.value = ''; renderEventsListView(); } });
    dom.eventsListContainer.addEventListener('click', async (e) => { 
        const eventItem = e.target.closest('.event-item'); 
        const deleteButton = e.target.closest('.delete-event-button'); 
        if (deleteButton) { e.stopPropagation(); const eventId = deleteButton.dataset.eventId; const eventName = deleteButton.dataset.eventName; if (confirm(t('deleteEventConfirm', eventName))) { const { error } = await supabaseClient.from('events').delete().eq('id', eventId); if (error) { alert(t('eventDeleteError')); } else { renderEventsListView(); } } } 
        else if (eventItem) { if (e.target.classList.contains('event-name-span') || e.target === eventItem) { const eventId = eventItem.dataset.eventId; const eventName = eventItem.dataset.eventName; 
            switchTab('events-view', { eventId, eventName });
        } } 
    });

    // --- LISTENERY ZAKŁADKI SNAPSHOTY ---
    dom.createSnapshotButton.addEventListener('click', async () => { if (!confirm(t('snapshotConfirm'))) { return; } const { data: players, error: fetchError } = await supabaseClient.from('players').select('id, name, th_level, power_level, marches').eq('is_active', true); if (fetchError) { alert(t('snapshotFetchError')); console.error(fetchError); return; } const snapshotDate = new Date().toISOString().split('T')[0]; const snapshotData = players.map(player => ({ player_id: player.id, snapshot_date: snapshotDate, player_name: player.name, th_level: player.th_level, power_level: player.power_level, marches: player.marches })); const { error: insertError } = await supabaseClient.from('player_snapshots').insert(snapshotData); if (insertError) { alert(t('snapshotSaveError', insertError.message)); console.error(insertError); } else { alert(t('snapshotSaveSuccess', players.length)); renderSnapshotsView(); } });
    dom.snapshotsListContainer.addEventListener('click', (e) => { 
        const snapshotItem = e.target.closest('.snapshot-item'); 
        if (snapshotItem) { 
            const snapshotDate = snapshotItem.dataset.date; 
            switchTab('snapshots-view', { date: snapshotDate });
        } 
    });
    
    // --- LISTENERY ZAKŁADKI KVK (USUNIĘTE) ---
    // dom.createKvkEventForm.addEventListener('submit', ...);
    // dom.kvkContentContainer.addEventListener('click', ...);

    // --- START APLIKACJI ---
    supabaseClient.auth.onAuthStateChange((_event, session) => { updateUI(session ? session.user : null); });
}

// Uruchom aplikację
init();