import { vi, beforeEach, afterEach } from 'vitest';

// Mock DOM environment
global.document = {
  createElement: vi.fn((tag: string) => ({
    setAttribute: vi.fn(),
    style: {},
    className: '',
    textContent: '',
    remove: vi.fn(),
    getAttribute: vi.fn(),
  })),
} as any;

// Mock timers
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.clearAllMocks();
});

// Mock storage
const mockStorage = {
  length: 0,
  key: vi.fn(),
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

global.localStorage = mockStorage;
global.sessionStorage = mockStorage;

// Mock window
global.window = {
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
} as any;

// Mock console methods to reduce noise in tests
console.debug = vi.fn();
console.info = vi.fn();
console.warn = vi.fn();
