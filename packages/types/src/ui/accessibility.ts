/**
 * @fileoverview Accessibility and Internationalization Types for Modulator UI
 * @module @modulator/types/ui/accessibility
 * @description
 * Defines comprehensive types and interfaces for managing UI accessibility,
 * localization, and internationalization in the Modulator system.
 * 
 * @remarks
 * This module is built around WCAG guidelines and best practices, supporting:
 * - Multiple levels of accessibility compliance (A, AA, AAA)
 * - Internationalization and localization
 * - Screen reader compatibility
 * - Keyboard navigation
 * - High contrast modes
 * - Dynamic text resizing
 * - Focus management
 */

/**
 * WCAG Accessibility Compliance Levels
 * @remarks
 * Defines the standardized levels of Web Content Accessibility Guidelines (WCAG)
 * compliance. Each level builds upon the previous, providing increasingly
 * comprehensive accessibility support.
 * 
 * @see {@link https://www.w3.org/WAI/WCAG21/quickref/ WCAG Quick Reference}
 * 
 * @example
 * ```typescript
 * const config: AccessibilityConfig = {
 *   level: AccessibilityLevel.AA,  // Most common compliance target
 *   // ... other settings
 * };
 * ```
 */
export enum AccessibilityLevel {
  /**
   * Level A: Essential accessibility features
   * @remarks
   * Provides basic accessibility support including:
   * - Text alternatives for images
   * - Captions for videos
   * - Basic keyboard navigation
   */
  A = 'A',

  /**
   * Level AA: Enhanced accessibility features
   * @remarks
   * Builds on Level A, adding:
   * - Color contrast requirements
   * - Consistent navigation
   * - Error identification
   * - Resizable text
   */
  AA = 'AA',

  /**
   * Level AAA: Comprehensive accessibility features
   * @remarks
   * Highest level of accessibility, adding:
   * - Sign language support
   * - Extended audio descriptions
   * - Complex keyboard navigation
   * - Context-sensitive help
   */
  AAA = 'AAA',
}

/**
 * Locale Configuration
 * @remarks
 * Defines comprehensive localization settings for internationalization,
 * following BCP 47 language tag standards and supporting various
 * formatting preferences.
 * 
 * @example
 * ```typescript
 * const locale: LocaleConfig = {
 *   language: 'en-US',
 *   direction: 'ltr',
 *   translations: {
 *     hello: 'Hello',
 *     goodbye: 'Goodbye'
 *   },
 *   dateTimeFormat: {
 *     dateFormat: 'MM/DD/YYYY',
 *     timeFormat: 'HH:mm:ss',
 *     timeZone: 'America/New_York',
 *     hourCycle: '12'
 *   },
 *   numberFormat: {
 *     decimal: '.',
 *     thousands: ',',
 *     currency: 'USD',
 *     currencyPosition: 'prefix'
 *   },
 * };
 * ```
 */
export interface LocaleConfig {
  /** BCP 47 language tag (e.g., 'en-US', 'fr-FR') */
  language: string;

  /** Text direction for the locale */
  direction: 'ltr' | 'rtl';

  /** Translation strings for the locale */
  translations?: Record<string, string>;

  /** Date and time formatting preferences */
  dateTimeFormat: {
    /** Date format string */
    dateFormat: string;
    /** Time format string */
    timeFormat: string;
    /** Time zone identifier */
    timeZone?: string;
    /** Hour cycle (12 or 24) */
    hourCycle?: '12' | '24';
  };

  /** Number formatting preferences */
  numberFormat: {
    /** Decimal separator */
    decimal: string;
    /** Thousands separator */
    thousands: string;
    /** Currency code (ISO 4217) */
    currency?: string;
    /** Currency symbol position */
    currencyPosition?: 'prefix' | 'suffix';
  };
}

/**
 * Accessibility Configuration
 * @remarks
 * Comprehensive configuration for accessibility features,
 * ensuring compliance with WCAG guidelines and providing
 * an inclusive user experience.
 * 
 * @example
 * ```typescript
 * const config: AccessibilityConfig = {
 *   level: AccessibilityLevel.AA,
 *   keyboardNavigation: true,
 *   screenReader: true,
 *   highContrast: false,
 *   locale: 'en-US',
 *   textResize: true,
 *   focusIndicators: true,
 *   animations: {
 *     reduceMotion: true
 *   }
 * };
 * ```
 */
export interface AccessibilityConfig {
  /** Target WCAG compliance level */
  level: AccessibilityLevel;

  /** Enable keyboard navigation */
  keyboardNavigation: boolean;

  /** Screen reader optimization */
  screenReader: boolean;

  /** High contrast mode */
  highContrast: boolean;

  /** Current locale identifier */
  locale: string;

  /** Text resize support */
  textResize: boolean;

  /** Visible focus indicators */
  focusIndicators: boolean;

  /** Animation preferences */
  animations?: {
    /** Reduce motion for animations */
    reduceMotion: boolean;
    /** Alternative text for essential animations */
    descriptions: boolean;
  };

  /** Color adjustments */
  colors?: {
    /** Increase contrast ratio */
    enhanceContrast: boolean;
    /** Color blindness support */
    colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  };

  /** Audio preferences */
  audio?: {
    /** Provide captions */
    captions: boolean;
    /** Provide transcripts */
    transcripts: boolean;
    /** Audio description */
    description: boolean;
  };
}

/**
 * Translation Interface
 * @remarks
 * Provides a comprehensive interface for handling translations
 * and localization, supporting dynamic content and fallback
 * mechanisms.
 * 
 * @example
 * ```typescript
 * const translator: Translator = {
 *   translate: (key, params) => {
 *     return `Hello ${params?.name || 'World'}`;
 *   },
 *   setLocale: (locale) => {
 *     console.log(`Switching to ${locale}`);
 *   },
 *   getCurrentLocale: () => 'en-US'
 * };
 * ```
 */
export interface Translator {
  /**
   * Translate a key to the current locale
   * @param key - Translation key
   * @param params - Optional parameters for dynamic translations
   * @returns Translated text
   * 
   * @example
   * ```typescript
   * const greeting = translator.translate('welcome', { name: 'John' });
   * // Returns: "Welcome, John!" (in current locale)
   * ```
   */
  translate(key: string, params?: Record<string, string>): string;

  /**
   * Set the current locale
   * @param locale - BCP 47 language tag
   * @throws If locale is not supported
   * 
   * @example
   * ```typescript
   * translator.setLocale('fr-FR');
   * ```
   */
  setLocale(locale: string): void;

  /**
   * Get the current locale
   * @returns Current locale identifier
   * 
   * @example
   * ```typescript
   * const currentLocale = translator.getCurrentLocale();
   * // Returns: "en-US"
   * ```
   */
  getCurrentLocale(): string;
}

/**
 * Accessibility Context
 * @remarks
 * Provides a comprehensive context for managing accessibility
 * and localization settings throughout the application.
 * 
 * @example
 * ```typescript
 * const context: AccessibilityContext = {
 *   config: defaultConfig,
 *   locale: defaultLocale,
 *   translate: (key, params) => {
 *     return translator.translate(key, params);
 *   },
 *   updateConfig: (newConfig) => {
 *     Object.assign(config, newConfig);
 *   },
 *   setLocale: (newLocale) => {
 *     locale = newLocale;
 *   }
 * };
 * ```
 */
export interface AccessibilityContext {
  /** Current accessibility configuration */
  config: AccessibilityConfig;

  /** Current locale configuration */
  locale: LocaleConfig;

  /**
   * Translate a key to the current locale
   * @param key - Translation key
   * @param params - Optional parameters for dynamic translations
   * @returns Translated text
   */
  translate(key: string, params?: Record<string, string>): string;

  /**
   * Update accessibility configuration
   * @param config - Partial configuration to update
   */
  updateConfig(config: Partial<AccessibilityConfig>): void;

  /**
   * Set current locale
   * @param locale - BCP 47 language tag
   */
  setLocale(locale: string): void;
}

/**
 * Default Accessibility Configuration
 * @remarks
 * Provides sensible default accessibility settings that comply
 * with WCAG AA standards and common best practices.
 * 
 * @example
 * ```typescript
 * const config = { ...defaultAccessibilityConfig };
 * ```
 */
export const defaultAccessibilityConfig: AccessibilityConfig = {
  level: AccessibilityLevel.AA,
  keyboardNavigation: true,
  screenReader: true,
  highContrast: false,
  locale: 'en-US',
  textResize: true,
  focusIndicators: true,
  animations: {
    reduceMotion: false,
    descriptions: true
  },
  colors: {
    enhanceContrast: false,
    colorBlindness: 'none'
  },
  audio: {
    captions: true,
    transcripts: true,
    description: false
  }
};
