import { Block } from './Block.js';
import { BlockRegistry } from '../registry/index.js';
import { EventEmitter } from '../events/index.js';
import {
  BlockConfig,
  BlockData,
  Position,
  BlockEventType,
  BlockEvent,
  BlockManagerContext,
  BlockValidationResult,
} from '@modulator/types';

/**
 * Manages block instances and operations
 */
export class BlockManager<T extends BlockData = BlockData> implements BlockManagerContext<T> {
  private blocks: Map<string, Block<T>>;
  private registry: BlockRegistry;
  private eventEmitter: EventEmitter;
  private selectedBlockId: string | null;

  constructor(registry: BlockRegistry) {
    this.blocks = new Map();
    this.registry = registry;
    this.eventEmitter = new EventEmitter();
    this.selectedBlockId = null;
  }

  /**
   * Create a new block
   */
  createBlock(config: BlockConfig<T>): Block<T> {
    const blockType = this.registry.getType<T>(config.type);
    if (!blockType) {
      throw new Error(`Block type '${config.type}' not found`);
    }

    const block = new Block<T>({
      id: config.id,
      type: config.type,
      data: this.registry.createBlockData<T>(config.type, config.data),
    });

    this.blocks.set(block.id, block);
    this.emitEvent('block:created', block.id);
    return block;
  }

  /**
   * Get a block by ID
   */
  getBlock(id: string): Block<T> | undefined {
    return this.blocks.get(id);
  }

  /**
   * Get all blocks
   */
  getBlocks(): Block<T>[] {
    return Array.from(this.blocks.values());
  }

  /**
   * Update block data
   */
  updateBlock(id: string, data: Partial<T>): void {
    const block = this.blocks.get(id);
    if (!block) {
      throw new Error(`Block '${id}' not found`);
    }

    block.update(data);
    this.emitEvent('block:updated', id);
  }

  /**
   * Delete a block
   */
  deleteBlock(id: string): void {
    const block = this.blocks.get(id);
    if (!block) {
      throw new Error(`Block '${id}' not found`);
    }

    this.blocks.delete(id);
    this.emitEvent('block:deleted', id);

    if (this.selectedBlockId === id) {
      this.selectedBlockId = null;
    }
  }

  /**
   * Move block to new position
   */
  moveBlock(id: string, position: Position): void {
    const block = this.blocks.get(id);
    if (!block) {
      throw new Error(`Block '${id}' not found`);
    }

    // In a real implementation, update block positions
    this.emitEvent('block:moved', id, { position });
  }

  /**
   * Select a block
   */
  selectBlock(id: string | null): void {
    if (id && !this.blocks.has(id)) {
      throw new Error(`Block '${id}' not found`);
    }

    const previousId = this.selectedBlockId;
    this.selectedBlockId = id;

    if (previousId) {
      this.emitEvent('block:deselected', previousId);
    }
    if (id) {
      this.emitEvent('block:selected', id);
    }
  }

  /**
   * Get selected block ID
   */
  getSelectedBlock(): string | null {
    return this.selectedBlockId;
  }

  /**
   * Validate block data
   */
  validateBlock(type: string, data: T): BlockValidationResult {
    const blockType = this.registry.getType<T>(type);
    if (!blockType) {
      return {
        valid: false,
        errors: [`Block type '${type}' not found`],
      };
    }

    if (!blockType.validate) {
      return { valid: true };
    }

    const isValid = blockType.validate(data);
    return {
      valid: isValid,
      errors: isValid ? undefined : [`Invalid data for block type '${type}'`],
    };
  }

  /**
   * Subscribe to block events
   */
  on(event: BlockEventType, handler: (event: BlockEvent) => void): void {
    this.eventEmitter.on(event, handler);
  }

  /**
   * Unsubscribe from block events
   */
  off(event: BlockEventType, handler: (event: BlockEvent) => void): void {
    this.eventEmitter.off(event, handler);
  }

  /**
   * Clear all blocks
   */
  clear(): void {
    this.blocks.clear();
    this.selectedBlockId = null;
    this.emitEvent('block:cleared');
  }

  private emitEvent(
    type: BlockEventType,
    blockId: string = '',
    data: Record<string, unknown> = {}
  ): void {
    this.eventEmitter.emit({
      type,
      blockId,
      data,
    });
  }
}
