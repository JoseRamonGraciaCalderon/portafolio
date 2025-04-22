// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

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
    port: process.env.PORT || 4321,
    host: true
  },
  output: 'server',
  adapter: node({
    mode: 'standalone'
  })
});
