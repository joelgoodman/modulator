/**
 * @fileoverview Style System Types for Modulator UI
 * @module @modulator/types/ui/styles
 * @description
 * Defines comprehensive types and interfaces for managing component styling,
 * including typography, colors, spacing, and icons. This module serves as
 * the foundation for the Modulator UI styling system.
 *
 * @remarks
 * The style system is built with flexibility and maintainability in mind, supporting:
 * - Consistent typography across components
 * - Flexible color theming
 * - Responsive spacing
 * - Customizable icons
 * - Style inheritance and overrides
 * - Theme variables
 */

/**
 * Icon Name Type
 * @remarks
 * Defines the available icon names in the system while maintaining
 * type safety. Supports both built-in icons and custom additions
 * through string literal types.
 *
 * @example
 * ```typescript
 * const icon: IconName = 'bold';  // Built-in icon
 * const custom: IconName = 'custom-icon';  // Custom icon
 * ```
 */
export type IconName =
  | 'bold'
  | 'italic'
  | 'link'
  | 'image'
  | 'heading'
  | 'list'
  | 'code'
  | 'quote'
  | (string & {}); // allows custom icons while maintaining type safety

/**
 * Font Configuration
 * @remarks
 * Defines comprehensive font styling properties for typography
 * elements. Supports standard CSS font properties and custom
 * extensions.
 *
 * @example
 * ```typescript
 * const heading: FontConfig = {
 *   family: 'Inter, sans-serif',
 *   weight: 600,
 *   size: '2rem',
 *   lineHeight: 1.5,
 *   letterSpacing: '-0.02em',
 *   textTransform: 'none'
 * };
 * ```
 */
export interface FontConfig {
  /** Font family name or stack */
  family: string;

  /** Font weight (numeric or keyword) */
  weight?: number | string;

  /** Font size with units */
  size?: string;

  /** Line height (with or without units) */
  lineHeight?: string | number;

  /** Letter spacing */
  letterSpacing?: string;

  /** Text transform */
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase';

  /** Font style */
  style?: 'normal' | 'italic' | 'oblique';

  /** Font variant */
  variant?: string;
}

/**
 * Color Configuration
 * @remarks
 * Defines the color palette for the UI system, including
 * semantic colors, states, and interaction colors.
 *
 * @example
 * ```typescript
 * const colors: ColorConfig = {
 *   primary: '#1976d2',
 *   secondary: '#dc004e',
 *   background: '#ffffff',
 *   text: '#000000',
 *   success: '#4caf50',
 *   error: '#f44336'
 * };
 * ```
 */
export interface ColorConfig {
  /** Primary brand color */
  primary: string;

  /** Secondary brand color */
  secondary: string;

  /** Accent color for highlights */
  accent: string;

  /** Background color */
  background: string;

  /** Text color */
  text: string;

  /** Success state color */
  success: string;

  /** Warning state color */
  warning: string;

  /** Error state color */
  error: string;

  /** Info state color */
  info: string;

  /** Border color */
  border: string;

  /** Hover state color */
  hover: string;

  /** Active state color */
  active: string;

  /** Disabled state color */
  disabled: string;
}

/**
 * Component Styles
 * @remarks
 * Defines comprehensive styling for UI components, including
 * typography, icons, colors, and spacing. Supports customization
 * and extension through custom keys.
 *
 * @example
 * ```typescript
 * const styles: ComponentStyles = {
 *   typography: {
 *     heading: { family: 'Inter', weight: 600 },
 *     body: { family: 'Inter', weight: 400 }
 *   },
 *   icons: {
 *     size: { small: '16px', medium: '24px' },
 *     color: { default: '#000', active: '#1976d2' }
 *   },
 *   colors: {
 *     primary: '#1976d2',
 *     background: '#ffffff'
 *   },
 *   spacing: {
 *     small: '8px',
 *     medium: '16px'
 *   }
 * };
 * ```
 */
export interface ComponentStyles {
  /** Typography configurations */
  typography: {
    /** Heading typography */
    heading: FontConfig;
    /** Body text typography */
    body: FontConfig;
    /** Caption text typography */
    caption: FontConfig;
    /** Code block typography */
    code: FontConfig;
    /** Custom typography variants */
    [key: string]: FontConfig;
  };

  /** Icon configurations */
  icons: {
    /** Icon sizes */
    size: {
      /** Small icon size (default: 16px) */
      small: string;
      /** Medium icon size (default: 24px) */
      medium: string;
      /** Large icon size (default: 32px) */
      large: string;
      /** Custom icon sizes */
      [key: string]: string;
    };
    /** Icon colors */
    color: {
      /** Default icon color */
      default: string;
      /** Active icon color */
      active: string;
      /** Disabled icon color */
      disabled: string;
      /** Custom icon colors */
      [key: string]: string;
    };
  };

  /** Color configurations */
  colors: ColorConfig;

  /** Spacing configurations */
  spacing: {
    /** Small spacing unit */
    small: string;
    /** Medium spacing unit */
    medium: string;
    /** Large spacing unit */
    large: string;
    /** Custom spacing units */
    [key: string]: string;
  };
}

/**
 * Style Configuration
 * @remarks
 * Defines a complete style configuration that can be applied
 * to components. Supports inheritance and theme variable
 * overrides.
 *
 * @example
 * ```typescript
 * const config: StyleConfig = {
 *   id: 'custom-theme',
 *   name: 'Custom Theme',
 *   description: 'A custom theme with dark mode colors',
 *   styles: {
 *     typography: { body: { size: '16px' } },
 *     colors: { primary: '#1976d2' }
 *   },
 *   variables: {
 *     colors: {
 *       primaryShade: '#1565c0',
 *       primaryTint: '#42a5f5'
 *     }
 *   },
 *   extends: 'base-theme'
 * };
 * ```
 */
export interface StyleConfig {
  /** Unique identifier for the style configuration */
  id: string;

  /** Human-readable name */
  name: string;

  /** Optional description */
  description?: string;

  /** Component styles */
  styles: ComponentStyles;

  /** Theme variable overrides */
  variables?: import('./themes.js').ThemeOverrides;

  /** Parent style configuration to extend */
  extends?: string;
}

/**
 * User Style Configuration
 * @remarks
 * Defines user-configurable style options that can be applied
 * to customize the appearance of components.
 *
 * @example
 * ```typescript
 * const userConfig: UserStyleConfig = {
 *   theme: 'dark-mode',
 *   overrides: {
 *     typography: {
 *       body: { size: '16px' }
 *     }
 *   },
 *   customIcons: {
 *     'custom-icon': 'path/to/icon.svg'
 *   }
 * };
 * ```
 */
export interface UserStyleConfig {
  /** Theme selection (name or configuration) */
  theme: string | StyleConfig;

  /** Component style overrides */
  overrides?: Partial<ComponentStyles>;

  /** Custom icon definitions */
  customIcons?: Record<IconName, string>;
}
