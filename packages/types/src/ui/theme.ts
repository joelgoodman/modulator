/**
 * @fileoverview Theme System Types for Modulator UI
 * @module @modulator/types/ui/theme
 * @description
 * Defines comprehensive theme types and interfaces for the Modulator UI system,
 * supporting dynamic theming, responsive design, and smooth theme transitions.
 * This module is the foundation for all theming capabilities in the Modulator system.
 *
 * @remarks
 * The theme system is built with flexibility and performance in mind, supporting:
 * - Light, dark, and system color modes
 * - Dynamic theme transitions with configurable timing
 * - Responsive breakpoints and spacing
 * - Comprehensive typography system
 * - Customizable color palettes
 */

import {
  AnimationTiming,
  AnimationDirection,
  AnimationFillMode,
  AnimationAccessibilityConfig,
} from './animation.js';

/**
 * Theme color mode
 * @remarks
 * Defines the available color modes for themes. The system mode automatically
 * adapts to the user's system preferences.
 *
 * @example
 * ```typescript
 * const mode: ThemeMode = 'system';
 * // Theme will automatically switch based on system preferences
 * ```
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Theme color palette
 * @remarks
 * Comprehensive color definitions for a theme, including primary, secondary,
 * and semantic colors like error, warning, and info. Each color includes
 * main, light, dark variants and contrast text colors.
 *
 * @example
 * ```typescript
 * const palette: ThemePalette = {
 *   primary: {
 *     main: '#1976d2',
 *     light: '#42a5f5',
 *     dark: '#1565c0',
 *     contrastText: '#ffffff'
 *   },
 *   // ... other color definitions
 * };
 * ```
 */
export interface ThemePalette {
  /** Primary colors */
  primary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  /** Secondary colors */
  secondary: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  /** Error colors */
  error: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  /** Warning colors */
  warning: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  /** Info colors */
  info: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  /** Success colors */
  success: {
    main: string;
    light: string;
    dark: string;
    contrastText: string;
  };
  /** Background colors */
  background: {
    default: string;
    paper: string;
    elevated: string;
  };
  /** Text colors */
  text: {
    primary: string;
    secondary: string;
    disabled: string;
  };
}

/**
 * Theme typography
 * @remarks
 * Defines the complete typography system for a theme, including font families,
 * weights, sizes, line heights, and letter spacing. Supports responsive typography
 * through predefined scale.
 *
 * @example
 * ```typescript
 * const typography: ThemeTypography = {
 *   fontFamily: {
 *     primary: 'Inter, sans-serif',
 *     secondary: 'Roboto, sans-serif',
 *     monospace: 'Fira Code, monospace'
 *   },
 *   fontSize: {
 *     base: '1rem',
 *     lg: '1.125rem',
 *     // ... other sizes
 *   }
 * };
 * ```
 */
export interface ThemeTypography {
  /** Font families */
  fontFamily: {
    primary: string;
    secondary?: string;
    monospace: string;
  };
  /** Font weights */
  fontWeight: {
    light: number;
    regular: number;
    medium: number;
    bold: number;
  };
  /** Font sizes */
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  /** Line heights */
  lineHeight: {
    none: number;
    tight: number;
    snug: number;
    normal: number;
    relaxed: number;
    loose: number;
  };
  /** Letter spacing */
  letterSpacing: {
    tighter: string;
    tight: string;
    normal: string;
    wide: string;
    wider: string;
    widest: string;
  };
}

/**
 * Theme spacing
 * @remarks
 * Defines the spacing system used throughout the UI, including padding, margins,
 * and component sizing. Uses a consistent scale for visual harmony.
 *
 * @example
 * ```typescript
 * const spacing: ThemeSpacing = {
 *   space: {
 *     0: '0',
 *     1: '0.25rem',
 *     2: '0.5rem',
 *     // ... other spacing values
 *   },
 *   sizes: {
 *     sm: '24px',
 *     md: '32px',
 *     // ... other sizes
 *   }
 * };
 * ```
 */
export interface ThemeSpacing {
  /** Space scale */
  space: {
    px: string;
    0: string;
    0.5: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
    8: string;
    10: string;
    12: string;
    16: string;
    20: string;
    24: string;
    32: string;
  };
  /** Sizing scale */
  sizes: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    full: string;
  };
}

/**
 * Theme breakpoints
 * @remarks
 * Defines responsive breakpoints for the theme, enabling consistent
 * responsive behavior across the UI. Supports multiple unit types
 * and follows common device sizes.
 *
 * @example
 * ```typescript
 * const breakpoints: ThemeBreakpoints = {
 *   values: {
 *     xs: 0,
 *     sm: 600,
 *     md: 960,
 *     lg: 1280,
 *     xl: 1920
 *   },
 *   unit: 'px'
 * };
 * ```
 */
export interface ThemeBreakpoints {
  /** Breakpoint values */
  values: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
  };
  /** Unit for breakpoint values */
  unit: 'px' | 'em' | 'rem';
}

/**
 * Theme shadows
 * @remarks
 * Defines elevation shadows for components, providing depth and hierarchy
 * in the UI. Includes multiple levels of elevation and inner shadows.
 *
 * @example
 * ```typescript
 * const shadows: ThemeShadows = {
 *   levels: {
 *     none: 'none',
 *     sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
 *     base: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
 *     // ... other shadow levels
 *   }
 * };
 * ```
 */
export interface ThemeShadows {
  /** Shadow levels */
  levels: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    inner: string;
  };
}

/**
 * Theme borders
 * @remarks
 * Defines border styles, widths, and radii used throughout the UI.
 * Supports multiple border styles and consistent border radii scale.
 *
 * @example
 * ```typescript
 * const borders: ThemeBorders = {
 *   width: {
 *     thin: 1,
 *     base: 2,
 *     thick: 4
 *   },
 *   style: {
 *     solid: 'solid',
 *     dashed: 'dashed'
 *   },
 *   radius: {
 *     sm: '0.25rem',
 *     base: '0.375rem'
 *   }
 * };
 * ```
 */
export interface ThemeBorders {
  /** Border widths */
  width: {
    none: number;
    thin: number;
    base: number;
    thick: number;
  };
  /** Border styles */
  style: {
    solid: string;
    dashed: string;
    dotted: string;
  };
  /** Border radii */
  radius: {
    none: string;
    sm: string;
    base: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}

/**
 * Theme transitions
 * @remarks
 * Defines animation timing and easing functions for smooth transitions
 * between states. Supports multiple duration presets and easing curves.
 *
 * @example
 * ```typescript
 * const transitions: ThemeTransitions = {
 *   duration: {
 *     fast: 150,
 *     normal: 300,
 *     slow: 500
 *   },
 *   easing: {
 *     easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
 *     easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)'
 *   }
 * };
 * ```
 */
export interface ThemeTransitions {
  /** Duration presets */
  duration: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
  };
  /** Easing presets */
  easing: {
    linear: string;
    ease: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };
}

/**
 * Theme transition property
 * @remarks
 * Defines which CSS properties can be animated during theme transitions.
 * Helps optimize performance by limiting transitions to specific properties.
 *
 * @example
 * ```typescript
 * const properties: ThemeTransitionProperty[] = [
 *   'background-color',
 *   'color',
 *   'border-color'
 * ];
 * ```
 */
export type ThemeTransitionProperty =
  | 'backgroundColor'
  | 'color'
  | 'borderColor'
  | 'boxShadow'
  | 'transform'
  | 'opacity'
  | 'filter';

/**
 * Theme transition timing
 * @remarks
 * Configures the timing of theme transitions, including stagger effects
 * for groups of elements. Helps create smooth, coordinated animations.
 *
 * @example
 * ```typescript
 * const timing: ThemeTransitionTiming = {
 *   stagger: {
 *     delay: 50,
 *     maxTotalDuration: 1000
 *   }
 * };
 * ```
 */
export interface ThemeTransitionTiming extends AnimationTiming {
  /** Whether to stagger transitions across elements */
  stagger?: {
    /** Delay between each element (ms) */
    delay: number;
    /** Maximum total duration for all elements */
    maxTotalDuration?: number;
  };
}

/**
 * Theme transition config
 * @remarks
 * Complete configuration for theme transitions, including properties,
 * timing, and accessibility settings. Enables fine-grained control
 * over transition behavior.
 *
 * @example
 * ```typescript
 * const config: ThemeTransitionConfig = {
 *   properties: ['background-color', 'color'],
 *   timing: {
 *     stagger: { delay: 50 }
 *   },
 *   accessibility: {
 *     reduceMotion: true
 *   }
 * };
 * ```
 */
export interface ThemeTransitionConfig {
  /** Properties to transition */
  properties: ThemeTransitionProperty[];
  /** Timing configuration */
  timing: ThemeTransitionTiming;
  /** Animation direction */
  direction?: AnimationDirection;
  /** Fill mode */
  fillMode?: AnimationFillMode;
  /** Accessibility configuration */
  accessibility?: AnimationAccessibilityConfig;
}

/**
 * Theme transition state
 * @remarks
 * Represents the current state of a theme transition, including
 * progress and timing information. Used for monitoring and
 * controlling transition flow.
 *
 * @example
 * ```typescript
 * const state: ThemeTransitionState = {
 *   phase: 'running',
 *   progress: 0.5,
 *   elapsedTime: 150
 * };
 * ```
 */
export type ThemeTransitionState =
  | 'idle'
  | 'preparing'
  | 'transitioning'
  | 'completed'
  | 'cancelled';

/**
 * Theme transition event
 * @remarks
 * Events emitted during theme transitions, providing detailed
 * information about the transition state and performance metrics.
 *
 * @example
 * ```typescript
 * element.addEventListener('themetransitionend', (event: ThemeTransitionEvent) => {
 *   console.log(`Theme transition completed in ${event.detail.performance.elapsedTime}ms`);
 * });
 * ```
 */
export type ThemeTransitionEvent =
  | 'themeTransitionStart'
  | 'themeTransitionComplete'
  | 'themeTransitionCancel';

/**
 * Theme transition event detail
 * @remarks
 * Detailed information about a theme transition event, including
 * performance metrics and state changes. Useful for monitoring
 * and debugging transitions.
 *
 * @example
 * ```typescript
 * const detail: ThemeTransitionEventDetail = {
 *   previousTheme: 'light',
 *   newTheme: 'dark',
 *   state: { phase: 'complete' },
 *   timestamp: Date.now(),
 *   performance: {
 *     elapsedTime: 300,
 *     elementCount: 5
 *   }
 * };
 * ```
 */
export interface ThemeTransitionEventDetail {
  /** Previous theme name */
  previousTheme: string;
  /** New theme name */
  newTheme: string;
  /** Transition state */
  state: ThemeTransitionState;
  /** Timestamp of the event */
  timestamp: number;
  /** Performance metrics */
  performance?: {
    /** Duration since transition start */
    elapsedTime: number;
    /** Number of elements transitioned */
    elementCount: number;
    /** Memory usage during transition */
    memoryUsage?: number;
  };
}

/**
 * Theme transition group
 * @remarks
 * Groups related theme transitions together for coordinated animations.
 * Supports sequential, parallel, and staggered transition ordering.
 *
 * @example
 * ```typescript
 * const group: ThemeTransitionGroup = {
 *   name: 'header',
 *   elements: ['nav', 'logo', 'menu'],
 *   transition: {  transition config  },
 *   coordinated: true,
 *   order: 'staggered'
 * };
 * ```
 */
export interface ThemeTransitionGroup {
  /** Group name */
  name: string;
  /** Elements in the group */
  elements: string[];
  /** Transition configuration */
  transition: ThemeTransitionConfig;
  /** Whether to coordinate transitions */
  coordinated: boolean;
  /** Order of transitions */
  order?: 'sequential' | 'parallel' | 'staggered';
}

/**
 * Theme animation configuration
 * @remarks
 * Configuration for theme-specific animations, including timing
 * and accessibility settings. Enables theme-aware animations
 * that adapt to the current theme.
 *
 * @example
 * ```typescript
 * const config: ThemeAnimationConfig = {
 *   timing: {
 *     duration: 300,
 *     easing: 'ease-in-out'
 *   },
 *   accessibility: {
 *     reduceMotion: true
 *   }
 * };
 * ```
 */
export interface ThemeAnimationConfig {
  /** Theme-specific timing overrides */
  timing?: Partial<AnimationTiming>;
  /** Theme-specific properties */
  properties?: Record<string, string | number>;
  /** Theme-specific accessibility settings */
  accessibility?: Partial<AnimationAccessibilityConfig>;
}

/**
 * Theme animation map
 * @remarks
 * Maps animation names to their theme-specific configurations.
 * Enables consistent animation behavior across themes while
 * allowing theme-specific customization.
 *
 * @example
 * ```typescript
 * const animations: ThemeAnimationMap = {
 *   fadeIn: {
 *     timing: { duration: 200 },
 *     properties: { opacity: 1 }
 *   }
 * };
 * ```
 */
export type ThemeAnimationMap = Record<string, ThemeAnimationConfig>;

/**
 * Theme transition manager configuration
 * @remarks
 * Configuration for the theme transition manager, including
 * default transitions, grouping, and performance settings.
 * Controls the overall behavior of theme transitions.
 *
 * @example
 * ```typescript
 * const config: ThemeTransitionManagerConfig = {
 *   defaultTransition: { default config  },
 *   groups: [{ group configs }],
 *   enableCoordination: true,
 *   maxConcurrentTransitions: 5,
 *   batchUpdates: true
 * };
 * ```
 */
export interface ThemeTransitionManagerConfig {
  /** Default transition configuration */
  defaultTransition: ThemeTransitionConfig;
  /** Transition groups */
  groups?: ThemeTransitionGroup[];
  /** Theme-specific animation configurations */
  animations?: ThemeAnimationMap;
  /** Whether to enable coordinated transitions */
  enableCoordination?: boolean;
  /** Maximum concurrent transitions */
  maxConcurrentTransitions?: number;
  /** Whether to batch DOM updates */
  batchUpdates?: boolean;
  /** Debug mode */
  debug?: boolean;
}

/**
 * Theme configuration
 * @remarks
 * Complete theme configuration including all visual aspects
 * of the UI system. Defines the entire theme including colors,
 * typography, spacing, and transitions.
 *
 * @example
 * ```typescript
 * const theme: ThemeConfig = {
 *   name: 'light',
 *   mode: 'light',
 *   palette: { /* colors  },
 *   typography: { /* fonts  },
 *   spacing: { /* spacing scale  },
 *   // ... other theme settings
 * };
 * ```
 */
export interface ThemeConfig {
  /** Theme name */
  name: string;
  /** Color mode */
  mode: ThemeMode;
  /** Color palette */
  palette: ThemePalette;
  /** Typography */
  typography: ThemeTypography;
  /** Spacing */
  spacing: ThemeSpacing;
  /** Breakpoints */
  breakpoints: ThemeBreakpoints;
  /** Shadows */
  shadows: ThemeShadows;
  /** Borders */
  borders: ThemeBorders;
  /** Transitions */
  transitions: ThemeTransitions;
  /** Z-index levels */
  zIndex: {
    appBar: number;
    drawer: number;
    modal: number;
    snackbar: number;
    tooltip: number;
  };
  /** Transition manager configuration */
  transitionManager?: ThemeTransitionManagerConfig;
}

/**
 * Theme variant
 * @remarks
 * Defines a variant of a base theme with specific overrides.
 * Enables creation of theme variations while maintaining
 * consistency with the parent theme.
 *
 * @example
 * ```typescript
 * const variant: ThemeVariant = {
 *   name: 'high-contrast',
 *   parent: 'light',
 *   overrides: {
 *     palette: { /* high contrast colors  }
 *   }
 * };
 * ```
 */
export interface ThemeVariant {
  /** Variant name */
  name: string;
  /** Parent theme name */
  parent: string;
  /** Override values */
  overrides: Partial<ThemeConfig>;
}

/**
 * Theme manager configuration
 * @remarks
 * Configuration for the theme management system, including
 * default themes, variants, and persistence settings.
 * Controls the overall theming behavior of the application.
 *
 * @example
 * ```typescript
 * const config: ThemeManagerConfig = {
 *   defaultTheme: 'light',
 *   themes: [/* theme configs ],
 *   variants: [/* variant configs ],
 *   defaultMode: 'system',
 *   persistSelection: true,
 *   cssInJs: 'emotion'
 * };
 * ```
 */
export interface ThemeManagerConfig {
  /** Default theme name */
  defaultTheme: string;
  /** Available themes */
  themes: ThemeConfig[];
  /** Theme variants */
  variants: ThemeVariant[];
  /** Default mode */
  defaultMode: ThemeMode;
  /** Whether to persist theme selection */
  persistSelection: boolean;
  /** CSS-in-JS solution to use */
  cssInJs: 'emotion' | 'styled-components' | 'none';
}
