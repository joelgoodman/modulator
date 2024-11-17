// Import styles
import '@modulator/ui/styles/index.css';

// Theme management
export { getTheme, setTheme } from './theme.js';

export function initializeTheme(): void {
  const theme = getTheme();
  setTheme(theme);
}

// Export components
export * from './adapters/index.js';
export * from './components/toolbar/index.js';
export * from './components/icons/index.js';

// Re-export types from @modulator/types
export type {
  // Core types
  BlockData,
  BlockType,
  BlockConfig,
  BlockValidationResult,
  BlockRegistryContext,

  // Toolbar types
  ToolbarItem,
  ToolbarGroup,
  ToolbarConfig,
  ToolbarState,
  ToolbarContext,
  ToolbarPluginContext,
  ToolbarRegistryContext,
  ToolbarButtonContext,
  ToolbarButtonProps,
  ToolbarButtonState,

  // Component interfaces
  BlockRegistryAdapter,
  BlockToolbar,
  TextFormatToolbar,
  ToolbarButton,
  ToolbarRegistry,
} from '@modulator/types';
