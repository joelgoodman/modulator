/**
 * WCAG Accessibility Compliance Levels
 */
export enum AccessibilityLevel {
  /**
   * Lowest level of accessibility compliance
   */
  A = 'A',

  /**
   * Intermediate level of accessibility compliance
   */
  AA = 'AA',

  /**
   * Highest level of accessibility compliance
   */
  AAA = 'AAA',
}

/**
 * Locale configuration
 */
export interface LocaleConfig {
  /**
   * Language code (e.g., 'en-US')
   */
  language: string;

  /**
   * Text direction
   */
  direction?: 'ltr' | 'rtl';

  /**
   * Translation key-value pairs
   */
  translations: Record<string, string>;

  /**
   * Locale-specific formatting
   */
  formatting?: {
    dateFormat?: string;
    timeFormat?: string;
    numberFormat?: string;
  };
}

/**
 * Accessibility configuration
 */
export interface AccessibilityConfig {
  /**
   * WCAG compliance level
   */
  level: AccessibilityLevel;

  /**
   * Enable keyboard navigation
   */
  keyboardNavigation: boolean;

  /**
   * Enable screen reader support
   */
  screenReader: boolean;

  /**
   * Enable high contrast mode
   */
  highContrast: boolean;

  /**
   * Current locale
   */
  locale: string;

  /**
   * Enable text resizing
   */
  textResize: boolean;

  /**
   * Enable focus indicators
   */
  focusIndicators: boolean;
}

/**
 * Translation interface
 */
export interface Translator {
  /**
   * Translate a key
   */
  translate(key: string, params?: Record<string, string>): string;

  /**
   * Set current locale
   */
  setLocale(locale: string): void;

  /**
   * Add translations
   */
  addTranslations(locale: string, translations: Record<string, string>): void;
}

/**
 * Accessibility context
 */
export interface AccessibilityContext {
  /**
   * Current configuration
   */
  config: AccessibilityConfig;

  /**
   * Translation function
   */
  translate(key: string, params?: Record<string, string>): string;

  /**
   * Current locale
   */
  locale: LocaleConfig;

  /**
   * Update configuration
   */
  updateConfig(config: Partial<AccessibilityConfig>): void;

  /**
   * Set current locale
   */
  setLocale(locale: string): void;
}
