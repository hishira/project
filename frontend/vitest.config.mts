/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(({ mode }) => ({
  plugins: [
    angular(), // Niezbędny do kompilacji komponentów Angular
    nxViteTsPaths() // Obsługuje aliasy ścieżek zdefiniowane w Nx
  ],
  test: {
    globals: true, // Pozwala używać 'describe', 'it' bez importowania
    environment: 'jsdom', // Emuluje przeglądarkę w Node.js
    setupFiles: ['src/test-setup.ts'], // Plik inicjalizujący Angular TestBed
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
  },
}));