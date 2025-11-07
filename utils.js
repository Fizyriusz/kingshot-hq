// utils.js
import { translations } from './translations.js';
import { currentLang } from './state.js';

// Funkcja tłumaczeń
export function t(key, args = null) {
    const langSet = translations[currentLang] || translations['en'];
    const string = langSet[key] || translations['en'][key] || key;
    if (typeof string === 'function') { return string(args); }
    return string;
}

// Funkcja parsowania mocy
export function parsePower(powerString) {
    if (!powerString) return 0;
    const cleanedString = powerString.toLowerCase().replace(/,/g, '.').trim();
    let multiplier = 1;
    if (cleanedString.endsWith('m')) { multiplier = 1000000; }
    else if (cleanedString.endsWith('b')) { multiplier = 1000000000; }
    const numberPart = parseFloat(cleanedString);
    if (isNaN(numberPart)) return 0;
    return numberPart * multiplier;
}

// Funkcja debounce
export function debounce(func, delay) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
}