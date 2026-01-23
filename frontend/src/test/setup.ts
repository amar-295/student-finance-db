import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi, beforeAll, afterAll } from 'vitest';
import { server } from './mocks/server';

// MSW Lifecycle
beforeAll(() => {
    server.listen({
        onUnhandledRequest: (req) => {
            console.warn('UNHANDLED REQUEST:', req.method, req.url);
        }
    });
});
afterEach(() => {
    cleanup();
    server.resetHandlers();
    localStorage.clear();
});
afterAll(() => server.close());

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    disconnect() { }
    observe() { }
    takeRecords() {
        return [];
    }
    unobserve() { }
} as any;

// Functional localStorage mock
const stores: Record<string, string> = {};
globalThis.localStorage = {
    getItem: (key: string) => stores[key] || null,
    setItem: (key: string, value: string) => { stores[key] = value; },
    removeItem: (key: string) => { delete stores[key]; },
    clear: () => {
        Object.keys(stores).forEach(key => delete stores[key]);
    },
    length: 0,
    key: (index: number) => Object.keys(stores)[index] || null,
} as any;

// Mock scrollTo
window.scrollTo = vi.fn();
