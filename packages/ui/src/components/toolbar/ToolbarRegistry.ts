import {
  ToolbarItem,
  ToolbarGroup,
  ToolbarConfig,
  ToolbarRegistryContext,
  ToolbarState,
  ToolbarEvent,
  ToolbarGroupState,
} from '@modulator/types';
import { EventEmitter } from '@modulator/core';

interface GroupState {
  isCollapsed: boolean;
  isVisible: boolean;
}

/**
 * Registry for toolbar items and groups
 */
export class ToolbarRegistry implements ToolbarRegistryContext {
  private items: Map<string, ToolbarItem>;
  private groups: Map<string, ToolbarGroup>;
  private itemToGroup: Map<string, string>;
  private eventEmitter: EventEmitter;
  private state: {
    activeItems: Set<string>;
    disabledItems: Set<string>;
    hiddenItems: Set<string>;
    groupStates: Map<string, GroupState>;
  };

  constructor(config: ToolbarConfig) {
    this.items = new Map();
    this.groups = new Map();
    this.itemToGroup = new Map();
    this.eventEmitter = new EventEmitter();

    this.state = {
      activeItems: new Set(),
      disabledItems: new Set(),
      hiddenItems: new Set(),
      groupStates: new Map(),
    };

    this.initializeFromConfig(config);
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
   * Get the group ID for an item
   */
  getItemGroup(itemId: string): string | undefined {
    return this.itemToGroup.get(itemId);
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
      isCollapsed: false,
      isVisible: true,
    });

    this.emitEvent('toolbar:group:registered', { groupId: group.id });
  }

  /**
   * Get toolbar state
   */
  getState(): ToolbarState {
    return {
      activeItems: new Set(this.state.activeItems),
      disabledItems: new Set(this.state.disabledItems),
      hiddenItems: new Set(this.state.hiddenItems),
      groupStates: new Map(
        Array.from(this.state.groupStates.entries()).map(([id, state]) => [
          id,
          { ...state } as ToolbarGroupState,
        ])
      ),
    };
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
  updateGroupState(groupId: string, updates: Partial<GroupState>): void {
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

  private initializeFromConfig(config: ToolbarConfig): void {
    // Initialize default groups
    const defaultGroups = [
      {
        id: 'default',
        label: 'Default',
        priority: 0,
        items: [],
      },
      {
        id: 'formatting',
        label: 'Text Formatting',
        priority: 1,
        items: [],
      },
      {
        id: 'advanced',
        label: 'Advanced',
        priority: 2,
        items: [],
      },
    ];

    // Register default groups
    defaultGroups.forEach(group => {
      if (!this.groups.has(group.id)) {
        this.registerGroup(group);
      }
    });

    // Register custom groups
    if (config.customGroups) {
      Object.entries(config.customGroups).forEach(([id, group]) => {
        if (!this.groups.has(id)) {
          this.registerGroup({
            id,
            label: group.label || id,
            priority: group.priority || 0,
            items: group.items || [],
            isVisible: group.isVisible,
          });
        }
      });
    }

    // Register default items
    if (config.defaultItems) {
      Object.entries(config.defaultItems).forEach(([id, item]) => {
        if (!this.items.has(id)) {
          this.registerItem(
            {
              id,
              icon: '📝', // Default icon
              label: item.label,
              group: item.group,
              shortcut: item.shortcut,
              priority: 0,
              onClick: () => {}, // No-op default handler
              isActive: () => false,
              isDisabled: () => !item.enabled,
              isVisible: () => true,
            },
            item.group
          );
        }
      });
    }

    // Register custom items
    if (config.customItems) {
      Object.entries(config.customItems).forEach(([id, item]) => {
        if (!this.items.has(id)) {
          if (!item.icon || !item.onClick) {
            throw new Error(`Custom item '${id}' must have icon and onClick properties`);
          }
          this.registerItem(
            {
              id,
              ...item,
              priority: item.priority || 0,
              isActive: item.isActive || (() => false),
              isDisabled: item.isDisabled || (() => false),
              isVisible: item.isVisible || (() => true),
            } as ToolbarItem,
            item.group || 'default'
          );
        }
      });
    }
  }

  private emitEvent(type: string, data: Record<string, unknown>): void {
    this.eventEmitter.emit({
      type,
      data,
    });
  }
}
