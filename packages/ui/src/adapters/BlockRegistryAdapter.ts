import {
  BlockType,
  BlockData,
  BlockConfig,
  BlockValidationResult,
  BlockManagerContext,
  ToolbarItem,
  ToolbarGroup,
  ToolbarContext,
  Block,
  Position,
} from '@modulator/types';
import { BlockManager, BlockRegistry } from '@modulator/core';
import { ToolbarRegistry } from '../components/toolbar/ToolbarRegistry.js';

/**
 * Adapter for block registry to handle UI-specific functionality
 */
export class BlockRegistryAdapter<T extends BlockData = BlockData>
  implements BlockManagerContext<T>
{
  private types: Map<string, BlockType<T>>;
  private renderCallbacks: Map<string, (data: T) => HTMLElement>;
  public readonly toolbarRegistry: ToolbarRegistry;
  private blockManager: BlockManager<T>;
  private blockRegistry: BlockRegistry;

  constructor() {
    this.types = new Map();
    this.renderCallbacks = new Map();
    this.blockRegistry = new BlockRegistry();
    this.blockManager = new BlockManager(this.blockRegistry);
    this.toolbarRegistry = new ToolbarRegistry({
      defaultGroups: {
        block: {
          label: 'Block Actions',
          priority: 0,
          enabled: true,
        },
        format: {
          label: 'Formatting',
          priority: 1,
          enabled: true,
        },
      },
      defaultItems: {},
      customGroups: {},
      customItems: {},
    });
  }

  /**
   * Register a block type
   */
  registerType(type: BlockType<T>): void {
    if (this.types.has(type.type)) {
      throw new Error(`Block type '${type.type}' is already registered`);
    }
    this.types.set(type.type, type);
    // Register with the core registry
    this.blockRegistry.registerType(type as unknown as BlockType<BlockData>);
  }

  /**
   * Register a render callback for a block type
   */
  registerRenderCallback(type: string, callback: (data: T) => HTMLElement): void {
    this.renderCallbacks.set(type, callback);
  }

  /**
   * Get a block type
   */
  getType(type: string): BlockType<T> | undefined {
    return this.types.get(type);
  }

  /**
   * Get block by ID
   */
  getBlock(id: string): Block<T> | undefined {
    return this.blockManager.getBlock(id);
  }

  /**
   * Get all blocks
   */
  getBlocks(): Block<T>[] {
    return this.blockManager.getBlocks();
  }

  /**
   * Create a new block
   */
  createBlock(config: BlockConfig<T>): Block<T> {
    return this.blockManager.createBlock(config);
  }

  /**
   * Update block data
   */
  updateBlock(id: string, data: Partial<T>): void {
    this.blockManager.updateBlock(id, data);
  }

  /**
   * Delete block
   */
  deleteBlock(id: string): void {
    this.blockManager.deleteBlock(id);
  }

  /**
   * Move block to a new position
   */
  moveBlock(id: string, position: Position): void {
    this.blockManager.moveBlock(id, position);
  }

  /**
   * Validate block data
   */
  validateBlock(type: string, data: T): BlockValidationResult {
    const blockType = this.types.get(type);
    if (!blockType) {
      return { valid: false, errors: [`Block type '${type}' is not registered`] };
    }
    if (blockType.validate && !blockType.validate(data)) {
      return { valid: false, errors: ['Block data validation failed'] };
    }
    return { valid: true };
  }

  /**
   * Get selected block ID
   */
  getSelectedBlock(): string | null {
    return this.blockManager.getSelectedBlock();
  }

  /**
   * Select block
   */
  selectBlock(id: string | null): void {
    if (id) {
      this.blockManager.selectBlock(id);
    } else {
      this.blockManager.selectBlock(null);
    }
  }

  /**
   * Render a block
   */
  renderBlock(config: BlockConfig<T>): HTMLElement {
    const callback = this.renderCallbacks.get(config.type);
    if (!callback) {
      throw new Error(`No render callback registered for block type '${config.type}'`);
    }

    return callback(config.data);
  }

  /**
   * Get visible items for context
   */
  public getVisibleItems(context: ToolbarContext): ToolbarItem[] {
    const state = this.toolbarRegistry.getState();
    return this.toolbarRegistry.getItems().filter(item => !state.hiddenItems.has(item.id));
  }

  /**
   * Get visible groups for context
   */
  public getVisibleGroups(context: ToolbarContext): ToolbarGroup[] {
    const state = this.toolbarRegistry.getState();
    return this.toolbarRegistry
      .getGroups()
      .filter(group => state.groupStates.get(group.id)?.isVisible);
  }
}
