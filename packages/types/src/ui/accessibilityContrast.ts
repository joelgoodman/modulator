/**
 * @fileoverview High Contrast Mode Types
 * @module @modulator/types/ui/accessibility-contrast
 * @description
 * Defines types for high contrast mode support,
 * ensuring proper accessibility for users with visual impairments.
 */

import type { ThemePalette } from './theme.js';

/**
 * Contrast mode
 * @description Available contrast modes
 */
export type ContrastMode =
  | 'normal'
  | 'high'
  | 'high-black'
  | 'high-white'
  | 'custom';

/**
 * Contrast ratio
 * @description WCAG contrast ratio requirements
 */
export type ContrastRatio =
  | 'AA-large' // 3:1
  | 'AA-normal' // 4.5:1
  | 'AAA-large' // 4.5:1
  | 'AAA-normal'; // 7:1

/**
 * Contrast ratio values
 * @description Minimum contrast ratios for each level
 */
export const ContrastRatioValues: Record<ContrastRatio, number> = {
  'AA-large': 3,
  'AA-normal': 4.5,
  'AAA-large': 4.5,
  'AAA-normal': 7,
} as const;

/**
 * Color pair
 * @description Foreground and background color pair
 */
export interface ColorPair {
  /** Foreground color */
  foreground: string;
  /** Background color */
  background: string;
  /** Calculated contrast ratio */
  contrastRatio: number;
  /** Whether the pair meets WCAG requirements */
  meetsWCAG: {
    'AA-large': boolean;
    'AA-normal': boolean;
    'AAA-large': boolean;
    'AAA-normal': boolean;
  };
}

/**
 * High contrast palette
 * @description Color palette for high contrast mode
 */
export interface HighContrastPalette extends ThemePalette {
  /** Override colors */
  overrides: {
    /** Link colors */
    link: {
      default: string;
      visited: string;
      active: string;
    };
    /** Selection colors */
    selection: {
      background: string;
      text: string;
    };
    /** Focus indicator colors */
    focus: {
      outline: string;
      inner: string;
    };
    /** Border colors */
    border: {
      default: string;
      active: string;
      disabled: string;
    };
  };
}

/**
 * High contrast pattern
 * @description Pattern types for high contrast mode
 */
export type ContrastPattern =
  | 'solid'
  | 'stripe'
  | 'dot'
  | 'check'
  | 'crosshatch';

/**
 * Pattern configuration
 * @description Configuration for contrast patterns
 */
export interface PatternConfig {
  /** Pattern type */
  type: ContrastPattern;
  /** Pattern color */
  color: string;
  /** Pattern opacity */
  opacity: number;
  /** Pattern size */
  size: number;
  /** Pattern angle */
  angle?: number;
  /** Pattern spacing */
  spacing?: number;
}

/**
 * High contrast configuration
 * @description Configuration for high contrast mode
 */
export interface HighContrastConfig {
  /** Whether high contrast mode is enabled */
  enabled: boolean;
  /** Current contrast mode */
  mode: ContrastMode;
  /** Color palette */
  palette: HighContrastPalette;
  /** Minimum contrast ratio to enforce */
  minimumContrastRatio: ContrastRatio;
  /** Pattern settings */
  patterns: {
    /** Whether to use patterns */
    enabled: boolean;
    /** Available patterns */
    available: PatternConfig[];
  };
  /** Border settings */
  borders: {
    /** Whether to enforce high contrast borders */
    enforce: boolean;
    /** Minimum border width */
    minimumWidth: number;
    /** Border style to use */
    style: 'solid' | 'dashed' | 'dotted';
  };
  /** Focus indicator settings */
  focusIndicator: {
    /** Whether to enforce high contrast focus indicators */
    enforce: boolean;
    /** Minimum outline width */
    minimumWidth: number;
    /** Whether to use patterns for focus */
    usePatterns: boolean;
  };
  /** System preferences */
  systemPreferences: {
    /** Whether to respect system high contrast setting */
    respect: boolean;
    /** Whether to show a toggle in the UI */
    showToggle: boolean;
    /** Whether to persist user preference */
    persistPreference: boolean;
  };
}

/**
 * High contrast state
 * @description Current state of high contrast mode
 */
export interface HighContrastState {
  /** Whether high contrast mode is active */
  isActive: boolean;
  /** Current contrast mode */
  currentMode: ContrastMode;
  /** Whether system preference is enabled */
  systemPreference: boolean;
  /** User's preferred mode */
  userPreference?: ContrastMode;
  /** Active color pairs */
  activePairs: ColorPair[];
  /** Active patterns */
  activePatterns: PatternConfig[];
}

/**
 * High contrast event type
 * @description Types of high contrast events
 */
export type HighContrastEventType =
  | 'enabled'
  | 'disabled'
  | 'mode-changed'
  | 'system-changed'
  | 'preference-changed';

/**
 * High contrast event payload
 * @description Data included with high contrast events
 */
export interface HighContrastEventPayload {
  /** Event type */
  type: HighContrastEventType;
  /** Previous state */
  previousState: HighContrastState;
  /** New state */
  newState: HighContrastState;
  /** Timestamp of the event */
  timestamp: number;
  /** Whether the change was triggered by system */
  isSystem: boolean;
  /** Whether the change was triggered by user */
  isUser: boolean;
}
