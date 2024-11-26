/**
 * @fileoverview Focus Management Types
 * @module @modulator/types/ui/accessibility-focus
 * @description
 * Defines comprehensive focus management types for accessibility,
 * ensuring proper keyboard navigation and focus handling.
 */

import type { ThemeConfig } from './theme.js';

/**
 * Focus indicator style
 * @description Visual style for focus indicators
 */
export interface FocusIndicatorStyle {
  /** Color of the focus indicator */
  color: string;
  /** Width of the focus indicator */
  width: number;
  /** Style of the focus indicator */
  style: 'solid' | 'dashed' | 'dotted';
  /** Offset from the element */
  offset: number;
  /** Border radius of the focus indicator */
  radius: number;
  /** Animation duration for focus transitions */
  transitionDuration: number;
}

/**
 * Focus trap configuration
 * @description Configuration for focus trapping behavior
 */
export interface FocusTrapConfig {
  /** Whether focus trapping is enabled */
  enabled: boolean;
  /** Whether to auto-focus first element */
  autoFocus: boolean;
  /** Whether to restore focus on unmount */
  restoreFocus: boolean;
  /** Elements to include in the focus trap */
  include: string[];
  /** Elements to exclude from the focus trap */
  exclude: string[];
  /** Initial element to focus */
  initialFocus?: string;
  /** Fallback element if initial focus is not available */
  fallbackFocus?: string;
}

/**
 * Focus group configuration
 * @description Configuration for focus group behavior
 */
export interface FocusGroupConfig {
  /** Group name for identification */
  name: string;
  /** Navigation mode within the group */
  mode: 'linear' | 'grid' | 'free';
  /** Whether to wrap focus within the group */
  wrap: boolean;
  /** Whether to auto-focus first element */
  autoFocus: boolean;
  /** Tab index for the group */
  tabIndex: number;
  /** Key bindings for navigation */
  keyBindings?: {
    next?: string;
    previous?: string;
    first?: string;
    last?: string;
  };
}

/**
 * Focus state
 * @description Current focus state of an element
 */
export interface FocusState {
  /** Whether the element is focused */
  isFocused: boolean;
  /** Whether the element is focusable */
  isFocusable: boolean;
  /** Whether the element is in a focus group */
  inFocusGroup: boolean;
  /** Whether the element is in a focus trap */
  inFocusTrap: boolean;
  /** Timestamp of last focus */
  lastFocused?: number;
  /** Duration of focus */
  focusDuration?: number;
}

/**
 * Focus event type
 * @description Types of focus events that can occur
 */
export type FocusEventType =
  | 'focus'
  | 'blur'
  | 'focusin'
  | 'focusout'
  | 'trap-activated'
  | 'trap-deactivated'
  | 'group-entered'
  | 'group-exited';

/**
 * Focus event payload
 * @description Data included with focus events
 */
export interface FocusEventPayload {
  /** Type of focus event */
  type: FocusEventType;
  /** Target element of the event */
  target: string;
  /** Previous focus state */
  previousState: FocusState;
  /** New focus state */
  newState: FocusState;
  /** Timestamp of the event */
  timestamp: number;
  /** Whether the event was triggered by keyboard */
  isKeyboard: boolean;
  /** Whether the event was triggered by pointer */
  isPointer: boolean;
}

/**
 * Focus manager configuration
 * @description Configuration for the focus management system
 */
export interface FocusManagerConfig {
  /** Default focus indicator style */
  indicatorStyle: FocusIndicatorStyle;
  /** Global focus trap settings */
  trapConfig: FocusTrapConfig;
  /** Focus groups */
  groups: FocusGroupConfig[];
  /** Whether to persist focus state */
  persistState: boolean;
  /** Whether to log focus events */
  logEvents: boolean;
  /** Custom focus order */
  customOrder?: string[];
  /** Focus delay (ms) */
  focusDelay: number;
  /** Blur delay (ms) */
  blurDelay: number;
}

/**
 * Focus scope configuration
 * @description Configuration for a focus scope
 */
export interface FocusScopeConfig {
  /** Scope name */
  name: string;
  /** Parent scope name */
  parent?: string;
  /** Focus manager configuration for this scope */
  config: Partial<FocusManagerConfig>;
  /** Theme overrides for this scope */
  themeOverrides?: Partial<ThemeConfig>;
  /** Whether this scope is active */
  isActive: boolean;
  /** Priority of this scope */
  priority: number;
}

/**
 * Focus navigation direction
 * @description Direction of focus movement
 */
export type FocusNavigationDirection =
  | 'next'
  | 'previous'
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'first'
  | 'last';

/**
 * Focus navigation options
 * @description Options for focus navigation
 */
export interface FocusNavigationOptions {
  /** Navigation direction */
  direction: FocusNavigationDirection;
  /** Whether to wrap around */
  wrap?: boolean;
  /** Whether to include hidden elements */
  includeHidden?: boolean;
  /** Whether to include disabled elements */
  includeDisabled?: boolean;
  /** Tabbable elements selector */
  tabbableSelector?: string;
  /** Focus scope to navigate within */
  scope?: string;
}
