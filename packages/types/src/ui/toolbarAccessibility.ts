/**
 * @fileoverview Toolbar Accessibility Types
 * @module @modulator/types/ui/toolbar-accessibility
 * @description
 * Defines comprehensive accessibility types and interfaces for toolbar components,
 * ensuring WCAG compliance and optimal user experience for all users.
 */

import type { AccessibilityLevel } from './accessibility.js';

/**
 * ARIA role for toolbar components
 */
export type ToolbarARIARole = 'toolbar' | 'menubar' | 'toolbox';

/**
 * ARIA attributes for toolbar components
 */
export interface ToolbarARIAAttributes {
  role: ToolbarARIARole;
  'aria-label': string;
  'aria-orientation': 'horizontal' | 'vertical';
}

/**
 * Keyboard navigation mode for toolbar
 */
export type ToolbarKeyboardMode = 'grid' | 'linear' | 'free';

/**
 * Keyboard navigation configuration
 */
export interface ToolbarKeyboardConfig {
  mode: ToolbarKeyboardMode;
  shortcuts: boolean;
  trapFocus: boolean;
}

/**
 * Announcement type for screen readers
 */
export type ToolbarAnnouncementType = 'minimal' | 'normal' | 'verbose';

/**
 * Screen reader configuration
 */
export interface ToolbarScreenReaderConfig {
  verbosity: ToolbarAnnouncementType;
  liveRegion: {
    type: 'polite' | 'assertive';
    clearDelay: number;
  };
}

/**
 * ARIA configuration
 */
export interface ToolbarARIAConfig {
  toolbar: string;
  groups: Record<string, string>;
  items: Record<string, string>;
  descriptions: Record<string, string>;
}

/**
 * Focus management configuration
 */
export interface ToolbarFocusConfig {
  autoFocus: {
    enabled: boolean;
    target?: 'first-item' | 'last-item' | 'first-enabled';
  };
  trapFocus: boolean;
  restoreFocus: boolean;
}

/**
 * Announcement configuration
 */
export interface ToolbarAnnouncementConfig {
  type: ToolbarAnnouncementType;
  delay: number;
}

/**
 * Complete toolbar accessibility configuration
 * @description Comprehensive accessibility settings for toolbar components
 */
export interface ToolbarAccessibilityConfig {
  screenReader: ToolbarScreenReaderConfig;
  aria: ToolbarARIAConfig;
  focus: ToolbarFocusConfig;
  keyboard: ToolbarKeyboardConfig;
  announcements: ToolbarAnnouncementConfig;
  level: AccessibilityLevel;
}
