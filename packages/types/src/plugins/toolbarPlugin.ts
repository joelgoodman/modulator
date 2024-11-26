/**
 * @fileoverview Plugin-specific toolbar types and interfaces
 * @module @modulator/types/plugins/toolbar-plugin
 * @description
 * Defines types and interfaces for toolbar plugins, including state management,
 * synchronization, and event handling specific to toolbar functionality.
 */

import type { PluginStateData, PluginStateManager, Plugin, PluginContext } from './plugin.js';
import type { ToolbarItem, ToolbarGroup, ToolbarOptions, ToolbarState } from '../ui/toolbar.js';

/**
 * Toolbar plugin state data interface
 * @description Defines the structure of state data specific to toolbar plugins
 */
export interface ToolbarPluginState extends PluginStateData {
  /** Currently active toolbar items */
  activeItems: string[];
  /** Currently disabled toolbar items */
  disabledItems: string[];
  /** Currently hidden toolbar items */
  hiddenItems: string[];
  /** Custom toolbar item states */
  itemStates: Record<string, unknown>;
  /** Group visibility states */
  groupStates: Record<string, { isVisible: boolean; isCollapsed: boolean }>;
  /** Toolbar position and layout */
  layout: {
    position: ToolbarOptions['position'];
    /** Size of the toolbar */
    size?: 'small' | 'medium' | 'large';
    /** Orientation of the toolbar */
    orientation?: 'horizontal' | 'vertical';
  };
  /** Toolbar theme and styling */
  appearance: {
    theme: string;
    customClasses: string[];
    customStyles: Record<string, string>;
  };
  /** Accessibility settings */
  accessibility: {
    keyboardNavigation: boolean;
    ariaLabels: Record<string, string>;
  };
}

/**
 * Toolbar plugin synchronization events
 * @description Events emitted during toolbar state synchronization
 */
export interface ToolbarSyncEvents {
  'toolbar:sync:state': {
    source: string;
    state: Partial<ToolbarPluginState>;
  };
  'toolbar:sync:items': {
    source: string;
    items: ToolbarItem[];
  };
  'toolbar:sync:groups': {
    source: string;
    groups: ToolbarGroup[];
  };
  'toolbar:sync:layout': {
    source: string;
    layout: ToolbarPluginState['layout'];
  };
}

/**
 * Toolbar plugin context
 * @description Extended plugin context with toolbar-specific functionality
 */
export interface ToolbarPluginContext extends PluginContext {
  /** Toolbar state manager */
  toolbarState: ToolbarState;
  /** Toolbar-specific state manager */
  pluginState: PluginStateManager<ToolbarPluginState>;
}

/**
 * Toolbar plugin interface
 * @description Interface for plugins that provide toolbar functionality
 */
export interface ToolbarPlugin extends Plugin<ToolbarPluginState> {
  /** Toolbar-specific initialization */
  initializeToolbar(context: ToolbarPluginContext): Promise<void> | void;
  
  /** Synchronize toolbar state with other plugins */
  syncToolbarState(context: ToolbarPluginContext): Promise<void> | void;
  
  /** Handle toolbar state updates */
  handleToolbarUpdate(
    state: Partial<ToolbarPluginState>,
    context: ToolbarPluginContext
  ): Promise<void> | void;
  
  /** Custom toolbar item renderers */
  renderToolbarItem?(
    item: ToolbarItem,
    context: ToolbarPluginContext
  ): HTMLElement | null;
  
  /** Custom toolbar group renderers */
  renderToolbarGroup?(
    group: ToolbarGroup,
    context: ToolbarPluginContext
  ): HTMLElement | null;
}

/**
 * Toolbar plugin registry
 * @description Registry for managing toolbar plugins
 */
export interface ToolbarPluginRegistry {
  /** Register a new toolbar plugin */
  register(plugin: ToolbarPlugin): void;
  
  /** Unregister a toolbar plugin */
  unregister(pluginId: string): void;
  
  /** Get a registered toolbar plugin */
  get(pluginId: string): ToolbarPlugin | undefined;
  
  /** Get all registered toolbar plugins */
  getAll(): ToolbarPlugin[];
  
  /** Get toolbar plugins that support a specific block type */
  getForBlockType(blockType: string): ToolbarPlugin[];
}
