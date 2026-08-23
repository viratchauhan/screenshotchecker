import en from './en.json';
import hi from './hi.json';
import es from './es.json';
import fr from './fr.json';
import de from './de.json';
import ja from './ja.json';

export type SupportedLanguage = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ja';

export const DICTIONARIES: Record<SupportedLanguage, Record<string, string>> = {
  en,
  hi,
  es,
  fr,
  de,
  ja,
};

export const LANGUAGE_LABELS: Record<SupportedLanguage, { name: string; short: string }> = {
  en: { name: 'English', short: 'EN' },
  hi: { name: 'हिन्दी', short: 'HI' },
  es: { name: 'Español', short: 'ES' },
  fr: { name: 'Français', short: 'FR' },
  de: { name: 'Deutsch', short: 'DE' },
  ja: { name: '日本語', short: 'JA' },
};

export function getStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'en';
  const saved = localStorage.getItem('sc_lang') as SupportedLanguage;
  if (saved && DICTIONARIES[saved]) return saved;
  return 'en';
}

export function t(key: string, lang?: SupportedLanguage): string {
  const activeLang = lang || getStoredLanguage();
  const dict = DICTIONARIES[activeLang] || DICTIONARIES['en'];
  if (dict[key]) return dict[key];
  if (DICTIONARIES['en'][key]) return DICTIONARIES['en'][key];
  return key;
}

export function setAppLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  if (!DICTIONARIES[lang]) lang = 'en';
  
  localStorage.setItem('sc_lang', lang);
  document.documentElement.lang = lang;

  // Update Language dropdown badge
  const currentLabel = document.getElementById('current-lang-label');
  if (currentLabel) {
    currentLabel.innerText = LANGUAGE_LABELS[lang]?.short || 'EN';
  }

  // Translate all marked DOM elements
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translated = t(key, lang);
      if (translated) {
        // If element contains an icon or SVG child, preserve it or update text node
        const svg = el.querySelector('svg');
        if (svg) {
          const span = el.querySelector('span');
          if (span) {
            span.innerText = translated;
          } else {
            el.innerHTML = '';
            el.appendChild(svg);
            const textNode = document.createTextNode(` ${translated}`);
            el.appendChild(textNode);
          }
        } else {
          (el as HTMLElement).innerText = translated;
        }
      }
    }
  });

  // Translate placeholders
  const placeholderEls = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderEls.forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      (el as HTMLInputElement).placeholder = t(key, lang);
    }
  });

  // Translate titles/aria-labels
  const titleEls = document.querySelectorAll('[data-i18n-title]');
  titleEls.forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      el.setAttribute('title', t(key, lang));
    }
  });

  // Dispatch event for specialized components
  window.dispatchEvent(new CustomEvent('sc:languageChanged', { detail: { lang } }));
}

export function initI18n(): void {
  if (typeof window === 'undefined') return;
  const lang = getStoredLanguage();
  setAppLanguage(lang);
}
