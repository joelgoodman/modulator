import {
  AccessibilityLevel,
  AccessibilityConfig,
  LocaleConfig,
  Translator,
  AccessibilityContext,
} from '../accessibility.js';

// Valid configurations
const validConfig: AccessibilityConfig = {
  level: AccessibilityLevel.AAA,
  keyboardNavigation: true,
  screenReader: true,
  highContrast: false,
  locale: 'en-US',
  textResize: true,
  focusIndicators: true,
};

const validLocale: LocaleConfig = {
  language: 'en-US',
  direction: 'ltr',
  translations: {
    welcome: 'Welcome',
    goodbye: 'Goodbye',
  },
  dateTimeFormat: {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm:ss',
  },
  numberFormat: {
    decimal: '.',
    thousands: ',',
  },
};

const validTranslator: Translator = {
  translate: (_: string) => 'translated text',
  setLocale: (_: string) => {},
  getCurrentLocale: () => 'en-US',
};

// Invalid configurations
// @ts-expect-error - missing required properties and invalid types
const invalidConfig = {
  ...validConfig,
  level: 'invalid-level',
  keyboardNavigation: 'not-a-boolean',
  screenReader: 'not-a-boolean',
  highContrast: 'not-a-boolean',
  textResize: 'not-a-boolean',
  focusIndicators: 'not-a-boolean',
} as AccessibilityConfig;

// @ts-expect-error - missing required properties and invalid types
const invalidLocale = {
  ...validLocale,
  language: 123,
  translations: null,
} as LocaleConfig;

// @ts-expect-error - missing required methods
const invalidTranslator = {
  ...validTranslator,
  translate: () => 123,
  setLocale: null,
} as Translator;

// @ts-expect-error - missing required properties and methods
const invalidContext = {
  config: validConfig,
  locale: validLocale,
  translate: validTranslator.translate,
} as AccessibilityContext;
