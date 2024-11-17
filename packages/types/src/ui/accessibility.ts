/**
 * WCAG Accessibility Compliance Levels
 * @see https://www.w3.org/WAI/WCAG21/quickref/
 */
export enum AccessibilityLevel {
  /**
   * WCAG Level A - Minimal accessibility requirements
   */
  A = 'A',

  /**
   * WCAG Level AA - Enhanced accessibility requirements
   * Common target for most applications
   */
  AA = 'AA',

  /**
   * WCAG Level AAA - Maximum accessibility requirements
   * Highest level of accessibility support
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
   * Translation key-value pairs
   */
  translations: Record<string, string>;

  /**
   * Text direction
   */
  direction?: 'ltr' | 'rtl';

  /**
   * Locale-specific formatting options
   */
  formatting?: {
    /**
     * Date format
     */
    dateFormat?: string;

    /**
     * Time format
     */
    timeFormat?: string;

    /**
     * Number format
     */
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
   * Required for WCAG 2.1 Level A (2.1.1)
   */
  keyboardNavigation: boolean;

  /**
   * Enable screen reader support
   * Required for WCAG 2.1 Level A (1.3.1)
   */
  screenReader: boolean;

  /**
   * Enable high contrast mode
   * Required for WCAG 2.1 Level AAA (1.4.6)
   */
  highContrast: boolean;

  /**
   * Current locale
   * Required for WCAG 2.1 Level A (3.1.1)
   */
  locale: string;

  /**
   * Text resize support
   * Required for WCAG 2.1 Level AA (1.4.4)
   */
  textResize: boolean;

  /**
   * Focus indicators
   * Required for WCAG 2.1 Level AA (2.4.7)
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
   * Add translations for a locale
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
  translate: (key: string, params?: Record<string, string>) => string;

  /**
   * Current locale
   */
  locale: LocaleConfig;

  /**
   * Update configuration
   */
  updateConfig: (config: Partial<AccessibilityConfig>) => void;

  /**
   * Change locale
   */
  setLocale: (locale: string) => void;
}
