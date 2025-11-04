// render.js
import { supabaseClient } from './config.js';
import * as dom from './dom.js';
import * as state from './state.js';
import { t, parsePower } from './utils.js';

// --- TŁUMACZENIA ---
export function applyStaticTranslations() {
    document.documentElement.lang = state.currentLang; document.title = t('appTitle');
    document.querySelectorAll('[data-translate-key]').forEach(el => { el.textContent = t(el.dataset.translateKey); });
    dom.emailInput.placeholder = t('emailPlaceholder'); dom.passwordInput.placeholder = t('passwordPlaceholder');
    dom.playerNameInput.placeholder = t('playerNamePlaceholder'); dom.playerThInput.placeholder = t('thPlaceholder'); dom.playerPowerInput.placeholder = t('powerPlaceholder');
    dom.eventNameInput.placeholder = t('eventNamePlaceholder');
    dom.memberFilterNameInput.placeholder = t('nameFilterPlaceholder'); dom.memberFilterPowerInput.placeholder = t('powerFilterPlaceholder');
    if (dom.syncPlayersInput) { dom.syncPlayersInput.placeholder = t('syncToolPlaceholder'); }
    
    const memberSortControls = document.querySelector('#members-view .sort-controls');
    if (memberSortControls) {
        memberSortControls.querySelector('.sort-button[data-sort="name"]').textContent = t('sortName');
        memberSortControls.querySelector('.sort-button[data-sort="th_level"]').textContent = t('sortTH');
        memberSortControls.querySelector('.sort-button[data-sort="power_level"]').textContent = t('sortPower');
        memberSortControls.querySelector('.sort-button[data-sort="marches"]').textContent = t('sortMarches');
    }
    const kvkSortControls = document.querySelector('#kvk-view .sort-controls');
    if (kvkSortControls) {
        kvkSortControls.querySelector('.sort-button[data-sort="name"]').textContent = t('sortName');
        kvkSortControls.querySelector('.sort-button[data-sort="th_level"]').textContent = t('sortTH');
        kvkSortControls.querySelector('.sort-button[data-sort="power_level"]').textContent = t('sortPower');
        kvkSortControls.querySelector('.sort-button[data-sort="marches"]').textContent = t('sortMarches');
    }
    const kvkNameInput = document.getElementById('kvk-event-name-input');
    if (kvkNameInput) { kvkNameInput.placeholder = t('kvkEventNamePlaceholder'); }
    
    document.querySelectorAll('#lang-switcher button').forEach(btn => { btn.classList.toggle('active-lang', btn.dataset.lang === state.currentLang); });
}

// --- ZAKŁADKA "CZŁONKOWIE" ---

export function toggleMemberControls(show) {
    dom.memberControls.forEach(el => el.classList.toggle('hidden', !show));
}

export async function renderMembersView() {
    const showInactive = dom.showInactiveToggle.checked;
    toggleMemberControls(true); // Zawsze pokazuj kontrolki (naprawia błąd)
    // Ukryj filtry/sortowanie tylko jeśli pokazujemy nieaktywnych
    document.querySelector('.member-filters').classList.toggle('hidden', showInactive);
    dom.memberSortControlsContainer.classList.toggle('hidden', showInactive);


    let query = supabaseClient.from('players').select('*').eq('is_active', !showInactive);
    if (state.memberSort.column !== 'power_level') {
        query = query.order(state.memberSort.column, { ascending: state.memberSort.direction === 'asc' });
    } else {
        query = query.order('name', { ascending: true });
    }
    const { data: allPlayers, error } = await query;
    if (error) { console.error("Błąd pobierania graczy:", error); return; }

    let playersToRender = allPlayers;
    if (!showInactive) {
        if (state.memberFilters.name) { const filterName = state.memberFilters.name.toLowerCase(); playersToRender = playersToRender.filter(p => p.name.toLowerCase().includes(filterName)); }
        if (state.memberFilters.power) { const filterPower = state.memberFilters.power.toLowerCase(); playersToRender = playersToRender.filter(p => (p.power_level || '').toLowerCase().includes(filterPower)); }
        dom.memberFilterNameInput.value = state.memberFilters.name;
        dom.memberFilterPowerInput.value = state.memberFilters.power;

        if (state.memberSort.column === 'power_level') {
            playersToRender.sort((a, b) => {
                const powerA = parsePower(a.power_level); const powerB = parsePower(b.power_level);
                if (powerA === 0 && powerB !== 0) return state.memberSort.direction === 'asc' ? 1 : -1;
                if (powerB === 0 && powerA !== 0) return state.memberSort.direction === 'asc' ? -1 : 1;
                return state.memberSort.direction === 'asc' ? powerA - powerB : powerB - powerA;
            });
        }
    }

    dom.memberSortControlsContainer.querySelectorAll('.sort-button').forEach(btn => {
        btn.classList.toggle('active-sort', btn.dataset.sort === state.memberSort.column);
    });
    dom.sortDirectionButton.textContent = state.memberSort.direction === 'asc' ? '🔼' : '🔽';
    dom.sortDirectionButton.dataset.direction = state.memberSort.direction;

    if (showInactive) {
        dom.membersListHeader.textContent = t('inactiveMembers');
         dom.playersListContainer.innerHTML = playersToRender.map(player => `
            <div class="player-item">
                <span class="player-name">${player.name}</span>
                <div class="player-details"> <span class="player-notes">${t('reasonLabel')}: ${player.notes || t('noReason')}</span> </div>
                <button class="restore-player-button" data-player-id="${player.id}">${t('restore')}</button>
            </div>
        `).join('');
    } else {
        dom.membersListHeader.textContent = t('activeMembers');
         dom.playersListContainer.innerHTML = playersToRender.map(player => `
            <div class="player-item">
                <span class="player-name">${player.name}</span>
                <div class="player-details">
                    <label>${t('thLabel')}:</label> <input type="number" class="player-th-input" value="${player.th_level || ''}" data-player-id="${player.id}" min="1" placeholder="${t('lvlPlaceholder')}">
                    <label>${t('powerLabel')}:</label> <input type="text" class="player-power-input" value="${player.power_level || ''}" data-player-id="${player.id}" placeholder="${t('powerPlaceholderShort')}">
                    <label>${t('marchesLabel')}:</label> <select class="player-marches-select" data-player-id="${player.id}"> <option value="" ${!player.marches ? 'selected' : ''}>?</option> <option value="4" ${player.marches == 4 ? 'selected' : ''}>4</option> <option value="5" ${player.marches == 5 ? 'selected' : ''}>5</option> <option value="6" ${player.marches == 6 ? 'selected' : ''}>6</option> </select>
                </div>
                <button class="history-player-button" data-player-id="${player.id}" data-player-name="${player.name}" title="${t('historyButton')}">📊</button>
                <button class="delete-player-button" data-player-id="${player.id}" data-player-name="${player.name}">${t('delete')}</button>
            </div>
        `).join('');
    }
}

// NOWA FUNKCJA WIDOKU HISTORII GRACZA
export async function renderPlayerHistoryView(playerId, playerName) {
    toggleMemberControls(false); // Ukryj filtry i sortowanie
    dom.playersListContainer.innerHTML = `<p>${t('syncAnalyzing')}</p>`;

    const { data: snapshots, error } = await supabaseClient
        .from('player_snapshots')
        .select('*')
        .eq('player_id', playerId)
        .order('snapshot_date', { ascending: false });

    if (error) {
        dom.playersListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`;
        return;
    }

    let html = `
        <div class="event-detail-header">
            <h2>${t('historyForPlayer', playerName)}</h2>
            <button id="back-to-members-list">${t('backToMembers')}</button>
        </div>
    `;

    if (snapshots.length === 0) {
        html += `<p>${t('noHistoryForPlayer')}</p>`;
    } else {
        html += snapshots.map(snapshot => `
            <div class="snapshot-item">
                <span class="player-name">${t('snapshotDate')}: ${new Date(snapshot.snapshot_date).toLocaleDateString(state.currentLang)}</span>
                <div class="player-details">
                    <span>${t('thLabel')}: <strong>${snapshot.th_level || '?'}</strong></span>
                    <span>${t('powerLabel')}: <strong>${snapshot.power_level || '?'}</strong></span>
                    <span>${t('marchesLabel')}: <strong>${snapshot.marches || '?'}</strong></span>
                </div>
            </div>
        `).join('');
    }

    dom.playersListContainer.innerHTML = html;
}

// --- LOGIKA SYNCHRONIZACJI ---
export function renderSyncResults(analysis) {
    if (analysis.toAdd.length === 0 && analysis.toUpdate.length === 0 && analysis.toRemove.length === 0) {
        dom.syncResultsContainer.innerHTML = `<h4>${t('syncResultsTitle')}</h4><p>${t('noChangesFound')}</p>`;
        return;
    }
    let html = `<h4>${t('syncResultsTitle')}</h4>`;
    const newPlayerOptions = analysis.toAdd.length > 0 ? analysis.toAdd.map(p => `<option value="${p.name}">${p.name}</option>`).join('') : `<option value="" disabled>${t('noNewPlayersToMap')}</option>`;
    if (analysis.toAdd.length > 0) {
        html += `<div class="sync-section">
            <h4>${t('syncNewPlayers', analysis.toAdd.length)}</h4>
            <ul>${analysis.toAdd.map((p, index) => `
                <li id="sync-add-${index}">
                    <input type="checkbox" checked data-sync-type="add" data-index="${index}">
                    <div class="sync-details new-player">+ ${p.name} (TH: ${p.th_level || '?'}, Power: ${p.power_level || '?'})</div>
                </li>`).join('')}</ul>
        </div>`;
    }
    if (analysis.toUpdate.length > 0) {
        html += `<div class="sync-section">
            <h4>${t('syncUpdatedPlayers', analysis.toUpdate.length)}</h4>
            <ul>${analysis.toUpdate.map((p, index) => `
                <li>
                    <input type="checkbox" checked data-sync-type="update" data-index="${index}">
                    <div class="sync-details">
                        ${p.name}
                        ${p.oldData.th !== p.newData.th_level ? `<div class="update-diff">TH: ${p.oldData.th || '?'} -> ${p.newData.th_level || '?'}</div>` : ''}
                        ${p.oldData.power !== p.newData.power_level ? `<div class="update-diff">Power: ${p.oldData.power || '?'} -> ${p.newData.power_level || '?'}</div>` : ''}
                    </div>
                </li>`).join('')}</ul>
        </div>`;
    }
    if (analysis.toRemove.length > 0) {
        html += `<div class="sync-section">
            <h4>${t('syncRemovedPlayers', analysis.toRemove.length)}</h4>
            <ul>${analysis.toRemove.map((p, index) => `
                <li id="sync-remove-${index}">
                    <input type="checkbox" checked data-sync-type="remove" data-index="${index}">
                    <div class="sync-details removed-player">- ${p.name}</div>
                    <label>${t('renamePlayer')}</label>
                    <select class="rename-select" data-remove-index="${index}">
                        <option value="">--</option>
                        ${newPlayerOptions}
                    </select>
                </li>`).join('')}</ul>
        </div>`;
    }
    html += `<button class="sync-execute-button">${t('executeSync')}</button>`;
    dom.syncResultsContainer.innerHTML = html;
}

// --- ZAKŁADKA "EVENTY" ---
export async function renderEventsListView() {
    dom.addEventForm.classList.remove('hidden');
    dom.kvkContentContainer.innerHTML = '';
    const { data: events, error } = await supabaseClient.from('events').select('*').order('created_at', { ascending: false });
    if (error) { console.error("Błąd pobierania eventów:", error); return; }
    dom.eventsListContainer.innerHTML = events.map(event => `
        <div class="event-item" data-event-id="${event.id}" data-event-name="${event.name}">
            <span class="event-name-span">${event.name}</span>
            <button class="delete-event-button" data-event-id="${event.id}" data-event-name="${event.name}">${t('delete')}</button>
        </div>
    `).join('');
}

export async function renderEventDetailView(eventId, eventName) {
    dom.addEventForm.classList.add('hidden');
    dom.eventsListContainer.innerHTML = `<p>${t('syncAnalyzing')}</p>`;

    const { data: eventData, error: eventError } = await supabaseClient.from('events').select(`groups (id, name, group_members (id, status, players ( id, name )))`).eq('id', eventId).single();
    const { data: allPlayers, error: playersError } = await supabaseClient.from('players').select('*').eq('is_active', true);
    if (eventError || playersError) { console.error(t('loadingError'), eventError || playersError); dom.eventsListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; }

    const assignedPlayerIds = eventData.groups.flatMap(g => g.group_members.map(gm => gm.players.id));
    let availablePlayers = allPlayers.filter(p => !assignedPlayerIds.includes(p.id));

    // Zastosuj filtry na liście dostępnych graczy
    if (state.eventDetailFilters.marches) { availablePlayers = availablePlayers.filter(p => p.marches == state.eventDetailFilters.marches); }
    if (state.eventDetailFilters.name) { const filterName = state.eventDetailFilters.name.toLowerCase(); availablePlayers = availablePlayers.filter(p => p.name.toLowerCase().includes(filterName)); }
    if (state.eventDetailFilters.power) { const filterPower = state.eventDetailFilters.power.toLowerCase(); availablePlayers = availablePlayers.filter(p => (p.power_level || '').toLowerCase().includes(filterPower)); }
    
    // Zastosuj sortowanie do listy dostępnych graczy
    if (state.eventDetailSort.column === 'power_level') {
        availablePlayers.sort((a, b) => {
            const powerA = parsePower(a.power_level); const powerB = parsePower(b.power_level);
            if (powerA === 0 && powerB !== 0) return state.eventDetailSort.direction === 'asc' ? 1 : -1;
            if (powerB === 0 && powerA !== 0) return state.eventDetailSort.direction === 'asc' ? -1 : 1;
            return state.eventDetailSort.direction === 'asc' ? powerA - powerB : powerB - powerA;
        });
    } else {
        availablePlayers.sort((a, b) => {
            const valA = a[state.eventDetailSort.column] || (state.eventDetailSort.column === 'name' ? '' : 0);
            const valB = b[state.eventDetailSort.column] || (state.eventDetailSort.column === 'name' ? '' : 0);
            if (valA < valB) return state.eventDetailSort.direction === 'asc' ? -1 : 1;
            if (valA > valB) return state.eventDetailSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    let html = `
        <div class="event-detail-header"><h2>${t('manageEventTitle', eventName)}</h2><button id="back-to-events-list">${t('backToList')}</button></div>
        
        <div id="event-detail-layout">
            <div id="event-available-players">
                <h3>${t('availablePlayers')} (${availablePlayers.length})</h3>
                
                <div class="player-filters">
                    <label>${t('filterByName')}</label> <input type="text" id="event-filter-name" value="${state.eventDetailFilters.name}">
                    <label>${t('filterByPower')}</label> <input type="text" id="event-filter-power" value="${state.eventDetailFilters.power}">
                    <label>${t('filterByMarches')}</label> 
                    <select id="event-filter-marches">
                        <option value="" ${state.eventDetailFilters.marches === '' ? 'selected' : ''}>${t('all')}</option>
                        <option value="4" ${state.eventDetailFilters.marches === '4' ? 'selected' : ''}>4</option>
                        <option value="5" ${state.eventDetailFilters.marches === '5' ? 'selected' : ''}>5</option>
                        <option value="6" ${state.eventDetailFilters.marches === '6' ? 'selected' : ''}>6</option>
                    </select>
                </div>

                <div class="sort-controls">
                    <span data-translate-key="sortBy">${t('sortBy')}</span>
                    <button data-sort="power_level" class="sort-button ${state.eventDetailSort.column === 'power_level' ? 'active-sort' : ''}" data-translate-key="sortPower">${t('sortPower')}</button>
                    <button data-sort="name" class="sort-button ${state.eventDetailSort.column === 'name' ? 'active-sort' : ''}" data-translate-key="sortName">${t('sortName')}</button>
                    <button data-sort="th_level" class="sort-button ${state.eventDetailSort.column === 'th_level' ? 'active-sort' : ''}" data-translate-key="sortTH">${t('sortTH')}</button>
                    <button data-sort="marches" class="sort-button ${state.eventDetailSort.column === 'marches' ? 'active-sort' : ''}" data-translate-key="sortMarches">${t('sortMarches')}</button>
                    <button id="event-sort-direction-button" data-direction="${state.eventDetailSort.direction}">${state.eventDetailSort.direction === 'asc' ? '🔼' : '🔽'}</button>
                </div>
                
                <div id="event-available-player-list">
                    ${availablePlayers.length > 0 ? availablePlayers.map(p => `
                        <div class="available-player-item">
                            <input type="checkbox" class="event-player-select" data-player-id="${p.id}">
                            <div class="player-info">
                                <span class="player-name">${p.name}</span>
                                (P: ${p.power_level || '?'}, TH: ${p.th_level || '?'}, ${t('marchesLabel')}: ${p.marches || '?'})
                            </div>
                        </div>
                    `).join('') : `<p>${t('noAvailablePlayers')}</p>`}
                </div>
            </div>

            <div id="event-groups-column">
                <form id="create-group-form">
                    <input type="text" name="group-name" placeholder="${t('createGroupPlaceholder')}" required>
                    <button type="submit">${t('createGroupButton')}</button>
                </form>
                <div id="groups-management-container">
                    ${eventData.groups.map(group => `
                        <div class="group-card">
                            <h3>
                                <span>${group.name}</span>
                                <button class="edit-group-name-button" data-group-id="${group.id}" data-group-name="${group.name}">✏️</button>
                            </h3>
                            <ul>${group.group_members.map(member => `
                                <li>
                                    <span>${member.players.name}</span>
                                    <div>
                                        <select class="status-select" data-member-id="${member.id}">
                                            <option value="Nieokreślony" ${member.status === 'Nieokreślony' ? 'selected' : ''}>${t('statusUndefined')}</option>
                                            <option value="Aktywny" ${member.status === 'Aktywny' ? 'selected' : ''}>${t('statusActive')}</option>
                                            <option value="Nieaktywny" ${member.status === 'Nieaktywny' ? 'selected' : ''}>${t('statusInactive')}</option>
                                            <option value="Problem" ${member.status === 'Problem' ? 'selected' : ''}>${t('statusProblem')}</option>
                                        </select>
                                        <button class="remove-from-group-button" data-member-id="${member.id}">X</button>
                                    </div>
                                </li>`).join('') || `<li>${t('noGroupMembers')}</li>`}
                            </ul>
                            <button class="add-selected-to-group-btn" data-group-id="${group.id}">${t('addSelectedToGroup')}</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    dom.eventsListContainer.innerHTML = html;
    attachDetailViewListeners(eventId, eventName);
}

export function attachDetailViewListeners(eventId, eventName) {
    document.getElementById('back-to-events-list').addEventListener('click', renderEventsListView);
    document.getElementById('create-group-form').addEventListener('submit', async (e) => { e.preventDefault(); const groupName = e.target.querySelector('input[name="group-name"]').value.trim(); if (!groupName) return; const { error } = await supabaseClient.from('groups').insert({ name: groupName, event_id: eventId }); if (error) console.error(t('groupCreateError'), error); else renderEventDetailView(eventId, eventName); });
    
    // Listenery dla filtrów i sortowania
    document.getElementById('event-filter-marches').addEventListener('change', (e) => { state.setEventDetailFilters({ ...state.eventDetailFilters, marches: e.target.value }); renderEventDetailView(eventId, eventName); });
    document.getElementById('event-filter-name').addEventListener('input', (e) => { state.setEventDetailFilters({ ...state.eventDetailFilters, name: e.target.value }); renderEventDetailView(eventId, eventName); });
    document.getElementById('event-filter-power').addEventListener('input', (e) => { state.setEventDetailFilters({ ...state.eventDetailFilters, power: e.target.value }); renderEventDetailView(eventId, eventName); });
    document.querySelector('#event-detail-layout .sort-controls').addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('sort-button')) {
            const newColumn = target.dataset.sort;
            if (state.eventDetailSort.column === newColumn) { state.setEventDetailSort({ ...state.eventDetailSort, direction: state.eventDetailSort.direction === 'asc' ? 'desc' : 'asc' }); }
            else { state.setEventDetailSort({ column: newColumn, direction: 'asc' }); }
            renderEventDetailView(eventId, eventName);
        }
        if (target.id === 'event-sort-direction-button') {
            state.setEventDetailSort({ ...state.eventDetailSort, direction: state.eventDetailSort.direction === 'asc' ? 'desc' : 'asc' });
            renderEventDetailView(eventId, eventName);
        }
    });

    // Listenery dla grup
    document.querySelectorAll('.edit-group-name-button').forEach(button => { button.addEventListener('click', async (e) => { const groupId = button.dataset.groupId; const currentName = button.dataset.groupName; const newName = prompt(t('renameGroupPrompt'), currentName); if (newName && newName.trim() !== '' && newName !== currentName) { const { error } = await supabaseClient.from('groups').update({ name: newName.trim() }).eq('id', groupId); if (error) alert(t('groupRenameError')); else renderEventDetailView(eventId, eventName); } }); });
    document.querySelectorAll('.status-select').forEach(select => { select.addEventListener('change', async (e) => { const memberId = e.target.dataset.memberId; const newStatus = e.target.value; const { error } = await supabaseClient.from('group_members').update({ status: newStatus }).eq('id', memberId); if (error) console.error(t('statusUpdateError'), error); }); });
    document.querySelectorAll('.remove-from-group-button').forEach(button => { button.addEventListener('click', async (e) => { const memberId = e.target.dataset.memberId; if (confirm(t('groupRemoveConfirm'))) { const { error } = await supabaseClient.from('group_members').delete().eq('id', memberId); if (error) console.error(t('groupRemoveError'), error); else renderEventDetailView(eventId, eventName); } }); });

    // Listener dla dodawania zaznaczonych
    document.querySelectorAll('.add-selected-to-group-btn').forEach(button => {
        button.addEventListener('click', async (e) => {
            const groupId = e.target.dataset.groupId;
            const selectedPlayers = document.querySelectorAll('#event-available-player-list .event-player-select:checked');
            
            if (selectedPlayers.length === 0) {
                alert(t('noPlayersSelected'));
                return;
            }

            const insertData = Array.from(selectedPlayers).map(checkbox => ({
                group_id: groupId,
                player_id: checkbox.dataset.playerId
            }));

            const { error } = await supabaseClient.from('group_members').insert(insertData);
            if (error) { console.error(t('groupAddPlayerError'), error); alert(t('groupAddPlayerError')); }
            else { renderEventDetailView(eventId, eventName); }
        });
    });
}


// --- ZAKŁADKA "SNAPSHOTY" ---
export async function renderSnapshotsView() { 
    dom.createSnapshotButton.classList.remove('hidden'); 
    dom.eventsListContainer.innerHTML = ''; // Wyczyść Eventy
    dom.kvkContentContainer.innerHTML = ''; // Wyczyść KvK
    const { data, error } = await supabaseClient.from('player_snapshots').select('snapshot_date').order('snapshot_date', { ascending: false }); 
    if (error) { console.error(t('loadingError'), error); dom.snapshotsListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; } 
    const uniqueDates = [...new Set(data.map(item => item.snapshot_date))]; 
    if (uniqueDates.length === 0) { dom.snapshotsListContainer.innerHTML = `<p>${t('noHistory')}</p>`; } 
    else { dom.snapshotsListContainer.innerHTML = uniqueDates.map(date => `<div class="snapshot-item" data-date="${date}">${t('snapshotFromDate')} ${new Date(date).toLocaleDateString(state.currentLang)}</div>`).join(''); } 
}
export async function renderSnapshotDetailView(date) { 
    dom.createSnapshotButton.classList.add('hidden'); 
    const { data: snapshotData, error } = await supabaseClient.from('player_snapshots').select('*').eq('snapshot_date', date).order('player_name', { ascending: true }); 
    if (error) { console.error(t('loadingError'), error); dom.snapshotsListContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; } 
    const formattedDate = new Date(date).toLocaleDateString(state.currentLang); 
    let html = `<div class="event-detail-header"><h2>${t('snapshotDetailTitle', formattedDate)}</h2><button id="back-to-snapshots-list">${t('backToList')}</button></div>`; 
    html += snapshotData.map(player => ` <div class="player-item"> <span class="player-name">${player.player_name}</span> <div class="player-details"> <span>${t('thLabel')}: <strong>${player.th_level || '?'}</strong></span> <span>${t('powerLabel')}: <strong>${player.power_level || '?'}</strong></span> <span>${t('marchesLabel')}: <strong>${player.marches || '?'}</strong></span> </div> </div> `).join(''); 
    dom.snapshotsListContainer.innerHTML = html; 
    document.getElementById('back-to-snapshots-list').addEventListener('click', renderSnapshotsView); 
}

// --- ZAKŁADKA "KVK ROSTER" ---
export async function renderKvkEventsList() {
    dom.createKvkEventForm.classList.remove('hidden');
    dom.eventsListContainer.innerHTML = '';
    const { data, error } = await supabaseClient.from('kvk_events').select('*').order('created_at', { ascending: false });
    if (error) { console.error(t('loadingError'), error); dom.kvkContentContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; }
    
    dom.kvkContentContainer.innerHTML = `
        <h3 data-translate-key="kvkEventListTitle">${t('kvkEventListTitle')}</h3>
        ${data.map(event => `
            <div class="kvk-event-item" data-kvk-event-id="${event.id}" data-kvk-event-name="${event.name}">
                <span>${event.name} ${event.event_date ? `(${new Date(event.event_date).toLocaleDateString(state.currentLang)})` : ''}</span>
                <button class="delete-event-button" data-event-id="${event.id}" data-event-name="${event.name}">${t('delete')}</button>
            </div>
        `).join('') || `<p>${t('noHistory')}</p>`}
    `;
    applyStaticTranslations();
}

export async function renderKvkDetailView(kvkEventId, kvkEventName) {
    dom.createKvkEventForm.classList.add('hidden');
    dom.kvkContentContainer.innerHTML = `<p>${t('syncAnalyzing')}</p>`;

    const { data: participants, error: participantsError } = await supabaseClient
        .from('kvk_participants').select(`id, notes, players ( id, name, th_level, power_level, marches )`)
        .eq('kvk_event_id', kvkEventId);
    const { data: allPlayers, error: allPlayersError } = await supabaseClient.from('players').select('*').eq('is_active', true);
    if (participantsError || allPlayersError) { dom.kvkContentContainer.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; }

    const participantIds = participants.map(p => p.players.id);
    const availablePlayers = allPlayers.filter(p => !participantIds.includes(p.id));

    if (state.kvkSort.column === 'power_level') {
        participants.sort((a, b) => {
            const powerA = parsePower(a.players.power_level); const powerB = parsePower(b.players.power_level);
            if (powerA === 0 && powerB !== 0) return state.kvkSort.direction === 'asc' ? 1 : -1;
            if (powerB === 0 && powerA !== 0) return state.kvkSort.direction === 'asc' ? -1 : 1;
            return state.kvkSort.direction === 'asc' ? powerA - powerB : powerB - powerA;
        });
    } else {
        participants.sort((a, b) => {
            const valA = a.players[state.kvkSort.column] || (state.kvkSort.column === 'name' ? '' : 0);
            const valB = b.players[state.kvkSort.column] || (state.kvkSort.column === 'name' ? '' : 0);
            if (valA < valB) return state.kvkSort.direction === 'asc' ? -1 : 1;
            if (valA > valB) return state.kvkSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    let html = `
        <div class="event-detail-header">
            <h2>${t('manageKvkEventTitle', kvkEventName)}</h2>
            <button id="back-to-kvk-list">${t('backToList')}</button>
        </div>
        
        <h3 data-translate-key="addPlayersToKvk">${t('addPlayersToKvk')}</h3>
        <form id="kvk-add-player-form" data-available-players='${JSON.stringify(availablePlayers)}'>
            <input type="text" name="player-name-input" class="player-search-input" list="kvk-player-list" placeholder="${t('searchPlayerPlaceholder')}" required>
            <button type="submit">${t('addButton')}</button>
        </form>
        
        <datalist id="kvk-player-list">
            ${availablePlayers.map(p => `<option value="${p.name}">${p.name} (P: ${p.power_level || '?'}, TH: ${p.th_level || '?'})</option>`).join('')}
        </datalist>
        
        <hr class="divider">
        <h3 data-translate-key="kvkParticipants">${t('kvkParticipants')} (${participants.length})</h3>
        <div class="sort-controls kvk-sort-controls">
            <span data-translate-key="sortBy">${t('sortBy')}</span>
            <button data-sort="power_level" class="sort-button ${state.kvkSort.column === 'power_level' ? 'active-sort' : ''}" data-translate-key="sortPower">${t('sortPower')}</button>
            <button data-sort="name" class="sort-button ${state.kvkSort.column === 'name' ? 'active-sort' : ''}" data-translate-key="sortName">${t('sortName')}</button>
            <button data-sort="th_level" class="sort-button ${state.kvkSort.column === 'th_level' ? 'active-sort' : ''}" data-translate-key="sortTH">${t('sortTH')}</button>
            <button data-sort="marches" class="sort-button ${state.kvkSort.column === 'marches' ? 'active-sort' : ''}" data-translate-key="sortMarches">${t('sortMarches')}</button>
            <button id="kvk-sort-direction-button" data-direction="${state.kvkSort.direction}">${state.kvkSort.direction === 'asc' ? '🔼' : '🔽'}</button>
        </div>
        
        <div id="kvk-participant-list">
            ${participants.map(p => `
                <div class="kvk-participant-item" 
                     data-name="${p.players.name}" 
                     data-power="${p.players.power_level || '?'}" 
                     data-th="${p.players.th_level || '?'}" 
                     data-marches="${p.players.marches || '?'}">
                    <span class="player-name">${p.players.name}</span>
                    <div class="player-details">
                        <span>${t('powerLabel')}: <strong>${p.players.power_level || '?'}</strong></span>
                        <span>${t('thLabel')}: <strong>${p.players.th_level || '?'}</strong></span>
                        <span>${t('marchesLabel')}: <strong>${p.players.marches || '?'}</strong></span>
                        <input 
                            type="text" 
                            class="kvk-notes-input" 
                            data-participant-id="${p.id}" 
                            value="${p.notes || ''}" 
                            placeholder="${t('kvkNotesPlaceholder')}">
                    </div>
                    <button class="remove-from-kvk-button" data-participant-id="${p.id}" title="${t('kvkRemoveParticipant')}">X</button>
                </div>
            `).join('')}
        </div>
        
        <hr class="divider">
        <button id="generate-kvk-file-btn" class="button-large">${t('generateFileBtn')}</button>
    `;
    
    dom.kvkContentContainer.innerHTML = html;
    attachKvkDetailListeners(kvkEventId, kvkEventName);
}

export function attachKvkDetailListeners(kvkEventId, kvkEventName) {
    document.getElementById('back-to-kvk-list').addEventListener('click', renderKvkEventsList);

    const addForm = document.getElementById('kvk-add-player-form');
    const availablePlayers = JSON.parse(addForm.dataset.availablePlayers || '[]');
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const playerNameInput = e.target.querySelector('input[name="player-name-input"]');
        const playerName = playerNameInput.value;
        const selectedPlayer = availablePlayers.find(p => p.name.toLowerCase() === playerName.toLowerCase());
        
        if (!selectedPlayer) { alert(t('playerNotFound')); return; }
        
        const { error } = await supabaseClient.from('kvk_participants').insert({ kvk_event_id: kvkEventId, player_id: selectedPlayer.id });
        if (error) { alert(t('kvkParticipantAddError')); console.error(error); }
        else { renderKvkDetailView(kvkEventId, kvkEventName); }
    });
    
    document.querySelector('.kvk-sort-controls').addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('sort-button')) {
            const newColumn = target.dataset.sort;
            if (state.kvkSort.column === newColumn) { state.kvkSort.direction = state.kvkSort.direction === 'asc' ? 'desc' : 'asc'; }
            else { state.kvkSort.column = newColumn; }
            renderKvkDetailView(kvkEventId, kvkEventName);
        }
        if (target.id === 'kvk-sort-direction-button') {
            state.kvkSort.direction = state.kvkSort.direction === 'asc' ? 'desc' : 'asc';
            renderKvkDetailView(kvkEventId, kvkEventName);
        }
    });
    
    document.getElementById('generate-kvk-file-btn').addEventListener('click', () => {
        const participants = document.querySelectorAll('#kvk-participant-list .kvk-participant-item');
        if (participants.length === 0) { alert(t('noPlayersSelected')); return; }
        let fileContent = `${t('generatedFileHeader', kvkEventName)} (${participants.length})\n===================================\n\n`;
        participants.forEach((item, index) => {
            const name = item.dataset.name;
            const power = item.dataset.power;
            const th = item.dataset.th;
            const marches = item.dataset.marches;
            const notes = item.querySelector('.kvk-notes-input').value.trim();
            fileContent += `${index + 1}. ${name}\n`;
            fileContent += `   ${t('powerLabel')}: ${power}, ${t('thLabel')}: ${th}, ${t('marchesLabel')}: ${marches}\n`;
            if (notes) { fileContent += `   ${t('notesLabel')}: ${notes}\n`; }
            fileContent += `\n`;
        });
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(fileContent));
        element.setAttribute('download', `kvk_roster_${kvkEventName.replace(/ /g, '_')}.txt`);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    });

    const participantList = document.getElementById('kvk-participant-list');
    participantList.addEventListener('click', async (e) => {
        if (e.target.classList.contains('remove-from-kvk-button')) {
            const participantId = e.target.dataset.participantId;
            if (confirm(t('kvkRemoveParticipantConfirm'))) {
                const { error } = await supabaseClient.from('kvk_participants').delete().eq('id', participantId);
                if (error) { alert(t('kvkParticipantRemoveError')); }
                else { renderKvkDetailView(kvkEventId, kvkEventName); }
            }
        }
    });
    participantList.addEventListener('change', async (e) => {
        if (e.target.classList.contains('kvk-notes-input')) {
            const participantId = e.target.dataset.participantId;
            const newNotes = e.target.value;
            const { error } = await supabaseClient.from('kvk_participants').update({ notes: newNotes }).eq('id', participantId);
            if (error) { alert(t('kvkNotesUpdateError')); }
            else { console.log('Zapisano notatki.'); e.target.style.borderColor = "#28a745"; setTimeout(() => e.target.style.borderColor = "#4f545c", 1000); }
        }
    });
}

// --- STATYSTYKI ---
export async function renderStatistics() {
    const { data: players, error } = await supabaseClient.from('players').select('th_level, power_level').eq('is_active', true);
    if (error) { dom.statsContent.innerHTML = `<p class="error">${t('loadingError')}</p>`; return; }
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
    dom.statsContent.innerHTML = statsHtml;
}