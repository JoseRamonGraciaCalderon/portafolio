import { getCollection } from 'astro:content';

// Importar los archivos de traducción
import es from './es.json';
import en from './en.json';

// Definir los idiomas disponibles
export const languages = {
  es: 'Español',
  en: 'English'
};

// Definir el idioma por defecto
export const defaultLang = 'es';

// Crear un mapa de traducciones
export const translations = {
  es,
  en
};

// Función para obtener la URL con el idioma
export function getLocalizedPathname(pathname: string, lang: string) {
  // Primero, normalizar la ruta eliminando cualquier prefijo de idioma existente
  let cleanPath = pathname;
  const segments = pathname.split('/').filter(Boolean);

  // Comprobar si la URL ya tiene un prefijo de idioma
  const hasLangPrefix = segments.length > 0 && Object.keys(languages).includes(segments[0]);

  // Si tiene un prefijo de idioma, quitarlo para obtener la ruta limpia
  if (hasLangPrefix) {
    cleanPath = '/' + segments.slice(1).join('/');
  }

  // Si la ruta limpia está vacía, usar la página de inicio
  if (cleanPath === '' || cleanPath === '/') {
    cleanPath = '/';
  }

  // Si es el idioma por defecto, usar la ruta con prefijo explícito
  if (lang === defaultLang) {
    return `/${lang}${cleanPath}`;
  }

  // Para otros idiomas, añadir el prefijo
  return `/${lang}${cleanPath}`;
}

// Función para obtener el idioma de la URL
export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang && Object.keys(languages).includes(lang)) {
    return lang;
  }
  return defaultLang;
}

// Función para obtener las traducciones
export function useTranslations(lang: string) {
  return function t(key: string) {
    // Dividir la clave por puntos para acceder a objetos anidados
    const keys = key.split('.');
    let value = translations[lang];

    // Recorrer el objeto de traducciones
    for (const k of keys) {
      if (value && k in value) {
        value = value[k];
      } else {
        // Si no se encuentra la clave, devolver la clave original
        console.warn(`Missing translation: ${key} for language: ${lang}`);
        return key;
      }
    }

    return value;
  };
}

// Función para obtener la URL sin el prefijo de idioma
export function removeLanguageFromPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const hasLangPrefix = Object.keys(languages).includes(segments[0]);

  if (hasLangPrefix) {
    return '/' + segments.slice(1).join('/');
  }

  return pathname;
}
