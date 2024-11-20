import type { BlockData } from '../blocks/types.js';
import type { StateManager } from '../core/state.js';
import type { BlockInteractionManager } from '../blocks/interaction.js';
import type { BaseRenderer } from '../blocks/renderer.js';
import type { EventEmitter } from '../core/types.js';

/**
 * Toolbar event types
 */
export const ToolbarEvents = {
  // Item events
  ITEM_CLICKED: 'toolbar:item:clicked',
  ITEM_REGISTERED: 'toolbar:item:registered',
  ITEM_UPDATED: 'toolbar:item:updated',
  ITEM_REMOVED: 'toolbar:item:removed',

  // Group events
  GROUP_REGISTERED: 'toolbar:group:registered',
  GROUP_UPDATED: 'toolbar:group:updated',
  GROUP_REMOVED: 'toolbar:group:removed',

  // State events
  STATE_CHANGED: 'toolbar:state:changed',
} as const;

/**
 * Toolbar event interface
 */
export interface ToolbarEvent {
  type: keyof typeof ToolbarEvents;
  blockId: string;
  data?: Record<string, unknown>;
}

/**
 * Toolbar item configuration
 */
export interface ToolbarItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon markup or component */
  icon?: string;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Tooltip text */
  tooltip?: string;
  /** Priority for ordering (higher = earlier) */
  priority?: number;
  /** Click handler */
  onClick?: (context: ToolbarContext) => void;
  /** Active state check */
  isActive?: (context: ToolbarContext) => boolean;
  /** Disabled state check */
  isDisabled?: (context: ToolbarContext) => boolean;
  /** Visibility check */
  isVisible?: (context: ToolbarContext) => boolean;
}

/**
 * Toolbar group configuration
 */
export interface ToolbarGroup {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Priority for ordering (higher = earlier) */
  priority?: number;
  /** Default collapsed state */
  defaultCollapsed?: boolean;
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
  /** Currently active items */
  activeItems: Set<string>;
  /** Currently disabled items */
  disabledItems: Set<string>;
  /** Currently hidden items */
  hiddenItems: Set<string>;
  /** Group states */
  groupStates: Map<string, ToolbarGroupState>;
}

/**
 * Toolbar position configuration
 */
export interface ToolbarPosition {
  /** Position type */
  type: 'floating' | 'fixed' | 'inline';
  /** Anchor point */
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
    x: number;
    y: number;
  };
}

/**
 * Plugin state management
 */
export interface PluginState {
  getState: () => Record<string, unknown>;
  setState: (state: Record<string, unknown>) => void;
  resetState: () => void;
  subscribe: (handler: (state: Record<string, unknown>) => void) => () => void;
  get: (key: string) => unknown;
  set: (key: string, value: unknown) => void;
  persist: () => void;
  restore: () => void;
}

/**
 * Toolbar context for items and plugins
 */
export interface ToolbarContext {
  /** Event emitter */
  eventEmitter: EventEmitter;
  /** State manager */
  stateManager: StateManager<BlockData>;
  /** Interaction manager */
  interactionManager: BlockInteractionManager;
  /** Renderer */
  renderer: BaseRenderer;
  /** Plugin state */
  pluginState: PluginState;
  /** Active block ID */
  blockId?: string;
  /** Active block type */
  blockType?: string;
  /** Active block element */
  block: HTMLElement | null;
  /** Current selection */
  selection: Selection | null;
  /** Current range */
  range: Range | null;
  /** Current format state */
  format: Record<string, boolean>;
  /** Current metadata */
  metadata: Record<string, unknown>;
}

/**
 * Toolbar configuration
 */
export interface ToolbarConfig {
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
 * Animation configuration
 */
export interface ToolbarAnimation {
  /** Enable animations */
  enabled: boolean;
  /** Animation type */
  type?: 'fade' | 'slide' | 'scale';
}

/**
 * Accessibility configuration
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

/**
 * Toolbar options
 */
export interface ToolbarOptions {
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
