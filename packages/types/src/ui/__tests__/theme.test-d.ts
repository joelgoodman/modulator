import {
  ThemePalette,
  ThemeTypography,
  ThemeSpacing,
  ThemeConfig,
  ThemeVariant,
  ThemeManagerConfig,
} from '../theme.js';

// Valid configurations
const validPalette: ThemePalette = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#9c27b0',
    light: '#ba68c8',
    dark: '#7b1fa2',
    contrastText: '#ffffff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrastText: '#ffffff',
  },
  background: {
    default: '#ffffff',
    paper: '#f5f5f5',
    elevated: '#e0e0e0',
  },
  text: {
    primary: '#000000',
    secondary: '#666666',
    disabled: '#999999',
  },
};

const validTypography: ThemeTypography = {
  fontFamily: {
    primary: 'Inter, sans-serif',
    secondary: 'Roboto, sans-serif',
    monospace: 'Fira Code, monospace',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

const validSpacing: ThemeSpacing = {
  space: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  sizes: {
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    full: '100%',
  },
};

// Invalid configurations
// @ts-expect-error - missing required properties and invalid types
const invalidPalette = {
  ...validPalette,
  primary: {
    main: 123,
    light: null,
  },
  secondary: null,
  background: {
    default: 123,
  },
} as ThemePalette;

// @ts-expect-error - missing required properties and invalid types
const invalidTypography = {
  ...validTypography,
  fontFamily: {
    primary: 123,
  },
  fontWeight: {
    light: 'not-a-number',
  },
  fontSize: {
    base: 123,
  },
} as ThemeTypography;

// @ts-expect-error - missing required properties and invalid types
const invalidSpacing = {
  ...validSpacing,
  space: {
    px: 123,
    0: null,
  },
  sizes: null,
} as ThemeSpacing;

// @ts-expect-error - missing required properties and invalid types
const invalidConfig = {
  name: 123,
  mode: 'invalid-mode',
  palette: validPalette,
  typography: validTypography,
  spacing: validSpacing,
} as ThemeConfig;

// @ts-expect-error - missing required properties and invalid types
const invalidVariant = {
  name: 123,
  parent: null,
  overrides: {
    palette: validPalette,
  },
} as ThemeVariant;

// @ts-expect-error - missing required properties and invalid types
const invalidManagerConfig = {
  defaultTheme: 123,
  themes: [{ 
    name: 'default',
    mode: 'light',
    palette: validPalette,
    typography: validTypography,
    spacing: validSpacing,
  }],
  variants: 'not-an-array',
  defaultMode: 'invalid-mode',
  persistSelection: 'not-a-boolean',
  cssInJs: 'invalid-option',
} as ThemeManagerConfig;
