import {
  BlockEvent,
  ToolbarPlugin,
  ToolbarContext,
  ToolbarItem,
  ToolbarGroup,
  ToolbarConfig,
  ToolbarState,
  ToolbarPluginContext,
} from '@modulator/types';
import { EventEmitter } from '@modulator/core';

/**
 * Manages toolbar plugins and state
 */
export class ToolbarPluginManager implements ToolbarPluginContext {
  private plugins: Map<string, ToolbarPlugin>;
  private groups: Map<string, ToolbarGroup>;
  private items: Map<string, ToolbarItem>;
  private eventEmitter: EventEmitter;
  private context: ToolbarContext;
  private state: ToolbarState;

  constructor(config: ToolbarConfig = {}) {
    this.plugins = new Map();
    this.groups = new Map();
    this.items = new Map();
    this.eventEmitter = new EventEmitter();

    this.state = {
      activeItems: new Set(),
      disabledItems: new Set(),
      hiddenItems: new Set(),
      groupStates: new Map(),
    };

    this.context = {
      registerItem: this.registerItem.bind(this),
      registerGroup: this.registerGroup.bind(this),
      updateItem: this.updateItem.bind(this),
      updateGroup: this.updateGroup.bind(this),
      getState: this.getState.bind(this),
      emit: (event: BlockEvent) => this.eventEmitter.emit(event),
      on: (event: string, handler: (event: BlockEvent) => void) => {
        this.eventEmitter.on(event, handler);
      },
      off: (event: string, handler: (event: BlockEvent) => void) => {
        this.eventEmitter.off(event, handler);
      },
    };

    this.initializeDefaultGroups(config);
  }

  /**
   * Register a toolbar plugin
   */
  registerPlugin(plugin: ToolbarPlugin): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' is already registered`);
    }

    plugin.initialize?.(this.context);
    this.plugins.set(plugin.name, plugin);
    this.emitEvent('toolbar:plugin:registered', plugin.name);
  }

  /**
   * Register a toolbar item
   */
  registerItem(item: ToolbarItem): void {
    if (this.items.has(item.id)) {
      throw new Error(`Item '${item.id}' is already registered`);
    }

    this.items.set(item.id, item);
    this.emitEvent('toolbar:item:registered', item.id);
  }

  /**
   * Register a toolbar group
   */
  registerGroup(group: ToolbarGroup): void {
    if (this.groups.has(group.id)) {
      throw new Error(`Group '${group.id}' is already registered`);
    }

    this.groups.set(group.id, group);
    this.state.groupStates.set(group.id, {
      isCollapsed: group.defaultCollapsed ?? false,
      isVisible: true,
    });

    this.emitEvent('toolbar:group:registered', group.id);
  }

  /**
   * Update a toolbar item
   */
  updateItem(itemId: string, updates: Partial<ToolbarItem>): void {
    const item = this.items.get(itemId);
    if (!item) return;

    Object.assign(item, updates);
    this.emitEvent('toolbar:item:updated', itemId);
  }

  /**
   * Update a toolbar group
   */
  updateGroup(groupId: string, updates: Partial<ToolbarGroup>): void {
    const group = this.groups.get(groupId);
    if (!group) return;

    Object.assign(group, updates);
    this.emitEvent('toolbar:group:updated', groupId);
  }

  /**
   * Get toolbar state
   */
  getState(): ToolbarState {
    return {
      activeItems: new Set(this.state.activeItems),
      disabledItems: new Set(this.state.disabledItems),
      hiddenItems: new Set(this.state.hiddenItems),
      groupStates: new Map(this.state.groupStates),
    };
  }

  /**
   * Get all toolbar items
   */
  getAllItems(): ToolbarItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Get all toolbar groups
   */
  getAllGroups(): ToolbarGroup[] {
    return Array.from(this.groups.values());
  }

  /**
   * Subscribe to toolbar events
   */
  on(event: string, handler: (event: BlockEvent) => void): void {
    this.eventEmitter.on(event, handler);
  }

  /**
   * Unsubscribe from toolbar events
   */
  off(event: string, handler: (event: BlockEvent) => void): void {
    this.eventEmitter.off(event, handler);
  }

  /**
   * Clear toolbar state
   */
  clear(): void {
    this.plugins.clear();
    this.groups.clear();
    this.items.clear();
    this.state.activeItems.clear();
    this.state.disabledItems.clear();
    this.state.hiddenItems.clear();
    this.state.groupStates.clear();
    this.emitEvent('toolbar:cleared');
  }

  private initializeDefaultGroups(config: ToolbarConfig): void {
    const defaultGroups = config.groups || [
      { id: 'format', label: 'Text Formatting', order: 0 },
      { id: 'insert', label: 'Insert', order: 1 },
      { id: 'blocks', label: 'Blocks', order: 2 },
    ];

    defaultGroups.forEach(group => this.registerGroup(group));
  }

  private emitEvent(type: string, itemId: string = '', data: Record<string, unknown> = {}): void {
    this.eventEmitter.emit({
      type,
      blockId: '',
      data: {
        itemId,
        ...data,
      },
    });
  }
}
