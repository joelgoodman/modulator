import type { BlockData } from '../blocks/types.js';
import type { BlockConfig } from '../blocks/renderer.js';
import type { BlockEventType } from './event.js';

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
 * Block registry event data
 */
export interface BlockRegistryEventData<T extends BlockData = BlockData> {
  /**
   * Block ID
   */
  blockId: string;

  /**
   * Block type
   */
  blockType?: string;

  /**
   * Block data
   */
  blockData?: T;
}

/**
 * Block registry interface
 * Manages block instances and their lifecycle
 */
export interface BlockRegistry<T extends BlockData = BlockData> {
  /**
   * Register block type
   */
  registerType(type: string, config: BlockConfig<T>): void;

  /**
   * Unregister block type
   */
  unregisterType(type: string): void;

  /**
   * Get block type
   */
  getType(type: string): BlockConfig<T> | undefined;

  /**
   * Get all registered block types
   */
  getTypes(): BlockConfig<T>[];

  /**
   * Check if block type is registered
   */
  hasType(type: string): boolean;

  /**
   * Create block data
   */
  createBlockData(type: string, data?: Partial<T>): T;

  /**
   * Validate block data
   */
  validateBlockData(type: string, data: T): boolean;

  /**
   * Transform block data
   */
  transformBlockData(type: string, data: T): BlockData;

  /**
   * Subscribe to registry events
   */
  on(type: BlockEventType, handler: (data: BlockRegistryEventData<T>) => void): void;

  /**
   * Unsubscribe from registry events
   */
  off(type: BlockEventType, handler: (data: BlockRegistryEventData<T>) => void): void;

  /**
   * Clear registry
   */
  clear(): void;
}
