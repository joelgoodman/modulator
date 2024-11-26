/**
 * @fileoverview Block Registry System Type Definitions
 * @module @modulator/types/core/registry
 * @description Comprehensive type definitions for the Modulator block registry system
 * @remarks
 * This module provides type definitions for the block registry system that manages
 * block types, validation, transformation, and lifecycle events. It includes:
 * - Registry configuration options
 * - Block type management
 * - Event handling
 * - Data validation and transformation
 */

import type { BlockData } from '../blocks/types.js';
import type { BlockConfig } from '../blocks/renderer.js';
import type { BlockEventType } from './event.js';

/**
 * Configuration options for the block registry
 * @remarks
 * Controls the behavior and limitations of the block registry system.
 * These options help manage memory usage and provide features like
 * undo/redo functionality.
 * 
 * @example
 * ```typescript
 * const options: BlockRegistryOptions = {
 *   maxBlocks: 1000,
 *   enableHistory: true,
 *   maxHistoryStates: 50
 * };
 * 
 * const registry = new BlockRegistry(options);
 * ```
 */
export interface BlockRegistryOptions {
  /**
   * Maximum number of blocks that can be stored in the registry
   * @remarks
   * Used to prevent memory issues with very large documents.
   * When the limit is reached, new blocks cannot be added until
   * existing ones are removed.
   * 
   * @default undefined - no limit
   */
  maxBlocks?: number;

  /**
   * Whether to enable undo/redo functionality
   * @remarks
   * When enabled, maintains a history of block states for undo/redo
   * operations. This feature requires additional memory to store
   * the history stack.
   * 
   * @default true
   */
  enableHistory?: boolean;

  /**
   * Maximum number of history states to maintain
   * @remarks
   * Limits memory usage by capping the undo/redo history stack.
   * When the limit is reached, older states are removed as new
   * ones are added.
   * 
   * @default 100
   */
  maxHistoryStates?: number;
}

/**
 * Data structure for block registry events
 * @template T - Type of block data, defaults to BlockData
 * @remarks
 * Contains all relevant information about a block when registry events occur,
 * such as block creation, updates, or deletions.
 * 
 * @example
 * ```typescript
 * registry.on(BlockEventType.BLOCK_CREATED, (data: BlockRegistryEventData) => {
 *   console.log(`Block ${data.blockId} created`);
 *   console.log(`Type: ${data.type}`);
 *   console.log(`Data:`, data.blockData);
 * });
 * ```
 */
export interface BlockRegistryEventData<T extends BlockData = BlockData> {
  /**
   * Unique identifier of the affected block
   * @remarks
   * This ID uniquely identifies the block within the registry
   * and remains constant throughout the block's lifecycle.
   */
  blockId: string;

  /**
   * Type identifier of the block
   * @remarks
   * Corresponds to a registered block type in the registry.
   * Used for validation and transformation of block data.
   */
  type: string;

  /**
   * Current data of the block
   * @remarks
   * Contains the complete block data at the time of the event.
   * For update events, this represents the new state.
   */
  blockData: T;

  /**
   * Previous data of the block, if applicable
   * @remarks
   * Only present for update events. Contains the block's
   * previous state before the update was applied.
   */
  previousData?: T;
}

/**
 * Core interface for the block registry system
 * @template T - Type of block data, defaults to BlockData
 * @remarks
 * The block registry is the central system for managing block types,
 * validation, transformation, and lifecycle events. It provides:
 * 
 * - Type registration and management
 * - Block data validation and transformation
 * - Event subscription system
 * - Block lifecycle management
 * 
 * @example
 * ```typescript
 * // Creating and configuring a registry
 * const registry = new BlockRegistry<CustomBlockData>();
 * 
 * // Registering a block type
 * registry.registerType('text', {
 *   validate: (data) => typeof data.content === 'string',
 *   transform: (data) => ({
 *     ...data,
 *     content: data.content.trim()
 *   })
 * });
 * 
 * // Creating a block
 * const blockData = registry.createBlockData('text', {
 *   content: 'Hello World'
 * });
 * 
 * // Subscribing to events
 * registry.on(BlockEventType.BLOCK_UPDATED, (event) => {
 *   console.log(`Block ${event.blockId} updated`);
 * });
 * ```
 */
export interface BlockRegistry<T extends BlockData = BlockData> {
  /**
   * Register a new block type with its configuration
   * @param type - Unique identifier for the block type
   * @param config - Configuration for the block type
   * @throws If type is already registered
   * @remarks
   * Registers a new block type with its associated configuration.
   * The configuration includes validation and transformation rules.
   * 
   * @example
   * ```typescript
   * registry.registerType('heading', {
   *   validate: (data) => {
   *     return typeof data.level === 'number' && 
   *            data.level >= 1 && 
   *            data.level <= 6;
   *   },
   *   transform: (data) => ({
   *     ...data,
   *     level: Math.min(Math.max(data.level, 1), 6)
   *   })
   * });
   * ```
   */
  registerType(type: string, config: BlockConfig<T>): void;

  /**
   * Remove a block type from the registry
   * @param type - Type identifier to remove
   * @remarks
   * Unregisters a block type. Existing blocks of this type will
   * remain but cannot be edited or validated against the type rules.
   * 
   * @example
   * ```typescript
   * registry.unregisterType('deprecated-block-type');
   * ```
   */
  unregisterType(type: string): void;

  /**
   * Retrieve configuration for a block type
   * @param type - Type identifier to look up
   * @returns Configuration if type exists, undefined otherwise
   * @remarks
   * Gets the configuration for a registered block type,
   * including its validation and transformation rules.
   * 
   * @example
   * ```typescript
   * const config = registry.getType('text');
   * if (config) {
   *   console.log('Text block validation rules:', config.validate);
   * }
   * ```
   */
  getType(type: string): BlockConfig<T> | undefined;

  /**
   * Get all registered block type configurations
   * @returns Array of all block configurations
   * @remarks
   * Returns an array of all registered block types and their
   * configurations. Useful for introspection and UI generation.
   * 
   * @example
   * ```typescript
   * const types = registry.getTypes();
   * console.log('Available block types:', types.map(t => t.type));
   * ```
   */
  getTypes(): BlockConfig<T>[];

  /**
   * Check if a block type is registered
   * @param type - Type identifier to check
   * @returns true if type exists, false otherwise
   * @remarks
   * Quickly check if a block type is registered without
   * retrieving its full configuration.
   * 
   * @example
   * ```typescript
   * if (registry.hasType('custom-block')) {
   *   console.log('Custom block type is available');
   * }
   * ```
   */
  hasType(type: string): boolean;

  /**
   * Create new block data for a given type
   * @param type - Type of block to create
   * @param data - Optional initial data
   * @returns Initialized block data
   * @throws If type is not registered
   * @remarks
   * Creates new block data with proper initialization and validation.
   * The created data will conform to the block type's configuration.
   * 
   * @example
   * ```typescript
   * const textBlock = registry.createBlockData('text', {
   *   content: 'Hello World',
   *   alignment: 'center'
   * });
   * ```
   */
  createBlockData(type: string, data?: Partial<T>): T;

  /**
   * Validate block data against its type configuration
   * @param type - Type of block to validate
   * @param data - Block data to validate
   * @returns true if valid, false otherwise
   * @remarks
   * Validates block data against the registered type's validation rules.
   * Use this before saving or updating block data.
   * 
   * @example
   * ```typescript
   * const isValid = registry.validateBlockData('heading', {
   *   level: 7 // Invalid: level must be 1-6
   * });
   * console.log('Is valid heading?', isValid); // false
   * ```
   */
  validateBlockData(type: string, data: T): boolean;

  /**
   * Transform block data according to type configuration
   * @param type - Type of block to transform
   * @param data - Block data to transform
   * @returns Transformed block data
   * @remarks
   * Applies the type's transformation rules to the block data.
   * Use this to normalize or sanitize block data.
   * 
   * @example
   * ```typescript
   * const transformed = registry.transformBlockData('text', {
   *   content: '  Trim me  '
   * });
   * console.log(transformed.content); // 'Trim me'
   * ```
   */
  transformBlockData(type: string, data: T): BlockData;

  /**
   * Subscribe to block registry events
   * @param type - Event type to listen for
   * @param handler - Function to call when event occurs
   * @remarks
   * Subscribe to block lifecycle events to react to changes
   * in the registry.
   * 
   * @example
   * ```typescript
   * registry.on(BlockEventType.BLOCK_UPDATED, (event) => {
   *   console.log(`Block ${event.blockId} updated:`, event.blockData);
   * });
   * ```
   */
  on(type: BlockEventType, handler: (data: BlockRegistryEventData<T>) => void): void;

  /**
   * Remove an event subscription
   * @param type - Event type to unsubscribe from
   * @param handler - Handler function to remove
   * @remarks
   * Unsubscribe from block events when they are no longer needed.
   * 
   * @example
   * ```typescript
   * const handler = (event) => console.log(event);
   * registry.on(BlockEventType.BLOCK_CREATED, handler);
   * // Later...
   * registry.off(BlockEventType.BLOCK_CREATED, handler);
   * ```
   */
  off(type: BlockEventType, handler: (data: BlockRegistryEventData<T>) => void): void;

  /**
   * Clear all registered types and data
   * @remarks
   * Completely resets the registry to its initial state.
   * This is a destructive operation that cannot be undone.
   * 
   * @example
   * ```typescript
   * // Remove all registered types and data
   * registry.clear();
   * ```
   */
  clear(): void;
}
