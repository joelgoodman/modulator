/**
 * @fileoverview Defines the core types and interfaces for the Modulator toolbar system.
 * This module provides type definitions for toolbar items, groups, events, and state management.
 * 
 * @module UIToolbar
 * @packageDocumentation
 */

import type { BlockData } from '../blocks/types.js';
import type { StateManager } from '../core/state.js';
import type { BlockInteractionManager } from '../blocks/interaction.js';
import type { BaseRenderer } from '../blocks/renderer.js';
import type { EventEmitter } from '../core/types.js';
import type {
  Identifiable,
  Configurable,
  StateContainer,
  Observable,
  Serializable,
} from '../core/base.js';

/**
 * Constant definitions for all toolbar event types.
 * These events are used throughout the toolbar system for communication between components.
 * 
 * @constant
 */
export const ToolbarEventType = {
  // Item events
  /** Emitted when a toolbar item is clicked by the user */
  ITEM_CLICKED: 'toolbar:item:clicked',
  /** Emitted when a new toolbar item is registered in the system */
  ITEM_REGISTERED: 'toolbar:item:registered',
  /** Emitted when an existing toolbar item is updated */
  ITEM_UPDATED: 'toolbar:item:updated',
  /** Emitted when a toolbar item is removed from the system */
  ITEM_REMOVED: 'toolbar:item:removed',

  // Group events
  /** Emitted when a new toolbar group is registered */
  GROUP_REGISTERED: 'toolbar:group:registered',
  /** Emitted when an existing toolbar group is updated */
  GROUP_UPDATED: 'toolbar:group:updated',
  /** Emitted when a toolbar group is removed */
  GROUP_REMOVED: 'toolbar:group:removed',
  /** Emitted when a toolbar group is collapsed */
  GROUP_COLLAPSED: 'toolbar:group:collapsed',
  /** Emitted when a toolbar group is expanded */
  GROUP_EXPANDED: 'toolbar:group:expanded',

  // State events
  /** Emitted when the toolbar state changes */
  STATE_CHANGED: 'toolbar:state:changed',
} as const;

/**
 * Interface defining the payload types for all toolbar events.
 * This ensures type safety when emitting and handling toolbar events.
 * 
 * @interface
 * @extends {Record<string, unknown>}
 */
export interface ToolbarEvents extends Record<string, unknown> {
  [ToolbarEventType.ITEM_CLICKED]: {
    /** ID of the clicked item */
    itemId: string;
    /** Optional ID of the associated block */
    blockId?: string;
  };
  [ToolbarEventType.ITEM_REGISTERED]: {
    /** The newly registered toolbar item */
    item: ToolbarItem;
  };
  [ToolbarEventType.ITEM_UPDATED]: {
    /** ID of the updated item */
    itemId: string;
    /** Changes applied to the item */
    changes: Partial<ToolbarItem>;
  };
  [ToolbarEventType.ITEM_REMOVED]: {
    /** ID of the removed item */
    itemId: string;
  };
  [ToolbarEventType.GROUP_REGISTERED]: {
    /** The newly registered toolbar group */
    group: ToolbarGroup;
  };
  [ToolbarEventType.GROUP_UPDATED]: {
    /** ID of the updated group */
    groupId: string;
    /** Changes applied to the group */
    changes: Partial<ToolbarGroup>;
  };
  [ToolbarEventType.GROUP_REMOVED]: {
    /** ID of the removed group */
    groupId: string;
  };
  [ToolbarEventType.GROUP_COLLAPSED]: {
    /** ID of the collapsed group */
    groupId: string;
  };
  [ToolbarEventType.GROUP_EXPANDED]: {
    /** ID of the expanded group */
    groupId: string;
  };
  [ToolbarEventType.STATE_CHANGED]: {
    /** New toolbar state */
    state: ToolbarStateData;
  };
  [key: string]: unknown;
}

/**
 * Interface representing a single toolbar event.
 * Used for handling and dispatching toolbar-related events.
 * 
 * @interface
 */
export interface ToolbarEvent {
  /** Type of the toolbar event */
  type: keyof typeof ToolbarEventType;
  /** ID of the block associated with the event */
  blockId: string;
  /** Optional additional event data */
  data?: Record<string, unknown>;
}

/**
 * Base interface for toolbar group state.
 * Defines the core properties that all toolbar group states must have.
 * 
 * @interface
 */
export interface BaseToolbarGroupState {
  /** Whether the group is currently collapsed */
  isCollapsed: boolean;
  /** Whether the group is currently visible */
  isVisible: boolean;
}

/**
 * Type definition for serializable toolbar group state.
 * Ensures that group state can be properly serialized for storage or transmission.
 * 
 * @type
 */
export type SerializableToolbarGroupState = Serializable<BaseToolbarGroupState>;

/**
 * Interface for toolbar group state that extends the base state.
 * Can be extended with additional properties specific to group state management.
 * 
 * @interface
 * @extends {BaseToolbarGroupState}
 */
export interface ToolbarGroupState extends BaseToolbarGroupState {}

/**
 * Base interface for toolbar state data.
 * Defines the core data structure for managing toolbar state.
 * 
 * @interface
 */
export interface BaseToolbarStateData {
  /** Array of currently active toolbar item IDs */
  activeItems: string[];
  /** Array of currently disabled toolbar item IDs */
  disabledItems: string[];
  /** Array of currently hidden toolbar item IDs */
  hiddenItems: string[];
  /** Record of toolbar group states indexed by group ID */
  groupStates: Record<string, ToolbarGroupState>;
}

/**
 * Type definition for serializable toolbar state data.
 * Ensures that toolbar state can be properly serialized for storage or transmission.
 * 
 * @type
 */
export type SerializableToolbarStateData = Serializable<BaseToolbarStateData>;

/**
 * Interface for toolbar state data that extends the base state data.
 * Can be extended with additional properties specific to toolbar state management.
 * 
 * @interface
 * @extends {BaseToolbarStateData}
 */
export interface ToolbarStateData extends BaseToolbarStateData {}

/**
 * Interface for managing toolbar state.
 * Provides methods and properties for toolbar state management.
 * 
 * @interface
 * @extends {StateContainer<ToolbarStateData>}
 */
export interface ToolbarState extends StateContainer<ToolbarStateData> {
  /** Set of currently active toolbar item IDs */
  activeItems: Set<string>;
  /** Set of currently disabled toolbar item IDs */
  disabledItems: Set<string>;
  /** Set of currently hidden toolbar item IDs */
  hiddenItems: Set<string>;
  /** Map of toolbar group states indexed by group ID */
  groupStates: Map<string, ToolbarGroupState>;
}

/**
 * Interface for toolbar item configuration.
 * Defines the structure and properties of a toolbar item.
 * 
 * @interface
 * @extends {Identifiable}
 */
export interface ToolbarItem extends Identifiable {
  /** Display label for the toolbar item */
  label: string;
  /** Icon or visual representation of the item */
  icon?: string;
  /** Tooltip text for the item */
  tooltip?: string;
  /** Group ID this item belongs to */
  group?: string;
  /** Item's position within its group */
  position?: number;
  /** Whether the item is currently active */
  isActive?: boolean;
  /** Whether the item is currently disabled */
  isDisabled?: boolean;
  /** Whether the item is currently hidden */
  isHidden?: boolean;
  /** Custom CSS classes for the item */
  className?: string;
  /** Additional metadata for the item */
  metadata?: Record<string, unknown>;
}

/**
 * Interface for toolbar group configuration.
 * Defines the structure and properties of a toolbar group.
 * 
 * @interface
 * @extends {Identifiable}
 */
export interface ToolbarGroup extends Identifiable {
  /** Display label for the group */
  label: string;
  /** Icon or visual representation of the group */
  icon?: string;
  /** Tooltip text for the group */
  tooltip?: string;
  /** Group's position in the toolbar */
  position?: number;
  /** Whether the group is collapsible */
  collapsible?: boolean;
  /** Whether the group is collapsed by default */
  defaultCollapsed?: boolean;
}

/**
 * Interface for toolbar context.
 * Provides access to all necessary functionality and state for toolbar operations.
 * 
 * @interface
 */
export interface ToolbarContext {
  /** Event emitter for toolbar-specific events */
  eventEmitter: EventEmitter<ToolbarEvents>;
  /** State manager for block data */
  stateManager: StateManager<BlockData>;
  /** Manager for block interactions */
  interactionManager: BlockInteractionManager;
  /** Renderer for block content */
  renderer: BaseRenderer;
  /** Plugin state management */
  pluginState: PluginState;
  /** Current block ID */
  blockId?: string;
  /** Current block type */
  blockType?: string;
  /** Current block element */
  block: HTMLElement | null;
  /** Current selection */
  selection: Selection | null;
  /** Current range */
  range: Range | null;
  /** Current format state */
  format: Record<string, boolean>;
  /** Additional metadata */
  metadata: Record<string, unknown>;
}

/**
 * Interface for plugin state management.
 * Defines methods for managing plugin state within the toolbar.
 * 
 * @interface
 */
export interface PluginState {
  /** Get the current state */
  getState(): Record<string, unknown>;
  /** Set a new state */
  setState(state: Record<string, unknown>): void;
  /** Update the current state */
  updateState(state: Record<string, unknown>): void;
  /** Reset the state to its initial value */
  resetState(): void;
  /** Save the current state */
  save(): void;
  /** Restore the saved state */
  restore(): void;
}

/**
 * Interface for block-specific toolbar configuration.
 * Defines configuration options for toolbars associated with specific blocks.
 * 
 * @interface
 * @extends {Configurable<BlockToolbarConfigOptions>}
 */
export interface BlockToolbarConfig extends Configurable<BlockToolbarConfigOptions> {
  /** Block type this toolbar configuration applies to */
  blockType: string;
  /** Items in this toolbar */
  items: ToolbarItem[];
  /** Groups in this toolbar */
  groups?: ToolbarGroup[];
  /** Position configuration for this toolbar */
  position?: ToolbarPosition;
}

/**
 * Interface for toolbar position configuration.
 * Defines how a toolbar should be positioned relative to its target.
 * 
 * @interface
 */
export interface ToolbarPosition {
  /** Position type */
  type: 'floating' | 'fixed' | 'inline';
  /** Anchor point for positioning */
  anchor?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  /** Position offset */
  offset?: {
    /** Horizontal offset */
    x: number;
    /** Vertical offset */
    y: number;
  };
}

/**
 * Interface for managing block-specific toolbars.
 * Provides methods for toolbar management and interaction.
 * 
 * @interface
 * @extends {Observable<Record<string, unknown>>}
 */
export interface BlockToolbarInterface extends Observable<Record<string, unknown>> {
  /** Register a new toolbar configuration */
  register(config: BlockToolbarConfig): void;
  /** Unregister a toolbar configuration */
  unregister(blockType: string): void;
  /** Get a toolbar configuration */
  get(blockType: string): BlockToolbarConfig | undefined;
  /** Update a toolbar configuration */
  update(blockType: string, config: Partial<BlockToolbarConfig>): void;
  /** Get all registered toolbar configurations */
  getAll(): BlockToolbarConfig[];
  /** Clear all toolbar configurations */
  clear(): void;
}

/**
 * Interface for block toolbar configuration options.
 * Defines additional configuration options for block toolbars.
 * 
 * @interface
 */
export interface BlockToolbarConfigOptions {
  /** Whether to show the toolbar */
  show?: boolean;
  /** Whether to enable the toolbar */
  enable?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Interface for toolbar configuration.
 * Defines configuration options for the toolbar.
 * 
 * @interface
 * @extends {Configurable<ToolbarConfigOptions>}
 */
export interface ToolbarConfig extends Configurable<ToolbarConfigOptions> {
  /** Default groups */
  defaultGroups?: Record<string, Partial<ToolbarGroup>>;
  /** Default items */
  defaultItems?: Record<string, Partial<ToolbarItem>>;
  /** Custom groups */
  customGroups?: Record<string, Partial<ToolbarGroup>>;
  /** Custom items */
  customItems?: Record<string, Partial<ToolbarItem>>;
}

/**
 * Interface for toolbar configuration options.
 * Defines additional configuration options for the toolbar.
 * 
 * @interface
 */
export interface ToolbarConfigOptions {
  /** Default groups */
  defaultGroups?: Record<string, Partial<ToolbarGroup>>;
  /** Default items */
  defaultItems?: Record<string, Partial<ToolbarItem>>;
  /** Custom groups */
  customGroups?: Record<string, Partial<ToolbarGroup>>;
  /** Custom items */
  customItems?: Record<string, Partial<ToolbarItem>>;
}

/**
 * Interface for toolbar options.
 * Defines options for customizing the toolbar.
 * 
 * @interface
 * @extends {Configurable<ToolbarOptionsConfig>}
 */
export interface ToolbarOptions extends Configurable<ToolbarOptionsConfig> {
  /** Position configuration */
  position?: ToolbarPosition;
  /** Default groups */
  defaultGroups?: Record<string, Partial<ToolbarGroup>>;
  /** Default items */
  defaultItems?: Record<string, Partial<ToolbarItem>>;
  /** Custom groups */
  customGroups?: Record<string, Partial<ToolbarGroup>>;
  /** Custom items */
  customItems?: Record<string, Partial<ToolbarItem>>;
  /** Animation configuration */
  animation?: ToolbarAnimation;
  /** Expand on hover */
  expandOnHover?: boolean;
  /** Accessibility configuration */
  accessibility?: ToolbarAccessibility;
}

/**
 * Interface for toolbar options configuration.
 * Defines additional configuration options for the toolbar.
 * 
 * @interface
 */
export interface ToolbarOptionsConfig {
  /** Position configuration */
  position?: ToolbarPosition;
  /** Animation configuration */
  animation?: ToolbarAnimation;
  /** Expand on hover */
  expandOnHover?: boolean;
  /** Accessibility configuration */
  accessibility?: ToolbarAccessibility;
}

/**
 * Interface for toolbar animation configuration.
 * Defines options for customizing toolbar animations.
 * 
 * @interface
 */
export interface ToolbarAnimation {
  /** Enable animations */
  enabled: boolean;
  /** Animation type */
  type?: 'fade' | 'slide' | 'scale';
}

/**
 * Interface for toolbar accessibility configuration.
 * Defines options for customizing toolbar accessibility.
 * 
 * @interface
 */
export interface ToolbarAccessibility {
  /** Enable keyboard navigation */
  keyboardNavigation?: boolean;
  /** ARIA labels */
  ariaLabels?: {
    /** Toolbar label */
    toolbar?: string;
    /** Group labels */
    groups?: Record<string, string>;
  };
}
