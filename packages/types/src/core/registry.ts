import { BlockData, BlockConfig, Position } from './blocks.js';
import { BlockEvent, BlockEventType } from './event.js';

/**
 * Block registry event types
 */
export type BlockRegistryEventType = BlockEventType;

/**
 * Block registry event data
 */
export interface BlockRegistryEventData<T extends BlockData = BlockData> {
  blockId: string;
  blockType?: string;
  blockData?: T;
  position?: Position;
}

/**
 * Block registry event
 */
export interface BlockRegistryEvent<T extends BlockData = BlockData> {
  type: BlockRegistryEventType;
  data: BlockRegistryEventData<T>;
}

/**
 * Block registry options
 */
export interface BlockRegistryOptions {
  /**
   * Maximum number of blocks to store
   */
  maxBlocks?: number;

  /**
   * Enable undo/redo functionality
   */
  enableHistory?: boolean;

  /**
   * Maximum number of history states to keep
   */
  maxHistoryStates?: number;
}

/**
 * Block registry interface
 * Manages block instances and their lifecycle
 */
export interface BlockRegistry<T extends BlockData = BlockData> {
  /**
   * Get a block by ID
   */
  get(id: string): T | undefined;

  /**
   * Get all blocks
   */
  getAll(): T[];

  /**
   * Create a new block
   */
  create(config: BlockConfig<T>): T;

  /**
   * Update a block
   */
  update(id: string, data: Partial<T>): void;

  /**
   * Delete a block
   */
  delete(id: string): void;

  /**
   * Move a block to a new position
   */
  move(id: string, position: Position): void;

  /**
   * Get the selected block ID
   */
  getSelected(): string | null;

  /**
   * Select a block
   */
  select(id: string): void;

  /**
   * Deselect the current block
   */
  deselect(): void;

  /**
   * Subscribe to block events
   */
  on(blockId: string, event: string, handler: (event: BlockEvent) => void): void;

  /**
   * Unsubscribe from block events
   */
  off(blockId: string, event: string, handler: (event: BlockEvent) => void): void;

  /**
   * Subscribe to registry events
   */
  subscribe(handler: (event: BlockRegistryEvent<T>) => void): () => void;

  /**
   * Clear the registry
   */
  clear(): void;

  /**
   * Undo the last operation
   */
  undo(): void;

  /**
   * Redo the last undone operation
   */
  redo(): void;

  /**
   * Check if undo is available
   */
  canUndo(): boolean;

  /**
   * Check if redo is available
   */
  canRedo(): boolean;
}
