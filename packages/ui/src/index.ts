// Import styles
import '@modulator/ui/styles/index.css';

// Theme management
import { getTheme, setTheme, toggleTheme, registry } from './themes/index.js';
export type { Theme, ThemeConfig, ThemeOverrides, ThemeRegistry } from '@modulator/types';
export { getTheme, setTheme, toggleTheme, registry as themeRegistry };

export function initializeTheme(): void {
  const theme = getTheme();
  setTheme(theme);
}

// Export components
export * from './adapters/index.js';
export { BlockToolbar } from './components/toolbar/BlockToolbar.js';
export { TextFormatToolbar, ToolbarButton, ToolbarRegistry } from './components/toolbar/index.js';
export * from './components/icons/index.js';
