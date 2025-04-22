// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Configuración para i18n
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true
    },
    fallback: {
      en: 'es'
    }
  },
  // Otras configuraciones
  build: {
    format: 'file'
  },
  server: {
    port: 4321,
    host: true
  }
});
