/**
 * Built-in theme options
 */
export type BuiltInTheme = 'light' | 'dark';

/**
 * CSS variable overrides for a theme
 */
export interface ThemeOverrides {
  [key: `--${string}`]: string;
}

/**
 * Theme configuration
 */
export interface ThemeConfig {
  /** Unique theme identifier */
  id: string;
  /** Display name for the theme */
  name: string;
  /** CSS variable overrides */
  variables: ThemeOverrides;
  /** Parent theme to extend (optional) */
  extends?: string;
}

/**
 * Theme registry for managing available themes
 */
export interface ThemeRegistry {
  /** Register a new theme */
  register(theme: ThemeConfig): void;
  /** Get a theme by ID */
  getTheme(id: string): ThemeConfig | undefined;
  /** Get all registered themes */
  getThemes(): ThemeConfig[];
  /** Check if a theme exists */
  hasTheme(id: string): boolean;
}

/**
 * Available theme options (built-in + custom)
 */
export type Theme = BuiltInTheme | string;
