// state.js
export let currentLang = localStorage.getItem('kingshotLang') || 'pl';
export let currentTabId = 'members-view';
export let eventDetailFilters = { marches: '', name: '', power: '' };
export let memberFilters = { name: '', power: '' };
export let memberSort = { column: 'name', direction: 'asc' };
export let lastSyncAnalysis = null;

// NOWA ZMIENNA STANU DLA SORTOWANIA EVENTÓW
export let eventDetailSort = { column: 'power_level', direction: 'desc' };
// USUNIĘTA ZMIENNA KVK
// export let kvkSort = { column: 'power_level', direction: 'desc' };

// Funkcje do modyfikacji stanu
export function setLang(lang) { currentLang = lang; }
export function setTabId(tabId) { currentTabId = tabId; }
export function setEventDetailFilters(filters) { eventDetailFilters = filters; }
export function setMemberFilters(filters) { memberFilters = filters; }
export function setMemberSort(sort) { memberSort = sort; }
export function setLastSyncAnalysis(analysis) { lastSyncAnalysis = analysis; }

// BRAKUJĄCA FUNKCJA - DODANA TERAZ
export function setEventDetailSort(sort) { eventDetailSort = sort; }
// USUNIĘTA FUNKCJA KVK
// export function setKvkSort(sort) { kvkSort = sort; }