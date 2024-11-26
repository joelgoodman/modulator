import type {
  BlockEventType,
  BlockType,
  BlockId,
  BlockInstance,
  BlockData,
  Position,
  BlockValidationResult,
  BlockOperation,
} from '@modulator/types';

import { BlockOperationType } from '@modulator/types';
import { EventSystem } from './eventSystem.js';

/**
 * Manages block lifecycle and interactions
 * @template T - Type of block data
 */
export class BlockManager<T extends BlockData = BlockData> {
  private registeredBlocks: Map<BlockId, BlockType<T>> = new Map();
  private activeBlocks: Map<BlockId, BlockInstance<T>> = new Map();
  private selectedBlockId: BlockId | null = null;
  private eventSystem: EventSystem;

  constructor() {
    this.eventSystem = new EventSystem();
  }

  /**
   * Register a new block type
   * @param blockType Block type to register
   */
  registerBlockType(blockType: BlockType<T>): void {
    this.registeredBlocks.set(blockType.type, blockType);
    this.eventSystem.emit('blockTypeRegistered', { type: blockType.type });
  }

  /**
   * Create a new block instance
   * @param blockTypeId ID of the block type
   * @param initialData Optional initial data for the block
   * @param position Optional position for the new block
   * @returns Created block instance
   */
  createBlock(
    blockTypeId: BlockId,
    initialData?: Partial<T>,
    position?: Position
  ): BlockInstance<T> | null {
    const blockType = this.registeredBlocks.get(blockTypeId);
    if (!blockType) return null;

    // Create initial data using block type's create method
    const data = blockType.create(initialData);

    // Validate the data
    const validationResult = this.validateBlock(blockTypeId, data);
    if (!validationResult.valid) {
      throw new Error(`Invalid block data: ${validationResult.errors?.join(', ')}`);
    }

    const blockInstance: BlockInstance<T> = {
      id: `block_${Date.now()}`,
      type: blockTypeId,
      createdAt: new Date(),
      data,
    };

    this.activeBlocks.set(blockInstance.id, blockInstance);

    // Emit block creation event
    const operation: BlockOperation<T> = {
      type: BlockOperationType.CREATE,
      blockId: blockInstance.id,
      data,
      position,
    };

    this.eventSystem.emit('blockCreated', operation);
    return blockInstance;
  }

  /**
   * Update a block's data
   * @param blockId ID of the block to update
   * @param data New data for the block
   */
  updateBlock(blockId: BlockId, data: Partial<T>): void {
    const block = this.activeBlocks.get(blockId);
    if (!block) throw new Error(`Block not found: ${blockId}`);

    const blockType = this.registeredBlocks.get(block.type);
    if (!blockType) throw new Error(`Block type not found: ${block.type}`);

    // Merge existing data with updates
    const newData = { ...block.data, ...data } as T;

    // Validate the new data
    const validationResult = this.validateBlock(block.type, newData);
    if (!validationResult.valid) {
      throw new Error(`Invalid block data: ${validationResult.errors?.join(', ')}`);
    }

    // Create updated block instance
    const updatedBlock: BlockInstance<T> = {
      ...block,
      data: newData,
    };

    this.activeBlocks.set(blockId, updatedBlock);

    // Emit update event
    const operation: BlockOperation<T> = {
      type: BlockOperationType.UPDATE,
      blockId,
      data: newData,
    };

    this.eventSystem.emit('blockUpdated', operation);
  }

  /**
   * Delete a block
   * @param blockId ID of the block to delete
   */
  deleteBlock(blockId: BlockId): void {
    const block = this.activeBlocks.get(blockId);
    if (!block) throw new Error(`Block not found: ${blockId}`);

    this.activeBlocks.delete(blockId);

    // If this was the selected block, clear selection
    if (this.selectedBlockId === blockId) {
      this.selectedBlockId = null;
    }

    // Emit delete event
    const operation: BlockOperation<T> = {
      type: BlockOperationType.DELETE,
      blockId,
    };

    this.eventSystem.emit('blockDeleted', operation);
  }

  /**
   * Move a block to a new position
   * @param blockId ID of the block to move
   * @param position New position for the block
   */
  moveBlock(blockId: BlockId, position: Position): void {
    const block = this.activeBlocks.get(blockId);
    if (!block) throw new Error(`Block not found: ${blockId}`);

    // Emit move event
    const operation: BlockOperation<T> = {
      type: BlockOperationType.MOVE,
      blockId,
      position,
    };

    this.eventSystem.emit('blockMoved', operation);
  }

  /**
   * Validate block data
   * @param blockTypeId ID of the block type
   * @param data Data to validate
   * @returns Validation result
   */
  validateBlock(blockTypeId: BlockId, data: T): BlockValidationResult {
    const blockType = this.registeredBlocks.get(blockTypeId);
    if (!blockType) {
      return {
        valid: false,
        errors: [`Block type not found: ${blockTypeId}`],
      };
    }

    try {
      const isValid = blockType.validate(data);
      return {
        valid: isValid,
        errors: isValid ? undefined : ['Block validation failed'],
      };
    } catch (error) {
      return {
        valid: false,
        errors: [(error as Error).message],
      };
    }
  }

  /**
   * Get a block instance by ID
   * @param blockId ID of the block to retrieve
   * @returns Block instance or undefined if not found
   */
  getBlock(blockId: BlockId): BlockInstance<T> | undefined {
    return this.activeBlocks.get(blockId);
  }

  /**
   * Get all active blocks
   * @returns Array of all active block instances
   */
  getBlocks(): BlockInstance<T>[] {
    return Array.from(this.activeBlocks.values());
  }

  /**
   * Get all registered block types
   * @returns Array of registered block types
   */
  getRegisteredBlockTypes(): BlockType<T>[] {
    return Array.from(this.registeredBlocks.values());
  }

  /**
   * Select a block
   * @param blockId ID of the block to select, or null to deselect
   */
  selectBlock(blockId: BlockId | null): void {
    if (blockId && !this.activeBlocks.has(blockId)) {
      throw new Error(`Block not found: ${blockId}`);
    }

    const previousSelection = this.selectedBlockId;
    this.selectedBlockId = blockId;

    if (previousSelection) {
      this.eventSystem.emit('blockDeselected', { blockId: previousSelection });
    }

    if (blockId) {
      this.eventSystem.emit('blockSelected', { blockId });
    }
  }

  /**
   * Get the currently selected block ID
   * @returns ID of the selected block, or null if none selected
   */
  getSelectedBlock(): BlockId | null {
    return this.selectedBlockId;
  }

  /**
   * Subscribe to block events
   * @param event Event type to subscribe to
   * @param handler Event handler function
   * @returns Unsubscribe function
   */
  on(event: BlockEventType, handler: (data: any) => void): () => void {
    return this.eventSystem.subscribe(event, handler).unsubscribe;
  }
}
