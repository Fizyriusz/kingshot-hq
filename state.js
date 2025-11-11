// state.js
export let currentLang = localStorage.getItem('kingshotLang') || 'pl';

// Przechowuje aktualny widok (zakładkę ORAZ parametry, np. ID eventu)
export let currentView = JSON.parse(localStorage.getItem('kingshotCurrentView')) || { tabId: 'members-view', params: {} };

export let eventDetailFilters = { marches: '', name: '', power: '' };
export let memberFilters = { name: '', power: '' };
export let memberSort = { column: 'name', direction: 'asc' };
export let lastSyncAnalysis = null;
export let eventDetailSort = { column: 'power_level', direction: 'desc' };
export let lastSnapshotAnalysis = null; // NOWA ZMIENNA

// --- Funkcje modyfikujące stan ---
export function setLang(lang) { currentLang = lang; }

export function setView(tabId, params = {}) {
    currentView = { tabId, params };
    // Zapisuj w localStorage tylko główny widok zakładki, aby odświeżenie wracało do listy
    if (Object.keys(params).length === 0) {
        localStorage.setItem('kingshotCurrentView', JSON.stringify(currentView));
    }
}

export function setEventDetailFilters(filters) { eventDetailFilters = filters; }
export function setMemberFilters(filters) { memberFilters = filters; }
export function setMemberSort(sort) { memberSort = sort; }
export function setLastSyncAnalysis(analysis) { lastSyncAnalysis = analysis; }
export function setEventDetailSort(sort) { eventDetailSort = sort; }
export function setLastSnapshotAnalysis(analysis) { lastSnapshotAnalysis = analysis; } // NOWA FUNKCJA