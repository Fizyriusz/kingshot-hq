// dom.js
export const authView = document.getElementById('auth-view');
export const appView = document.getElementById('app-view');
export const logoutButton = document.getElementById('logout-button');
export const loginForm = document.getElementById('login-form');
export const errorMessage = document.getElementById('error-message');
export const tabs = document.querySelectorAll('#tab-nav button');
export const tabPanes = document.querySelectorAll('.tab-pane');
export const addPlayerForm = document.getElementById('add-player-form');
export const playerNameInput = document.getElementById('player-name-input');
export const playersListContainer = document.getElementById('players-list-container');
export const addEventForm = document.getElementById('add-event-form');
export const eventNameInput = document.getElementById('event-name-input');
export const eventsListContainer = document.getElementById('events-list-container');
export const playerThInput = document.getElementById('player-th-input');
export const playerMarchesInput = document.getElementById('player-marches-input');
export const playerPowerInput = document.getElementById('player-power-input');
export const showInactiveToggle = document.getElementById('show-inactive-toggle');
export const membersListHeader = document.getElementById('members-list-header');
export const emailInput = document.getElementById('email');
export const passwordInput = document.getElementById('password');
export const createSnapshotButton = document.getElementById('create-snapshot-button');
export const snapshotsListContainer = document.getElementById('snapshots-list-container');
export const memberFilterNameInput = document.getElementById('member-filter-name');
export const memberFilterPowerInput = document.getElementById('member-filter-power');
export const statsContent = document.getElementById('stats-content');
export const memberSortControlsContainer = document.querySelector('#members-view .sort-controls');
export const sortDirectionButton = document.getElementById('sort-direction-button');
export const syncPlayersForm = document.getElementById('sync-players-form');
export const syncPlayersInput = document.getElementById('sync-players-input');
export const syncResultsContainer = document.getElementById('sync-results-container');

// Usunięto elementy KvK

export const memberControls = [
    document.querySelector('.member-filters'),
    document.querySelector('.view-toggle-container'),
    memberSortControlsContainer,
    membersListHeader
];