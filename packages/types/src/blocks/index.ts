import type { BlockEvent } from '../core/index.js';
import type { BlockData, Position } from './types.js';
import type { BlockConfig } from './renderer.js';

/**
 * Block interface representing a single block in the system
 */
export interface Block<T extends BlockData = BlockData> {
  /**
   * Unique identifier for the block
   */
  readonly id: string;

  /**
   * Type of the block
   */
  readonly type: string;

  /**
   * Data associated with the block
   */
  readonly data: T;

  /**
   * Subscribe to block events
   * @param event Event name to listen for
   * @param handler Callback function for the event
   */
  on(event: string, handler: (event: BlockEvent) => void): void;

  /**
   * Unsubscribe from block events
   * @param event Event name to stop listening
   * @param handler Callback function to remove
   */
  off(event: string, handler: (event: BlockEvent) => void): void;
}

/**
 * Block type definition for creating and managing blocks
 */
export interface BlockType<T extends BlockData = BlockData> {
  /**
   * Unique identifier for the block type
   */
  type: string;

  /**
   * Human-readable name for the block type
   */
  name: string;

  /**
   * Create initial block data
   * @param data Optional partial data to initialize the block
   * @returns Fully formed block data
   */
  create(data?: Partial<T>): T;

  /**
   * Validate block data
   * @param data Block data to validate
   * @returns Boolean indicating if the data is valid
   */
  validate(data: T): boolean;

  /**
   * Transform block data
   * @param data Block data to transform
   * @returns Transformed block data
   */
  transform(data: T): BlockData;
}

/**
 * Enumeration of possible block operation types
 */
export enum BlockOperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MOVE = 'move',
  DUPLICATE = 'duplicate',
  TRANSFORM = 'transform',
}

/**
 * Represents a block operation
 */
export interface BlockOperation<T extends BlockData = BlockData> {
  /**
   * Type of block operation
   */
  type: BlockOperationType;

  /**
   * Unique identifier of the block being operated on
   */
  blockId: string;

  /**
   * Optional data associated with the operation
   */
  data?: T;

  /**
   * Optional position for move or create operations
   */
  position?: Position;
}

/**
 * Result of block data validation
 */
export interface BlockValidationResult {
  /**
   * Indicates whether the validation was successful
   */
  valid: boolean;

  /**
   * List of validation errors, if any
   */
  errors?: string[];
}

/**
 * Context for managing blocks within the system
 */
export interface BlockManagerContext<T extends BlockData = BlockData> {
  /**
   * Retrieve a specific block by its ID
   * @param id Block identifier
   * @returns The block, or undefined if not found
   */
  getBlock(id: string): Block<T> | undefined;

  /**
   * Get all blocks in the system
   * @returns Array of all blocks
   */
  getBlocks(): Block<T>[];

  /**
   * Create a new block
   * @param config Configuration for creating the block
   * @returns The newly created block
   */
  createBlock(config: BlockConfig<T>): Block<T>;

  /**
   * Update an existing block
   * @param id Block identifier
   * @param data Partial data to update
   */
  updateBlock(id: string, data: Partial<T>): void;

  /**
   * Delete a block
   * @param id Block identifier to delete
   */
  deleteBlock(id: string): void;

  /**
   * Move a block to a new position
   * @param id Block identifier
   * @param position New position for the block
   */
  moveBlock(id: string, position: Position): void;

  /**
   * Validate a block's data
   * @param type Block type
   * @param data Block data to validate
   * @returns Validation result
   */
  validateBlock(type: string, data: T): BlockValidationResult;

  /**
   * Get the currently selected block
   * @returns Block ID of selected block, or null
   */
  getSelectedBlock(): string | null;

  /**
   * Select a block
   * @param id Block ID to select, or null to deselect
   */
  selectBlock(id: string | null): void;
}

export type { BlockEvent } from '../core/event.js';
export type { BlockData, Position } from './types.js';
export type { BlockConfig } from './renderer.js';
