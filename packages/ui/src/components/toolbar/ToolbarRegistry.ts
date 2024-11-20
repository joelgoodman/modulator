import {
  ToolbarItem,
  ToolbarGroup,
  ToolbarConfig,
  ToolbarState,
  ToolbarEvent,
  ToolbarGroupState,
  EventEmitter,
} from '@modulator/types';

/**
 * Registry for toolbar items and groups
 */
export class ToolbarRegistry {
  private items: Map<string, ToolbarItem>;
  private groups: Map<string, ToolbarGroup>;
  private itemToGroup: Map<string, string>;
  private eventEmitter: EventEmitter<ToolbarEvent>;
  private state: ToolbarState;

  constructor(config: ToolbarConfig) {
    this.items = new Map();
    this.groups = new Map();
    this.itemToGroup = new Map();
    this.eventEmitter = new EventEmitter<ToolbarEvent>();

    this.state = {
      activeItems: new Set(),
      disabledItems: new Set(),
      hiddenItems: new Set(),
      groupStates: new Map(),
    };

    this.initializeFromConfig(config);
  }

  /**
   * Initialize registry from configuration
   */
  private initializeFromConfig(config: ToolbarConfig): void {
    // Register default group if not provided
    if (!config.groups?.length) {
      this.registerGroup({
        id: 'default',
        name: 'Default Group',
        position: 'left',
      });
    } else {
      config.groups.forEach(group => this.registerGroup(group));
    }

    // Register items
    config.items?.forEach(item => this.registerItem(item));
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
      isVisible: true,
      isCollapsed: false,
    });

    this.emitEvent('toolbar:group:registered', { groupId: group.id });
  }

  /**
   * Register a toolbar item
   */
  registerItem(item: ToolbarItem, groupId: string = 'default'): void {
    if (this.items.has(item.id)) {
      throw new Error(`Item '${item.id}' is already registered`);
    }

    if (!this.groups.has(groupId)) {
      throw new Error(`Group '${groupId}' does not exist`);
    }

    this.items.set(item.id, item);
    this.itemToGroup.set(item.id, groupId);
    this.emitEvent('toolbar:item:registered', { itemId: item.id });
  }

  /**
   * Get current toolbar state
   */
  getState(): ToolbarState {
    return this.state;
  }

  /**
   * Emit toolbar events
   */
  private emitEvent(type: ToolbarEvent['type'], data: Partial<ToolbarEvent['data']> = {}): void {
    this.eventEmitter.emit(type, { type, data });
  }

  /**
   * Get the group ID for an item
   */
  getItemGroup(itemId: string): string | undefined {
    return this.itemToGroup.get(itemId);
  }

  /**
   * Get all items
   */
  getItems(): ToolbarItem[] {
    return Array.from(this.items.values());
  }

  /**
   * Get all groups
   */
  getGroups(): ToolbarGroup[] {
    return Array.from(this.groups.values());
  }

  /**
   * Get items in a group
   */
  getGroupItems(groupId: string): ToolbarItem[] {
    const items: ToolbarItem[] = [];
    for (const [itemId, group] of this.itemToGroup.entries()) {
      if (group === groupId) {
        const item = this.items.get(itemId);
        if (item) items.push(item);
      }
    }
    return items.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  }

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
  ): void {
    if (!this.items.has(itemId)) {
      throw new Error(`Item '${itemId}' does not exist`);
    }

    const { isActive, isDisabled, isHidden } = updates;

    if (isActive !== undefined) {
      if (isActive) this.state.activeItems.add(itemId);
      else this.state.activeItems.delete(itemId);
    }

    if (isDisabled !== undefined) {
      if (isDisabled) this.state.disabledItems.add(itemId);
      else this.state.disabledItems.delete(itemId);
    }

    if (isHidden !== undefined) {
      if (isHidden) this.state.hiddenItems.add(itemId);
      else this.state.hiddenItems.delete(itemId);
    }

    this.emitEvent('toolbar:item:updated', { itemId, updates });
  }

  /**
   * Update group state
   */
  updateGroupState(groupId: string, updates: Partial<ToolbarGroupState>): void {
    const groupState = this.state.groupStates.get(groupId);
    if (!groupState) {
      throw new Error(`Group '${groupId}' does not exist`);
    }

    Object.assign(groupState, updates);
    this.emitEvent('toolbar:group:updated', { groupId, updates });
  }

  /**
   * Subscribe to events
   */
  subscribe(handler: (event: ToolbarEvent) => void): () => void {
    this.eventEmitter.on('*', handler);
    return () => this.eventEmitter.off('*', handler);
  }

  /**
   * Clear registry
   */
  clear(): void {
    this.items.clear();
    this.groups.clear();
    this.itemToGroup.clear();
    this.state.activeItems.clear();
    this.state.disabledItems.clear();
    this.state.hiddenItems.clear();
    this.state.groupStates.clear();
    this.emitEvent('toolbar:cleared', {});
  }
}
