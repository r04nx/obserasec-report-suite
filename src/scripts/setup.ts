
import { JSDOM } from 'jsdom';

// Polyfill for standard browser features
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
});

// Helper to safely set global properties
const setGlobal = (prop: string, value: any) => {
    try {
        (global as any)[prop] = value;
    } catch (e) {
        try {
            Object.defineProperty(global, prop, {
                value: value,
                writable: true,
                configurable: true
            });
        } catch (e2) {
            console.warn(`Failed to mock global property: ${prop}`);
        }
    }
};

setGlobal('window', dom.window);
setGlobal('document', dom.window.document);
setGlobal('navigator', dom.window.navigator);

// Patch global object to include window properties
Object.getOwnPropertyNames(dom.window).forEach((property) => {
    if (typeof (global as any)[property] === 'undefined') {
        setGlobal(property, (dom.window as any)[property]);
    }
});

// Mock matchMedia
global.window.matchMedia = global.window.matchMedia || function () {
    return {
        matches: false,
        addListener: function () { },
        removeListener: function () { },
        addEventListener: function () { },
        removeEventListener: function () { },
        onchange: null,
    };
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

// Mock requestAnimationFrame
(global as any).requestAnimationFrame = (callback: any) => setTimeout(callback, 0);
(global as any).cancelAnimationFrame = (id: any) => clearTimeout(id);
