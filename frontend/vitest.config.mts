import { defineConfig } from 'vitest/config';
//import angular from '@analogjs/vite-plugin-angular';
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['src/**/*.spec.ts'],
    deps: {
      inline: ['@angular/core', '@angular/common'] // możesz potrzebować inline dla Angular
    }
  }
});