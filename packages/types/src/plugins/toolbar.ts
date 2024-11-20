import type { Plugin, PluginContext, PluginStateManager, PluginStateData } from './plugin.js';

/**
 * Toolbar position type
 */
export const enum ToolbarPosition {
  TOP = 'top',
  BOTTOM = 'bottom',
  LEFT = 'left',
  RIGHT = 'right',
  INLINE = 'inline',
  FLOATING = 'floating',
}

/**
 * Toolbar position config
 */
export interface ToolbarPositionConfig {
  /**
   * Position type
   */
  type: ToolbarPosition;

  /**
   * Anchor point
   */
  anchor?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';

  /**
   * Position offset
   */
  offset?: {
    x: number;
    y: number;
  };
}

/**
 * Toolbar item interface
 */
export interface ToolbarItem<T extends PluginStateData = PluginStateData> {
  /**
   * Item identifier
   */
  id: string;

  /**
   * Item icon
   */
  icon: string;

  /**
   * Item label
   */
  label: string;

  /**
   * Item tooltip
   */
  tooltip?: string;

  /**
   * Keyboard shortcut
   */
  shortcut?: string;

  /**
   * Group identifier
   */
  group?: string;

  /**
   * Display priority
   */
  priority?: number;

  /**
   * Check if item is active
   */
  isActive?(context: ToolbarContext<T>): boolean;

  /**
   * Check if item is disabled
   */
  isDisabled?(context: ToolbarContext<T>): boolean;

  /**
   * Check if item is visible
   */
  isVisible?(context: ToolbarContext<T>): boolean;

  /**
   * Click handler
   */
  onClick(context: ToolbarContext<T>): void;

  /**
   * Custom render function
   */
  render?(context: ToolbarContext<T>): HTMLElement;
}

/**
 * Toolbar group interface
 */
export interface ToolbarGroup<T extends PluginStateData = PluginStateData> {
  /**
   * Group identifier
   */
  id: string;

  /**
   * Group label
   */
  label: string;

  /**
   * Display priority
   */
  priority?: number;

  /**
   * Group items
   */
  items: ToolbarItem<T>[];

  /**
   * Check if group is visible
   */
  isVisible?(context: ToolbarContext<T>): boolean;
}

/**
 * Toolbar context interface
 */
export interface ToolbarContext<T extends PluginStateData = PluginStateData> extends PluginContext {
  /**
   * Plugin state manager
   */
  pluginState: PluginStateManager<T>;

  /**
   * Selected block ID
   */
  blockId?: string;

  /**
   * Selected block type
   */
  blockType?: string;

  /**
   * Block data
   */
  data?: unknown;

  /**
   * Selection range
   */
  range?: Range | null;

  /**
   * Block element
   */
  block?: HTMLElement | null;

  /**
   * Text formatting
   */
  format?: Record<string, boolean>;
}

/**
 * Toolbar plugin interface
 */
export interface ToolbarPlugin<T extends PluginStateData = PluginStateData> extends Plugin<T> {
  /**
   * Supported block types
   */
  supportedBlocks?: string[];

  /**
   * Toolbar position
   */
  position?: ToolbarPosition;

  /**
   * Toolbar groups
   */
  groups?: ToolbarGroup<T>[];

  /**
   * Toolbar items
   */
  items?: ToolbarItem<T>[];

  /**
   * Initialize toolbar
   */
  initializeToolbar?(context: ToolbarContext<T>): void;
}

/**
 * Toolbar options
 */
export interface ToolbarOptions {
  /**
   * Theme name
   */
  theme?: string;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Toolbar position
   */
  position?: ToolbarPositionConfig;

  /**
   * Toolbar size
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Toolbar orientation
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Expand on hover
   */
  expandOnHover?: boolean;

  /**
   * Animation options
   */
  animation?: {
    enabled?: boolean;
    type?: 'fade' | 'slide' | 'scale';
  };

  /**
   * Accessibility options
   */
  accessibility?: {
    keyboardNavigation?: boolean;
    ariaLabels?: {
      toolbar?: string;
      groups?: Record<string, string>;
    };
  };
}
