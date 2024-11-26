/**
 * @fileoverview Toolbar Plugin System Types
 * @module @modulator/types/plugins/toolbar
 * @remarks
 * Defines comprehensive types and interfaces for creating 
 * flexible, configurable toolbars in the modulator system.
 * Supports advanced positioning, event handling, and customization.
 */

import type { PluginStateManager, PluginStateData } from './plugin.js';

/**
 * Valid positions for a toolbar
 * @remarks
 * Defines all possible positions where a toolbar can be rendered:
 * - 'top'/'bottom': Fixed to container edges
 * - 'left'/'right': Fixed to container sides
 * - 'inline': Flows with content
 * - 'floating': Follows selection/cursor
 * - 'fixed': Absolute position
 */
export type ToolbarPositionType =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'inline'
  | 'floating'
  | 'fixed';

/**
 * Constant object containing all valid toolbar positions
 * @remarks
 * Use these constants instead of string literals for type safety
 * @example
 * ```typescript
 * position: ToolbarPosition.FLOATING
 * ```
 */
export const ToolbarPosition = {
  TOP: 'top' as const,
  BOTTOM: 'bottom' as const,
  LEFT: 'left' as const,
  RIGHT: 'right' as const,
  INLINE: 'inline' as const,
  FLOATING: 'floating' as const,
  FIXED: 'fixed' as const,
} as const;

/**
 * Configuration for toolbar positioning
 * @remarks
 * Provides fine-grained control over toolbar placement and behavior
 * @example
 * ```typescript
 * const config: ToolbarPositionConfig = {
 *   type: 'floating',
 *   anchor: 'top-right',
 *   offset: { x: 10, y: 10 }
 * };
 * ```
 */
export interface ToolbarPositionConfig {
  /**
   * Basic position strategy
   * @remarks Determines the primary positioning of the toolbar
   */
  type: ToolbarPositionType;

  /**
   * Anchor point for floating/fixed positions
   * @remarks Only applicable when type is 'floating' or 'fixed'
   * Provides precise control over positioning relative to an element
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
   * Fine-tune position with pixel offsets
   * @remarks Allows pixel-perfect positioning adjustments
   */
  offset?: {
    /** Horizontal offset in pixels */
    x: number;
    /** Vertical offset in pixels */
    y: number;
  };
}

/**
 * Individual toolbar item configuration
 * @template T - Plugin state data type
 * @remarks
 * Defines a clickable item in the toolbar with its appearance and behavior
 * @example
 * ```typescript
 * const item: ToolbarItem = {
 *   id: 'bold-action',
 *   icon: 'bold-icon.svg',
 *   label: 'Bold',
 *   tooltip: 'Make text bold',
 *   action: (context) => context.applyFormat('bold')
 * };
 * ```
 */
export interface ToolbarItem<T extends PluginStateData = PluginStateData> {
  /** Unique identifier for the item */
  id: string;

  /** Icon to display (can be a URL or icon identifier) */
  icon: string;

  /** Text label for the item */
  label: string;

  /** Hover tooltip text */
  tooltip?: string;

  /** 
   * Determines if the item should be visible
   * @param context - Current toolbar context
   * @returns Whether the item should be displayed
   */
  isVisible?(context: ToolbarContext<T>): boolean;

  /** 
   * Action to perform when the item is activated
   * @param context - Current toolbar context
   */
  action?(context: ToolbarContext<T>): void;

  /** 
   * Optional state that can be used to disable or modify the item 
   * @param context - Current toolbar context
   * @returns Whether the item is enabled
   */
  isEnabled?(context: ToolbarContext<T>): boolean;
}

/**
 * Group of related toolbar items
 * @template T - Plugin state data type
 * @remarks
 * Used to organize toolbar items into logical sections
 * @example
 * ```typescript
 * const formattingGroup: ToolbarGroup = {
 *   id: 'text-formatting',
 *   label: 'Text Formatting',
 *   priority: 1,
 *   items: [boldItem, italicItem, underlineItem]
 * };
 * ```
 */
export interface ToolbarGroup<T extends PluginStateData = PluginStateData> {
  /** Unique identifier for the group */
  id: string;

  /** Display label for the group */
  label: string;

  /** 
   * Priority determines the order of groups in the toolbar
   * Lower numbers appear first
   */
  priority?: number;

  /** List of toolbar items in this group */
  items: ToolbarItem<T>[];

  /** 
   * Determines if the group should be shown
   * @param context - Current toolbar context
   * @returns Whether the group should be displayed
   */
  isVisible?(context: ToolbarContext<T>): boolean;
}

/**
 * Context provided to toolbar items and groups
 * @template T - Plugin state data type
 * @remarks
 * Contains all necessary information for toolbar items to make decisions and perform actions
 * @example
 * ```typescript
 * function handleBoldAction(context: ToolbarContext) {
 *   if (context.format?.bold) {
 *     context.pluginState.removeFormat('bold');
 *   } else {
 *     context.pluginState.applyFormat('bold');
 *   }
 * }
 * ```
 */
export interface ToolbarContext<T extends PluginStateData = PluginStateData> {
  /** Current plugin state manager */
  pluginState: PluginStateManager<T>;

  /** ID of the current block, if applicable */
  blockId?: string;

  /** Type of the current block, if applicable */
  blockType?: string;

  /** Additional contextual data */
  data?: unknown;

  /** Current text selection range */
  range?: Range | null;

  /** Reference to the current block element */
  block?: HTMLElement | null;

  /** Current text formatting state */
  format?: Record<string, boolean>;
}

/**
 * Toolbar plugin interface
 * @template T - Plugin state data type
 * @remarks
 * Defines the contract for plugins that provide toolbar functionality
 * @example
 * ```typescript
 * const formattingToolbar: ToolbarPlugin = {
 *   supportedBlocks: ['text', 'paragraph'],
 *   position: 'floating',
 *   groups: [formattingGroup],
 *   initializeToolbar: (context) => {
 *     // Setup toolbar-specific logic
 *   }
 * };
 * ```
 */
export interface ToolbarPlugin<T extends PluginStateData = PluginStateData> {
  /** Block types this toolbar supports */
  supportedBlocks?: string[];

  /** Default positioning for the toolbar */
  position?: ToolbarPositionType;

  /** Toolbar groups to be rendered */
  groups?: ToolbarGroup<T>[];

  /** Individual toolbar items */
  items?: ToolbarItem<T>[];

  /** 
   * Initialize the toolbar with a given context
   * @param context - Toolbar initialization context
   */
  initializeToolbar(context: ToolbarContext<T>): void;
}

/**
 * Comprehensive toolbar configuration options
 * @remarks
 * Provides extensive customization for toolbar appearance and behavior
 * @example
 * ```typescript
 * const toolbarOptions: ToolbarOptions = {
 *   theme: 'dark',
 *   position: { type: 'floating', anchor: 'top-right' },
 *   size: 'medium',
 *   accessibility: {
 *     keyboardNavigation: true,
 *     ariaLabels: { toolbar: 'Main Toolbar' }
 *   }
 * };
 * ```
 */
export interface ToolbarOptions {
  /** Custom theme identifier */
  theme?: string;

  /** Additional CSS class names */
  className?: string;

  /** Positioning configuration */
  position?: ToolbarPositionConfig;

  /** Size of toolbar items */
  size?: 'small' | 'medium' | 'large';

  /** Toolbar layout orientation */
  orientation?: 'horizontal' | 'vertical';

  /** Whether to expand toolbar on hover */
  expandOnHover?: boolean;

  /** Animation configuration */
  animation?: {
    /** Whether animations are enabled */
    enabled?: boolean;
    /** Type of animation */
    type?: 'fade' | 'slide' | 'scale';
  };

  /** Whether the toolbar is enabled */
  enabled?: boolean;

  /** Accessibility configuration */
  accessibility?: {
    /** Enable keyboard navigation */
    keyboardNavigation?: boolean;
    /** Custom ARIA labels */
    ariaLabels?: {
      /** Toolbar's main ARIA label */
      toolbar?: string;
      /** ARIA labels for specific groups */
      groups?: Record<string, string>;
    };
  };
}

/**
 * Event types emitted by toolbar components
 * @remarks
 * Defines all possible events that can be emitted by toolbar-related components
 */
export type ToolbarEventType =
  | 'toolbar:item-click'
  | 'toolbar:group-toggle'
  | 'toolbar:visibility-change'
  | 'toolbar:position-change';

/**
 * Structure of toolbar events
 * @remarks
 * Standardizes the shape of all toolbar-related events
 * @example
 * ```typescript
 * const event: ToolbarEvent = {
 *   type: 'toolbar:item-click',
 *   data: {
 *     itemId: 'bold-action',
 *     groupId: 'text-formatting'
 *   }
 * };
 * ```
 */
export interface ToolbarEvent {
  /** Type of toolbar event */
  type: ToolbarEventType;

  /** Event-specific data */
  data: {
    /** ID of the affected toolbar item, if applicable */
    itemId?: string;

    /** ID of the affected toolbar group, if applicable */
    groupId?: string;

    /** Any additional updates to be applied */
    updates?: Record<string, unknown>;
  };
}

/**
 * Current state of a toolbar group
 * @remarks
 * Tracks visibility and collapse state of toolbar groups
 */
export interface ToolbarGroupState {
  /** Whether the group is currently visible */
  isVisible: boolean;

  /** Whether the group is collapsed */
  isCollapsed: boolean;
}

/**
 * Configuration for initializing a toolbar
 * @remarks
 * Used when creating new toolbar instances
 * @example
 * ```typescript
 * const config: ToolbarConfig = {
 *   groups: [formattingGroup, insertGroup],
 *   items: [additionalItems]
 * };
 * ```
 */
export interface ToolbarConfig {
  /** Predefined toolbar groups */
  groups?: ToolbarGroup[];

  /** Additional toolbar items */
  items?: ToolbarItem[];
}
