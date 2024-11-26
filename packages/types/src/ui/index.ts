/**
 * UI Types Module
 * @module UITypes
 * @description Centralized exports for all UI-related type definitions
 * @remarks
 * This module provides comprehensive type definitions for various UI components,
 * configurations, and interactions within the Modulator system.
 * 
 * @category UI
 * @packageDocumentation
 */

// Export accessibility types
/**
 * Accessibility-related type exports
 * @description Types for managing UI accessibility, internationalization, and user experience
 */
export type {
  AccessibilityLevel,
  LocaleConfig,
  AccessibilityConfig,
  Translator,
  AccessibilityContext,
} from './accessibility.js';

// Export configuration types
/**
 * UI and system configuration type exports
 * @description Types for configuring block types, security settings, and core system parameters
 */
export type { 
  BlockTypeConfig, 
  SecurityConfig, 
  ModulatorConfig 
} from './config.js';

// Export theme types
/**
 * Theming and styling type exports
 * @description Types for managing UI themes, color schemes, and visual customization
 */
export type { 
  Theme, 
  BuiltInTheme, 
  ThemeConfig, 
  ThemeOverrides, 
  ThemeRegistry 
} from './themes.js';

// Export toolbar types
/**
 * Toolbar-related type exports
 * @description Types for defining, configuring, and interacting with UI toolbars
 */
export type {
  ToolbarItem,
  ToolbarGroup,
  ToolbarState,
  ToolbarContext,
  ToolbarPosition,
  ToolbarConfig,
  ToolbarOptions,
  ToolbarEvent,
} from './toolbar.js';

/**
 * Toolbar event type enumeration
 * @description Defines the types of events that can occur in the toolbar
 */
export { ToolbarEventType } from './toolbar.js';
