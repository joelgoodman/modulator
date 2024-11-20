import {
  BlockData,
  BlockEvent,
  ToolbarItem,
  ToolbarGroup,
  ToolbarConfig,
  ToolbarContext,
  ToolbarPosition,
  ToolbarState,
  ToolbarOptions,
  ToolbarEventType,
  StateManager,
  BaseRenderer,
} from '@modulator/types';

import { EventEmitter } from '@modulator/core';
import { BlockInteractionManager } from '@modulator/core';

import { ToolbarRegistry } from './ToolbarRegistry.js';
import { ToolbarButton, ButtonProps } from './ToolbarButton.js';
import styles from '../../styles/components/toolbar.module.css';

/**
 * Block-specific toolbar implementation
 */
export class BlockToolbar {
  readonly eventEmitter: EventEmitter;
  readonly stateManager: StateManager<BlockData>;
  readonly interactionManager: BlockInteractionManager;
  readonly renderer: BaseRenderer;

  private registry: ToolbarRegistry;
  private activeBlockId: string | undefined;
  private activeBlockType: string | undefined;
  private element: HTMLElement;
  private buttons: Map<string, ToolbarButton>;
  private position: { type: string; anchor: string };
  private context: ToolbarContext;
  private options: ToolbarOptions;

  constructor(
    stateManager: StateManager<BlockData>,
    interactionManager: BlockInteractionManager,
    renderer: BaseRenderer,
    options: ToolbarOptions = {}
  ) {
    this.eventEmitter = new EventEmitter();
    this.stateManager = stateManager;
    this.interactionManager = interactionManager;
    this.renderer = renderer;
    this.options = options;

    // Create an empty toolbar registry configuration
    const registryConfig: ToolbarConfig = {};

    this.registry = new ToolbarRegistry(registryConfig);

    this.buttons = new Map();

    // Explicitly type the position configuration
    this.position = {
      type: options.position?.type ?? ('floating' as const),
      anchor: options.position?.anchor ?? ('top' as const),
    };

    this.element = this.createToolbarElement();

    // Create a minimal context object that matches ToolbarContext interface
    this.context = {
      eventEmitter: this.eventEmitter,
      stateManager: this.stateManager,
      interactionManager: this.interactionManager,
      renderer: this.renderer,
      pluginState: {
        getState: () => ({}),
        setState: () => {},
        resetState: () => {},
        subscribe: () => () => {},
        get: () => undefined,
        set: () => {},
        persist: () => {},
        restore: () => {},
      },
      blockId: undefined,
      blockType: undefined,
      block: null,
      selection: null,
      range: null,
      format: {},
      metadata: {},
    };

    this.setupEventListeners();
    this.validateState();
  }

  /**
   * Get toolbar element
   */
  getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Set toolbar position
   */
  setPosition(position: { type: string; anchor: string }): void {
    this.position = position;
    this.validateState();
    this.updatePosition();
  }

  /**
   * Register a toolbar item
   */
  registerItem(item: ToolbarItem, groupId: string = 'default'): void {
    this.registry.registerItem(item, groupId);
    const buttonProps: ButtonProps = {
      item,
      context: this.getContext(),
    };
    const button = new ToolbarButton(buttonProps);
    this.buttons.set(item.id, button);
    this.element.appendChild(button.getElement());
    this.validateState();
  }

  /**
   * Register a toolbar group
   */
  registerGroup(group: ToolbarGroup): void {
    this.registry.registerGroup(group);
    this.validateState();
  }

  /**
   * Get toolbar state
   */
  getState(): ToolbarState {
    const state = this.registry.getState();
    const groups = this.registry.getGroups();
    return {
      isVisible: this.activeBlockId !== undefined,
      activeGroups: new Set(
        groups.filter(group => !state.groupStates.get(group.id)?.isCollapsed).map(group => group.id)
      ),
      activeItems: state.activeItems,
      disabledItems: state.disabledItems,
      hiddenItems: state.hiddenItems,
    };
  }

  /**
   * Get active block ID
   */
  getActiveBlockId(): string | undefined {
    return this.activeBlockId;
  }

  /**
   * Get active block type
   */
  getActiveBlockType(): string | undefined {
    return this.activeBlockType;
  }

  /**
   * Get visible items for current block
   */
  getVisibleItems(): ToolbarItem[] {
    if (!this.activeBlockType) return [];

    const state = this.registry.getState();
    return this.registry
      .getGroups()
      .flatMap(group => this.registry.getGroupItems(group.id))
      .filter(item => !state.hiddenItems.has(item.id));
  }

  /**
   * Get enabled items for current block
   */
  getEnabledItems(): ToolbarItem[] {
    if (!this.activeBlockType) return [];

    const state = this.registry.getState();
    return this.getVisibleItems().filter(item => !state.disabledItems.has(item.id));
  }

  /**
   * Get active items for current block
   */
  getActiveItems(): ToolbarItem[] {
    if (!this.activeBlockType) return [];

    const state = this.registry.getState();
    return this.getVisibleItems().filter(item => state.activeItems.has(item.id));
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
    this.registry.updateItemState(itemId, updates);
    this.validateState();
  }

  /**
   * Update group state
   */
  updateGroupState(
    groupId: string,
    updates: {
      isCollapsed?: boolean;
      isVisible?: boolean;
    }
  ): void {
    this.registry.updateGroupState(groupId, updates);
    this.validateState();
  }

  /**
   * Execute a toolbar command
   */
  executeCommand(command: string, data?: any): void {
    if (!this.activeBlockId) return;

    this.emitEvent('toolbar:command', this.activeBlockId, {
      command,
      data,
    });
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
    this.registry.clear();
    this.activeBlockId = undefined;
    this.activeBlockType = undefined;
    this.emitEvent('toolbar:cleared');
    this.validateState();
  }

  /**
   * Get current toolbar context
   */
  getContext(): ToolbarContext {
    return {
      ...this.context,
      blockId: this.activeBlockId,
      blockType: this.activeBlockType,
      block: this.activeBlockId ? document.getElementById(this.activeBlockId) : null,
    };
  }

  /**
   * Hide a toolbar item
   */
  hideItem(itemId: string): void {
    const item = this.registry.getItems().find(item => item.id === itemId);
    if (!item) return;

    this.registry.updateItemState(itemId, { isHidden: true });
  }

  private setupEventListeners(): void {
    // Handle window resize for floating toolbar
    if (this.position.type === 'floating') {
      window.addEventListener('resize', this.updatePosition.bind(this));
      document.addEventListener('scroll', this.updatePosition.bind(this));
    }

    // Subscribe to state changes
    this.stateManager.subscribe(state => {
      this.handleStateChanged(state);
    });
  }

  private handleStateChanged(state: any): void {
    // Update context with new state
    const selectedBlock = state.selectedBlock
      ? this.stateManager.getBlock(state.selectedBlock)
      : undefined;

    this.updateContext({
      blockId: state.selectedBlock,
      blockType: selectedBlock?.type,
      data: selectedBlock,
      format: selectedBlock?.format || {},
      metadata: selectedBlock?.metadata || {},
    });
  }

  private handleBlockSelected(event: BlockEvent): void {
    if (!event.data?.blockData) return;

    const blockData = event.data.blockData as BlockData;
    this.activeBlockId = event.blockId;
    this.activeBlockType = blockData.type;
    this.updateContext();
    this.updatePosition();
    this.emitEvent('toolbar:block:selected', event.blockId);
  }

  private handleBlockDeselected(): void {
    this.activeBlockId = undefined;
    this.activeBlockType = undefined;
    this.updateContext();
    this.element.setAttribute('data-visible', 'false');
  }

  private updateContext(updates: Partial<ToolbarContext> = {}): void {
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;

    this.context = {
      ...this.context,
      ...updates,
      blockId: this.activeBlockId,
      blockType: this.activeBlockType,
      block: this.activeBlockId ? document.getElementById(this.activeBlockId) : null,
      selection,
      range,
    };

    // Update all buttons with new context
    this.buttons.forEach(button => {
      button.setState({}); // Trigger state update with new context
    });
  }

  private createToolbarElement(): HTMLElement {
    const toolbar = document.createElement('div');
    toolbar.className = styles['modulator-toolbar'];
    toolbar.setAttribute('role', 'toolbar');
    toolbar.setAttribute(
      'aria-label',
      this.options.accessibility?.ariaLabels?.toolbar || 'Block formatting toolbar'
    );

    // Add theme class if provided
    if (this.options.theme) {
      toolbar.classList.add(`theme-${this.options.theme}`);
    }

    // Add size class if provided
    if (this.options.size) {
      toolbar.classList.add(`size-${this.options.size}`);
    }

    // Add orientation class if provided
    if (this.options.orientation) {
      toolbar.classList.add(`orientation-${this.options.orientation}`);
    }

    // Add keyboard navigation
    if (this.options.accessibility?.keyboardNavigation !== false) {
      toolbar.setAttribute('tabindex', '0');
      toolbar.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    // Create groups
    const groups = this.registry.getGroups();
    groups.sort((a, b) => (b.priority || 0) - (a.priority || 0));

    groups.forEach(group => {
      const groupElement = document.createElement('div');
      groupElement.className = styles['modulator-toolbar-group'];
      groupElement.setAttribute('role', 'group');
      groupElement.setAttribute('aria-label', group.name);

      if (this.options.accessibility?.ariaLabels?.groups?.[group.id]) {
        groupElement.setAttribute(
          'aria-label',
          this.options.accessibility.ariaLabels.groups[group.id]
        );
      }

      // Create buttons for group
      const items = this.registry.getGroupItems(group.id);
      items.sort((a, b) => (b.priority || 0) - (a.priority || 0));

      items.forEach(item => {
        const buttonProps: ButtonProps = {
          item,
          context: this.context,
        };
        const button = new ToolbarButton(buttonProps);
        this.buttons.set(item.id, button);
        groupElement.appendChild(button.getElement());

        // Add shortcut hint
        if (item.shortcut) {
          const shortcutHint = document.createElement('div');
          shortcutHint.className = styles['modulator-toolbar-shortcut'];
          shortcutHint.setAttribute('aria-hidden', 'true');
          shortcutHint.textContent = item.shortcut;
          button.getElement().appendChild(shortcutHint);
        }

        // Add tooltip
        if (item.tooltip) {
          const tooltip = document.createElement('div');
          tooltip.className = styles['modulator-toolbar-tooltip'];
          tooltip.setAttribute('role', 'tooltip');
          tooltip.textContent = item.tooltip;
          button.getElement().setAttribute('aria-describedby', `tooltip-${item.id}`);
          tooltip.id = `tooltip-${item.id}`;
          button.getElement().appendChild(tooltip);
        }
      });

      // Add group to toolbar
      if (items.length > 0) {
        toolbar.appendChild(groupElement);
      }
    });

    // Add animation class if enabled
    if (this.options.animation?.enabled) {
      toolbar.classList.add(`animation-${this.options.animation.type || 'fade'}`);
    }

    // Add expand on hover
    if (this.options.expandOnHover) {
      toolbar.classList.add('expand-on-hover');
      toolbar.addEventListener('mouseenter', () => {
        toolbar.classList.add('expanded');
      });
      toolbar.addEventListener('mouseleave', () => {
        toolbar.classList.remove('expanded');
      });
    }

    return toolbar;
  }

  private updatePosition(): void {
    if (!this.activeBlockId) {
      this.element.style.display = 'none';
      return;
    }

    const block = document.getElementById(this.activeBlockId);
    if (!block) {
      this.element.style.display = 'none';
      return;
    }

    this.element.style.display = 'flex';
    this.element.setAttribute('data-visible', 'true');

    const blockRect = block.getBoundingClientRect();
    const toolbarRect = this.element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (this.position.type === 'floating') {
      const { anchor = 'top', offset = { x: 0, y: 0 } } = this.position;

      let top = 0;
      let left = 0;

      switch (anchor) {
        case 'top':
          top = blockRect.top - toolbarRect.height - 8;
          left = blockRect.left + (blockRect.width - toolbarRect.width) / 2;
          break;
        case 'bottom':
          top = blockRect.bottom + 8;
          left = blockRect.left + (blockRect.width - toolbarRect.width) / 2;
          break;
        case 'left':
          top = blockRect.top + (blockRect.height - toolbarRect.height) / 2;
          left = blockRect.left - toolbarRect.width - 8;
          break;
        case 'right':
          top = blockRect.top + (blockRect.height - toolbarRect.height) / 2;
          left = blockRect.right + 8;
          break;
        case 'top-left':
          top = blockRect.top - toolbarRect.height - 8;
          left = blockRect.left;
          break;
        case 'top-right':
          top = blockRect.top - toolbarRect.height - 8;
          left = blockRect.right - toolbarRect.width;
          break;
        case 'bottom-left':
          top = blockRect.bottom + 8;
          left = blockRect.left;
          break;
        case 'bottom-right':
          top = blockRect.bottom + 8;
          left = blockRect.right - toolbarRect.width;
          break;
      }

      // Apply offsets
      top += offset.y;
      left += offset.x;

      // Keep toolbar within viewport with smooth transitions
      const margin = 8;
      const maxTop = viewportHeight - toolbarRect.height - margin;
      const maxLeft = viewportWidth - toolbarRect.width - margin;

      // Smooth clamping with CSS transitions
      if (top < margin) {
        this.element.style.setProperty('--original-top', `${top}px`);
        top = margin;
        this.element.classList.add('clamp-top');
      } else if (top > maxTop) {
        this.element.style.setProperty('--original-top', `${top}px`);
        top = maxTop;
        this.element.classList.add('clamp-bottom');
      } else {
        this.element.classList.remove('clamp-top', 'clamp-bottom');
      }

      if (left < margin) {
        this.element.style.setProperty('--original-left', `${left}px`);
        left = margin;
        this.element.classList.add('clamp-left');
      } else if (left > maxLeft) {
        this.element.style.setProperty('--original-left', `${left}px`);
        left = maxLeft;
        this.element.classList.add('clamp-right');
      } else {
        this.element.classList.remove('clamp-left', 'clamp-right');
      }

      this.element.style.position = 'fixed';
      this.element.style.top = `${top}px`;
      this.element.style.left = `${left}px`;
    } else if (this.position.type === 'fixed') {
      const { anchor = 'top', offset = { x: 0, y: 0 } } = this.position;

      // Fixed positioning relative to viewport
      switch (anchor) {
        case 'top':
          this.element.style.top = `${offset.y}px`;
          this.element.style.left = '50%';
          this.element.style.transform = 'translateX(-50%)';
          break;
        case 'bottom':
          this.element.style.bottom = `${offset.y}px`;
          this.element.style.left = '50%';
          this.element.style.transform = 'translateX(-50%)';
          break;
        case 'left':
          this.element.style.left = `${offset.x}px`;
          this.element.style.top = '50%';
          this.element.style.transform = 'translateY(-50%)';
          break;
        case 'right':
          this.element.style.right = `${offset.x}px`;
          this.element.style.top = '50%';
          this.element.style.transform = 'translateY(-50%)';
          break;
      }

      this.element.style.position = 'fixed';
    } else if (this.position.type === 'inline') {
      const { offset = { x: 0, y: 0 } } = this.position;

      // Inline positioning within the block
      this.element.style.position = 'absolute';
      this.element.style.top = `${offset.y}px`;
      this.element.style.left = `${offset.x}px`;
      block.style.position = 'relative';
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const buttons = Array.from(this.buttons.values());
    const currentIndex = buttons.findIndex(
      button => button.getElement() === document.activeElement
    );

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        if (currentIndex > 0) {
          buttons[currentIndex - 1].getElement().focus();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (currentIndex < buttons.length - 1) {
          buttons[currentIndex + 1].getElement().focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        if (buttons.length > 0) {
          buttons[0].getElement().focus();
        }
        break;
      case 'End':
        event.preventDefault();
        if (buttons.length > 0) {
          buttons[buttons.length - 1].getElement().focus();
        }
        break;
    }
  }

  private emitEvent(type: string, blockId: string = '', data: Record<string, unknown> = {}): void {
    this.eventEmitter.emit({
      type: type as ToolbarEventType,
      blockId,
      data,
    });
  }

  /**
   * Validate toolbar state
   */
  private validateState(): void {
    const state = this.registry.getState();
    const items = this.registry.getItems();
    const groups = this.registry.getGroups();

    // Validate items
    items.forEach(item => {
      // Ensure item has a valid group
      const groupId = this.registry.getItemGroup(item.id);
      if (groupId && !groups.find(g => g.id === groupId)) {
        console.warn(`Item '${item.id}' belongs to non-existent group '${groupId}'`);
        this.registry.updateItemState(item.id, { isHidden: true });
      }

      // Check for duplicate IDs
      if (items.filter(i => i.id === item.id).length > 1) {
        console.error(`Duplicate item ID found: ${item.id}`);
      }

      // Validate item state
      if (state.activeItems.has(item.id) && state.disabledItems.has(item.id)) {
        console.warn(`Item '${item.id}' cannot be both active and disabled`);
        this.registry.updateItemState(item.id, { isActive: false });
      }

      // Validate keyboard shortcuts
      if (item.shortcut) {
        const keys = item.shortcut.toLowerCase().split('+');
        const validModifiers = ['ctrl', 'alt', 'shift', 'meta', '⌃', '⌥', '⇧', '⌘'];
        const hasValidKey = keys.some(k => !validModifiers.includes(k));
        if (!hasValidKey) {
          console.warn(`Item '${item.id}' has invalid shortcut: ${item.shortcut}`);
        }
      }
    });

    // Validate groups
    groups.forEach(group => {
      // Check for duplicate IDs
      if (groups.filter(g => g.id === group.id).length > 1) {
        console.error(`Duplicate group ID found: ${group.id}`);
      }

      // Validate group state
      const groupState = state.groupStates.get(group.id);
      if (groupState?.isCollapsed && groupState?.isVisible) {
        console.warn(`Group '${group.id}' cannot be both collapsed and visible`);
        this.registry.updateGroupState(group.id, { isCollapsed: false });
      }
    });

    // Validate position
    if (this.position.type === 'floating') {
      const validAnchors = [
        'top',
        'bottom',
        'left',
        'right',
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ];
      if (this.position.anchor && !validAnchors.includes(this.position.anchor)) {
        console.warn(`Invalid anchor position: ${this.position.anchor}`);
        this.position.anchor = 'top';
      }
    }

    // Validate accessibility
    if (this.options.accessibility?.keyboardNavigation) {
      const focusableButtons = Array.from(
        this.element.querySelectorAll<HTMLButtonElement>(
          '.modulator-toolbar-button:not([disabled])'
        )
      );
      if (focusableButtons.length === 0) {
        console.warn('No focusable buttons found in toolbar');
      }
    }
  }
}
