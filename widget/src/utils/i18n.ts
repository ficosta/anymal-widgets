/**
 * Internationalization utilities
 */

import type { Translations } from '../types/index.js';
import ptbrTranslations from '../i18n/ptbr.json';

const translations: { [key: string]: Translations } = {
  ptbr: ptbrTranslations as Translations,
  pt: ptbrTranslations as Translations,
};

let currentLang = 'en';
let customTranslations: Translations = {};

export function setLanguage(lang: string): void {
  currentLang = lang.toLowerCase().slice(0, 2);
}

export function setCustomTranslations(trans: Translations): void {
  customTranslations = trans;
}

export function t(key: string, fallback: string = key): string {
  // Check custom translations first
  if (customTranslations[key]) {
    const value = customTranslations[key];
    return typeof value === 'string' ? value : fallback;
  }

  // Check language-specific translations
  const langTrans = translations[currentLang];
  if (langTrans && langTrans[key]) {
    const value = langTrans[key];
    return typeof value === 'string' ? value : fallback;
  }

  // Return fallback
  return fallback;
}

export function getNestedTranslation(path: string, fallback: string = path): string {
  const keys = path.split('.');
  let current: any = customTranslations;

  // Try custom translations first
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      current = null;
      break;
    }
  }

  if (current && typeof current === 'string') {
    return current;
  }

  // Try language-specific translations
  current = translations[currentLang];
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return fallback;
    }
  }

  return typeof current === 'string' ? current : fallback;
}

/**
 * Translate a key with widget context (for sport-specific translations)
 */
export function translate(key: string, widget: any): string {
  if (!widget) return key;

  const sport = widget.sport || '';
  const widgetCustomTrans = widget.customTranslations || {};
  const lang = widget.lang || currentLang;

  // Try sport-specific key first: "key_sport"
  const sportKey = sport ? `${key}_${sport}` : null;

  // Priority: custom translations > language translations > fallback
  const getValue = (obj: any, k: string): string | null => {
    const keys = k.split('.');
    let current = obj;

    for (const part of keys) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  };

  // Check custom translations (sport-specific then generic)
  if (sportKey) {
    const val = getValue(widgetCustomTrans, sportKey);
    if (val) return val;
  }
  const customVal = getValue(widgetCustomTrans, key);
  if (customVal) return customVal;

  // Check language translations (sport-specific then generic)
  const langTrans = translations[lang];
  if (langTrans) {
    if (sportKey) {
      const val = getValue(langTrans, sportKey);
      if (val) return val;
    }
    const langVal = getValue(langTrans, key);
    if (langVal) return langVal;
  }

  return key;
}

/**
 * Translate country name
 */
export function translateCountry(country: string, widget: any): string {
  if (!country || !widget) return country;

  const countryKey = `countries.${country}`;
  const translated = translate(countryKey, widget);

  return translated !== countryKey ? translated : country;
}
