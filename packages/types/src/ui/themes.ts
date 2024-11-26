/**
 * Theming and Styling Types Module
 * @module UIThemes
 * @description Provides comprehensive types for managing UI themes, color schemes, and styling
 * @remarks
 * This module defines interfaces and types for creating, registering, and managing
 * themes with flexible CSS variable overrides and extensibility
 * 
 * @category UI
 * @packageDocumentation
 */

/**
 * Built-in Theme Options
 * @type {string}
 * @description Predefined theme options available by default
 */
export type BuiltInTheme = 'light' | 'dark';

/**
 * CSS Variable Overrides Interface
 * @interface
 * @description Allows fine-grained customization of theme styling using CSS variables
 * @remarks
 * Provides a type-safe way to override CSS variables for custom theming
 * 
 * @example
 * ```typescript
 * const customOverrides: ThemeOverrides = {
 *   '--primary-color': '#007bff',
 *   '--background-color': '#f4f4f4'
 * };
 * ```
 */
export interface ThemeOverrides {
  /**
   * CSS variable key-value pairs
   * @type {string}
   * @description Allows overriding CSS variables with custom values
   * @remarks Ensures only valid CSS variable names are used
   */
  [key: `--${string}`]: string;
}

/**
 * Theme Configuration Interface
 * @interface
 * @description Defines the structure and properties of a theme
 */
export interface ThemeConfig {
  /**
   * Unique theme identifier
   * @type {string}
   * @description A unique string to identify the theme
   * @example 'custom-dark', 'solarized-light'
   */
  id: string;

  /**
   * Human-readable theme name
   * @type {string}
   * @description A user-friendly name for the theme
   * @example 'Dark Mode', 'Solarized Light'
   */
  name: string;

  /**
   * CSS variable overrides for the theme
   * @type {ThemeOverrides}
   * @description Defines custom styling for the theme
   */
  variables: ThemeOverrides;

  /**
   * Parent theme to extend
   * @type {string}
   * @description Optional reference to another theme's ID to inherit its properties
   * @example 'light' // Extends the built-in light theme
   */
  extends?: string;

  /**
   * Optional metadata for the theme
   * @type {object}
   * @description Additional information about the theme
   */
  metadata?: {
    /**
     * Theme author
     * @type {string}
     */
    author?: string;

    /**
     * Theme version
     * @type {string}
     */
    version?: string;

    /**
     * Theme description
     * @type {string}
     */
    description?: string;
  };
}

/**
 * Theme Registry Interface
 * @interface
 * @description Provides methods for managing and retrieving themes
 */
export interface ThemeRegistry {
  /**
   * Register a new theme
   * @method
   * @param {ThemeConfig} theme - Theme configuration to register
   * @throws {Error} If a theme with the same ID already exists
   * 
   * @example
   * ```typescript
   * themeRegistry.register({
   *   id: 'custom-dark',
   *   name: 'Custom Dark Theme',
   *   variables: { '--primary-color': '#00ff00' }
   * });
   * ```
   */
  register(theme: ThemeConfig): void;

  /**
   * Retrieve a theme by its ID
   * @method
   * @param {string} id - Theme identifier
   * @returns {ThemeConfig | undefined} The theme configuration or undefined
   * 
   * @example
   * ```typescript
   * const theme = themeRegistry.getTheme('custom-dark');
   * ```
   */
  getTheme(id: string): ThemeConfig | undefined;

  /**
   * Get all registered themes
   * @method
   * @returns {ThemeConfig[]} List of all registered themes
   */
  getThemes(): ThemeConfig[];

  /**
   * Check if a theme exists in the registry
   * @method
   * @param {string} id - Theme identifier
   * @returns {boolean} Whether the theme is registered
   */
  hasTheme(id: string): boolean;

  /**
   * Unregister a theme
   * @method
   * @param {string} id - Theme identifier to remove
   * @returns {boolean} Whether the theme was successfully unregistered
   */
  unregister?(id: string): boolean;
}

/**
 * Theme Type
 * @type {string}
 * @description Represents available theme options, including built-in and custom themes
 */
export type Theme = BuiltInTheme | string;

/**
 * Default Built-in Themes
 * @type {ThemeConfig[]}
 * @description Provides default light and dark theme configurations
 */
export const DEFAULT_THEMES: ThemeConfig[] = [
  {
    id: 'light',
    name: 'Light Mode',
    variables: {
      '--primary-color': '#007bff',
      '--background-color': '#ffffff',
      '--text-color': '#000000'
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    variables: {
      '--primary-color': '#0d6efd',
      '--background-color': '#121212',
      '--text-color': '#ffffff'
    }
  }
];
