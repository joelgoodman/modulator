import {
  ToolbarContext,
  ToolbarItem,
  ToolbarGroup,
  ToolbarOptions,
  ToolbarPosition,
  ToolbarPluginContext,
} from '@modulator/types';
import { EventEmitter } from '@modulator/core';

/**
 * Block-specific toolbar configuration
 */
export interface BlockToolbarConfig {
  /**
   * Unique identifier for the block type
   */
  blockType: string;

  /**
   * Custom toolbar groups for this block type
   */
  groups?: ToolbarGroup[];

  /**
   * Custom toolbar items
   */
  items?: ToolbarItem[];

  /**
   * Toolbar rendering options
   */
  options?: Partial<ToolbarOptions>;

  /**
   * Context transformation function
   * Allows adding block-specific context information
   */
  transformContext?: (baseContext: ToolbarContext) => ToolbarContext;

  /**
   * Toolbar visibility conditions
   */
  visibility?: {
    /**
     * Determine if toolbar should be shown
     */
    shouldShow?: (context: ToolbarContext) => boolean;

    /**
     * Minimum selection length to show toolbar
     */
    minSelectionLength?: number;
  };

  /**
   * Keyboard shortcuts for toolbar actions
   */
  shortcuts?: {
    /**
     * Custom keyboard shortcuts
     */
    [key: string]: string;
  };

  /**
   * Toolbar position configuration
   */
  position?: ToolbarPosition;
}

/**
 * Block Toolbar Interface
 * Provides a standardized way to create and manage block-specific toolbars
 */
export interface BlockToolbarInterface {
  /**
   * Register a new block-specific toolbar configuration
   */
  registerBlockToolbar(config: BlockToolbarConfig): void;

  /**
   * Get toolbar configuration for a specific block type
   */
  getBlockToolbarConfig(blockType: string): BlockToolbarConfig | undefined;

  /**
   * Create a toolbar for a specific block
   */
  createToolbar(context: ToolbarContext): HTMLElement;

  /**
   * Update an existing toolbar
   */
  updateToolbar(toolbar: HTMLElement, context: ToolbarContext): void;

  /**
   * Remove a block toolbar configuration
   */
  unregisterBlockToolbar(blockType: string): void;
}

/**
 * Default implementation of BlockToolbarInterface
 */
export class DefaultBlockToolbarManager implements BlockToolbarInterface {
  private blockToolbars: Map<string, BlockToolbarConfig> = new Map();

  registerBlockToolbar(config: BlockToolbarConfig): void {
    this.blockToolbars.set(config.blockType, config);
  }

  getBlockToolbarConfig(blockType: string): BlockToolbarConfig | undefined {
    return this.blockToolbars.get(blockType);
  }

  createToolbar(context: ToolbarContext): HTMLElement {
    const blockType = context.blockType;
    if (!blockType) {
      throw new Error('Block type is required to create toolbar');
    }

    const config = this.getBlockToolbarConfig(blockType);
    if (!config) {
      throw new Error(`No toolbar configuration found for block type: ${blockType}`);
    }

    // Transform context if a transformer is provided
    const transformedContext = config.transformContext ? config.transformContext(context) : context;

    // Check visibility conditions
    if (config.visibility?.shouldShow && !config.visibility.shouldShow(transformedContext)) {
      throw new Error('Toolbar not visible for current context');
    }

    // Create toolbar element
    const toolbar = document.createElement('div');
    toolbar.className = 'block-toolbar';
    toolbar.setAttribute('data-block-type', blockType);

    // Render groups and items
    const groups = config.groups ?? [];
    const items = config.items ?? [];

    groups.forEach(group => {
      const groupEl = document.createElement('div');
      groupEl.className = 'toolbar-group';
      groupEl.setAttribute('data-group-id', group.id);

      const groupItems = items.filter(item => item.group === group.id);
      groupItems.forEach(item => {
        const button = this.createToolbarButton(item, transformedContext);
        groupEl.appendChild(button);
      });

      toolbar.appendChild(groupEl);
    });

    return toolbar;
  }

  updateToolbar(toolbar: HTMLElement, context: ToolbarContext): void {
    const blockType = toolbar.getAttribute('data-block-type');
    if (!blockType) {
      throw new Error('Invalid toolbar: no block type found');
    }

    const config = this.getBlockToolbarConfig(blockType);
    if (!config) {
      throw new Error(`No toolbar configuration found for block type: ${blockType}`);
    }

    // Update button states
    const buttons = toolbar.querySelectorAll('button');
    buttons.forEach(button => {
      const itemId = button.getAttribute('data-item-id');
      const item = config.items?.find(i => i.id === itemId);

      if (item) {
        // Update button state based on current context
        button.disabled = item.isDisabled?.(context) ?? false;
        button.classList.toggle('active', item.isActive?.(context) ?? false);
      }
    });
  }

  unregisterBlockToolbar(blockType: string): void {
    this.blockToolbars.delete(blockType);
  }

  private createToolbarButton(item: ToolbarItem, context: ToolbarContext): HTMLButtonElement {
    const button = document.createElement('button');
    button.className = 'toolbar-button';
    button.innerHTML = item.icon;
    button.setAttribute('title', item.tooltip ?? item.label);
    button.setAttribute('data-item-id', item.id);

    // Set initial state
    button.disabled = item.isDisabled?.(context) ?? false;
    button.classList.toggle('active', item.isActive?.(context) ?? false);

    button.addEventListener('click', () => item.onClick(context));

    return button;
  }
}

// Singleton instance for global toolbar management
export const BlockToolbarManager = new DefaultBlockToolbarManager();
