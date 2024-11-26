/**
 * @fileoverview Block System Core Types
 * @module @modulator/types/blocks
 * @remarks
 * Defines comprehensive types for block management, 
 * operations, and system interactions.
 * Provides foundational interfaces for creating, 
 * manipulating, and tracking blocks.
 */

import type { BlockEvent } from '../core/index.js';
import type { BlockData, Position } from './types.js';
import type { BlockConfig } from './renderer.js';

/**
 * Represents a single block in the system
 * @template T - Type of block data
 * @remarks
 * Provides an interface for interacting with individual blocks,
 * including event subscription and basic block properties.
 * 
 * @example
 * ```typescript
 * const block: Block = {
 *   id: 'block-123',
 *   type: 'text',
 *   data: { content: 'Hello, world!' },
 *   on: (event, handler) => { ... },
 *   off: (event, handler) => { ... }
 * };
 * ```
 */
export interface Block<T extends BlockData = BlockData> {
  /** 
   * Unique identifier for the block 
   * @remarks Ensures each block can be uniquely referenced
   */
  readonly id: string;

  /** 
   * Type of the block 
   * @remarks Defines the block's semantic or structural category
   */
  readonly type: string;

  /** 
   * Data associated with the block 
   * @remarks Contains all block-specific information
   */
  readonly data: T;

  /** 
   * Subscribe to block-specific events 
   * @param event - Name of the event to listen for
   * @param handler - Callback function to handle the event
   */
  on(event: string, handler: (event: BlockEvent) => void): void;

  /** 
   * Unsubscribe from block-specific events 
   * @param event - Name of the event to stop listening
   * @param handler - Callback function to remove
   */
  off(event: string, handler: (event: BlockEvent) => void): void;
}

/**
 * Block type definition for creating and managing blocks
 * @template T - Type of block data
 * @remarks
 * Provides a blueprint for block creation, validation, 
 * and transformation.
 * 
 * @example
 * ```typescript
 * const textBlockType: BlockType = {
 *   type: 'text',
 *   name: 'Text Block',
 *   create: (data) => ({ content: data?.content || '' }),
 *   validate: (data) => data.content !== undefined,
 *   transform: (data) => ({ ...data, processed: true })
 * };
 * ```
 */
export interface BlockType<T extends BlockData = BlockData> {
  /** 
   * Unique identifier for the block type 
   * @remarks Distinguishes different block categories
   */
  type: string;

  /** 
   * Human-readable name for the block type 
   * @remarks Provides a descriptive label for the block
   */
  name: string;

  /** 
   * Create initial block data 
   * @param data - Optional partial data to initialize the block
   * @returns Fully formed block data
   */
  create(data?: Partial<T>): T;

  /** 
   * Validate block data 
   * @param data - Block data to validate
   * @returns Boolean indicating if the data is valid
   */
  validate(data: T): boolean;

  /** 
   * Transform block data 
   * @param data - Block data to transform
   * @returns Transformed block data
   */
  transform(data: T): BlockData;
}

/**
 * Enumeration of possible block operation types
 * @remarks
 * Defines standard operations that can be performed on blocks.
 */
export enum BlockOperationType {
  /** Create a new block */
  CREATE = 'create',
  /** Update an existing block */
  UPDATE = 'update',
  /** Delete a block */
  DELETE = 'delete',
  /** Move a block to a new position */
  MOVE = 'move',
  /** Duplicate an existing block */
  DUPLICATE = 'duplicate',
  /** Transform a block's type or structure */
  TRANSFORM = 'transform',
}

/**
 * Represents a block operation
 * @template T - Type of block data
 * @remarks
 * Describes a specific operation performed on a block,
 * including its type, target block, and associated data.
 * 
 * @example
 * ```typescript
 * const operation: BlockOperation = {
 *   type: BlockOperationType.CREATE,
 *   blockId: 'new-block-123',
 *   data: { content: 'New block' },
 *   position: { index: 0 }
 * };
 * ```
 */
export interface BlockOperation<T extends BlockData = BlockData> {
  /** 
   * Type of block operation 
   * @remarks Defines the specific action being performed
   */
  type: BlockOperationType;

  /** 
   * Unique identifier of the block being operated on 
   * @remarks Ensures precise block targeting
   */
  blockId: string;

  /** 
   * Optional data associated with the operation 
   * @remarks Provides additional context or payload
   */
  data?: T;

  /** 
   * Optional position for move or create operations 
   * @remarks Defines the block's location in the document
   */
  position?: Position;
}

/**
 * Result of block data validation
 * @remarks
 * Provides detailed feedback about block data validation.
 * 
 * @example
 * ```typescript
 * const validationResult: BlockValidationResult = {
 *   valid: false,
 *   errors: ['Missing required content']
 * };
 * ```
 */
export interface BlockValidationResult {
  /** 
   * Indicates whether the validation was successful 
   * @remarks Determines if the block data meets all requirements
   */
  valid: boolean;

  /** 
   * List of validation errors, if any 
   * @remarks Provides detailed feedback about validation failures
   */
  errors?: string[];
}

/**
 * Unique identifier for a block
 * @remarks
 * Provides a type-safe string identifier for blocks, ensuring 
 * consistent and predictable block referencing across the system.
 * 
 * @example
 * ```typescript
 * const blockId: BlockId = 'block_1234567890';
 * ```
 */
export type BlockId = string;

/**
 * Represents a concrete instance of a block in the system
 * @template T - Optional type of block-specific data
 * 
 * @remarks
 * Defines the core structure for a block instance, capturing 
 * essential metadata and providing a flexible interface for 
 * block management and tracking.
 * 
 * Key characteristics:
 * - Uniquely identifiable via `id`
 * - Typed according to its block type
 * - Includes creation metadata
 * - Supports optional block-specific data
 * 
 * @example
 * ```typescript
 * const textBlockInstance: BlockInstance<TextBlockData> = {
 *   id: 'block_1234567890',
 *   type: 'text',
 *   createdAt: new Date(),
 *   data: {
 *     content: 'Hello, world!',
 *     fontSize: 16
 *   }
 * };
 * ```
 * 
 * @see {@link BlockType} for block type definitions
 * @see {@link BlockData} for block data interfaces
 */
export interface BlockInstance<T extends BlockData = BlockData> {
  /**
   * Unique identifier for the block instance
   * @remarks 
   * Ensures each block can be uniquely referenced and tracked 
   * throughout its lifecycle in the system.
   */
  readonly id: BlockId;

  /**
   * Type identifier of the block
   * @remarks
   * Corresponds to the registered block type, enabling 
   * type-specific rendering and behavior.
   */
  readonly type: string;

  /**
   * Timestamp of block creation
   * @remarks
   * Provides provenance and enables temporal tracking 
   * of block lifecycle events.
   */
  readonly createdAt: Date;

  /**
   * Optional block-specific data
   * @remarks
   * Allows for flexible, type-safe storage of block-specific 
   * information while maintaining a consistent interface.
   */
  readonly data?: T;
}

/**
 * Context for managing blocks within the system
 * @template T - Type of block data
 * @remarks
 * Provides a comprehensive interface for block lifecycle management,
 * including creation, updating, deletion, and selection.
 * 
 * @example
 * ```typescript
 * const blockManager: BlockManagerContext = {
 *   getBlock: (id) => blocks[id],
 *   createBlock: (config) => { ... },
 *   updateBlock: (id, data) => { ... }
 * };
 * ```
 */
export interface BlockManagerContext<T extends BlockData = BlockData> {
  /** 
   * Retrieve a specific block by its ID 
   * @param id - Block identifier
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
   * @param config - Configuration for creating the block
   * @returns The newly created block
   */
  createBlock(config: BlockConfig<T>): Block<T>;

  /** 
   * Update an existing block 
   * @param id - Block identifier
   * @param data - Partial data to update
   */
  updateBlock(id: string, data: Partial<T>): void;

  /** 
   * Delete a block 
   * @param id - Block identifier to delete
   */
  deleteBlock(id: string): void;

  /** 
   * Move a block to a new position 
   * @param id - Block identifier
   * @param position - New position for the block
   */
  moveBlock(id: string, position: Position): void;

  /** 
   * Validate a block's data 
   * @param type - Block type
   * @param data - Block data to validate
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
   * @param id - Block ID to select, or null to deselect
   */
  selectBlock(id: string | null): void;
}

export type { 
  BlockInteractionManager 
} from './interaction.js';

export type { 
  BaseRenderer,
  GenericRenderer,
} from './renderer.js';

export type { BlockEvent } from '../core/event.js';
export type { BlockData, Position } from './types.js';
export type { BlockConfig } from './renderer.js';

/**
 * @fileoverview Block System Core Types
 * @module @modulator/types/blocks
 */

export type {
  Block,
  BlockType,
  BlockId,
  BlockInstance,
  Position,
  BlockOperation,
  BlockOperationType,
  BlockValidationResult,
  BlockEventType,
  BlockManagerContext,
  BlockConfig,
  BlockInteractionManager
} from './types.js';

export type {
  BlockFactory,
  BlockRenderer
} from './renderer.js';

export type { BlockEvent } from '../core/event.js';
