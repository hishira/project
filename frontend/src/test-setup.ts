import { getTestBed } from '@angular/core/testing';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import '@testing-library/jest-dom/vitest';
import 'zone.js';
import 'zone.js/testing';

// Explicitly extend expect with jest-dom matchers
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Debug log to verify setup is running
console.log('Test setup loaded, globals available:', typeof describe, typeof test, typeof expect);

getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting()
);
