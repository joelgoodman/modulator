import { Plugin, PluginContext, PluginStateManager, PluginStateData } from './plugin.js';

/**
 * Extended Plugin Context with plugin state
 */
export type ExtendedPluginContext<T extends PluginStateData = PluginStateData> = PluginContext & {
  pluginState: PluginStateManager<T>;
};

/**
 * Toolbar Context Interface
 * Provides comprehensive information about the current block and editor state
 */
export interface ToolbarContext<T extends PluginStateData = PluginStateData>
  extends ExtendedPluginContext<T> {
  /**
   * Unique identifier for the block
   */
  blockId?: string;

  /**
   * Type of the block (e.g., 'text', 'heading', 'list')
   */
  blockType?: string;

  /**
   * Raw block data
   */
  data?: unknown;

  /**
   * Current text selection
   */
  selection?: Selection | null;

  /**
   * Current text range
   */
  range?: Range | null;

  /**
   * Reference to the block's HTML element
   */
  block?: HTMLElement | null;

  /**
   * Current text formatting state
   */
  format?: Record<string, boolean>;

  /**
   * Additional metadata about the block or editor state
   */
  metadata?: Record<string, unknown>;
}

/**
 * Toolbar Item Interface
 * Defines a single action or control in the toolbar
 */
export interface ToolbarItem<T extends PluginStateData = PluginStateData> {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Icon to display
   */
  icon: string;

  /**
   * Label for the item
   */
  label: string;

  /**
   * Tooltip text
   */
  tooltip?: string;

  /**
   * Keyboard shortcut
   */
  shortcut?: string;

  /**
   * Group this item belongs to
   */
  group?: string;

  /**
   * Item priority (higher runs first)
   */
  priority?: number;

  /**
   * Check if item is active
   */
  isActive?: (context: ExtendedPluginContext<T>) => boolean;

  /**
   * Check if item is disabled
   */
  isDisabled?: (context: ExtendedPluginContext<T>) => boolean;

  /**
   * Check if item is visible
   */
  isVisible?: (context: ExtendedPluginContext<T>) => boolean;

  /**
   * Handle item click
   */
  onClick: (context: ExtendedPluginContext<T>) => void;

  /**
   * Custom render function
   */
  render?: (context: ExtendedPluginContext<T>) => HTMLElement;
}

/**
 * Toolbar Group Interface
 * Organizes toolbar items into logical groups
 */
export interface ToolbarGroup<T extends PluginStateData = PluginStateData> {
  /**
   * Unique identifier for the group
   */
  id: string;

  /**
   * Display label
   */
  label: string;

  /**
   * Group priority (higher runs first)
   */
  priority?: number;

  /**
   * Items in this group
   */
  items: ToolbarItem<T>[];

  /**
   * Check if group is visible
   */
  isVisible?: (context: ExtendedPluginContext<T>) => boolean;
}

/**
 * Toolbar Plugin Interface
 * Extends the base plugin interface with toolbar-specific functionality
 */
export interface ToolbarPlugin<T extends PluginStateData = PluginStateData> extends Plugin<T> {
  /**
   * Block types this plugin supports
   */
  supportedBlocks?: string[];

  /**
   * Toolbar groups provided by this plugin
   */
  groups?: ToolbarGroup<T>[];

  /**
   * Toolbar items provided by this plugin
   */
  items?: ToolbarItem<T>[];

  /**
   * Initialize toolbar-specific functionality
   */
  initializeToolbar?: (context: ToolbarPluginContext<T>) => void;
}

/**
 * Toolbar Plugin Context Interface
 * Extends the base plugin context with toolbar-specific functionality
 */
export interface ToolbarPluginContext<T extends PluginStateData = PluginStateData> {
  /**
   * Register a toolbar group
   */
  registerGroup(group: ToolbarGroup<T>): void;

  /**
   * Register a toolbar item
   */
  registerItem(item: ToolbarItem<T>): void;

  /**
   * Hide a toolbar item
   */
  hideItem(itemId: string): void;

  /**
   * Get toolbar context
   */
  getContext(): ToolbarContext<T>;
}

/**
 * Toolbar Positioning Options
 */
export interface ToolbarPosition {
  /**
   * Position type
   */
  type: 'fixed' | 'floating' | 'inline';

  /**
   * Anchor point for positioning
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
   * Offset from anchor point
   */
  offset?: {
    x: number;
    y: number;
  };
}

/**
 * Comprehensive Toolbar Options
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
   * Position configuration
   */
  position?: ToolbarPosition;

  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Orientation
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Expand on hover
   */
  expandOnHover?: boolean;

  /**
   * Animation configuration
   */
  animation?: {
    enabled?: boolean;
    type?: 'fade' | 'slide' | 'scale';
  };

  /**
   * Default groups configuration
   */
  defaultGroups?: {
    [key: string]: {
      label: string;
      priority: number;
      enabled: boolean;
    };
  };

  /**
   * Default items configuration
   */
  defaultItems?: {
    [key: string]: {
      group: string;
      label: string;
      shortcut?: string;
      enabled: boolean;
    };
  };

  /**
   * Custom groups configuration
   */
  customGroups?: {
    [key: string]: Partial<ToolbarGroup>;
  };

  /**
   * Custom items configuration
   */
  customItems?: {
    [key: string]: Partial<ToolbarItem>;
  };

  /**
   * Accessibility configuration
   */
  accessibility?: {
    /**
     * Enable keyboard navigation
     */
    keyboardNavigation?: boolean;

    /**
     * ARIA labels
     */
    ariaLabels?: {
      toolbar?: string;
      groups?: Record<string, string>;
    };
  };
}

/**
 * Toolbar Configuration Interface
 */
export interface ToolbarConfig {
  defaultGroups: {
    [key: string]: {
      label: string;
      priority: number;
      enabled: boolean;
    };
  };
  defaultItems: {
    [key: string]: {
      group: string;
      label: string;
      shortcut?: string;
      enabled: boolean;
    };
  };
  customGroups: {
    [key: string]: Partial<ToolbarGroup>;
  };
  customItems: {
    [key: string]: Partial<ToolbarItem>;
  };
}

/**
 * Toolbar Interaction Modes
 */
export enum ToolbarInteractionMode {
  HOVER = 'hover',
  CLICK = 'click',
  SELECTION = 'selection',
}

/**
 * Toolbar event types
 */
export type ToolbarEventType =
  | 'toolbar:item:registered'
  | 'toolbar:item:updated'
  | 'toolbar:item:removed'
  | 'toolbar:group:registered'
  | 'toolbar:group:updated'
  | 'toolbar:group:removed'
  | 'toolbar:cleared';

/**
 * Toolbar event data
 */
export interface ToolbarEventData {
  itemId?: string;
  groupId?: string;
  updates?: Record<string, unknown>;
}

/**
 * Toolbar event
 */
export interface ToolbarEvent {
  type: ToolbarEventType;
  data: ToolbarEventData;
}

/**
 * Toolbar group state
 */
export interface ToolbarGroupState {
  isCollapsed: boolean;
  isVisible: boolean;
}

/**
 * Toolbar state
 */
export interface ToolbarState {
  activeItems: Set<string>;
  disabledItems: Set<string>;
  hiddenItems: Set<string>;
  groupStates: Map<string, ToolbarGroupState>;
}

/**
 * Toolbar registry context
 */
export interface ToolbarRegistryContext {
  /**
   * Register a toolbar item
   */
  registerItem(item: ToolbarItem, groupId?: string): void;

  /**
   * Register a toolbar group
   */
  registerGroup(group: ToolbarGroup): void;

  /**
   * Get toolbar state
   */
  getState(): ToolbarState;

  /**
   * Get all items
   */
  getItems(): ToolbarItem[];

  /**
   * Get all groups
   */
  getGroups(): ToolbarGroup[];

  /**
   * Get items in a group
   */
  getGroupItems(groupId: string): ToolbarItem[];

  /**
   * Update item state
   */
  updateItemState(
    itemId: string,
    updates: {
      isActive?: boolean;
      isDisabled?: boolean;
      isHidden?: boolean;
    }
  ): void;

  /**
   * Update group state
   */
  updateGroupState(groupId: string, updates: Partial<ToolbarGroupState>): void;

  /**
   * Subscribe to events
   */
  subscribe(handler: (event: ToolbarEvent) => void): () => void;

  /**
   * Clear registry
   */
  clear(): void;
}
