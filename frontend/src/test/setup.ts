import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock clipboard
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: vi.fn(),
    },
    configurable: true,
});

// Mock ApexCharts (if used in future)
vi.mock('react-apexcharts', () => ({
    default: () => null,
}));
