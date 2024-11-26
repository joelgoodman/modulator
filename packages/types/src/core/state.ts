/**
 * @fileoverview State Management System Type Definitions
 * @module @modulator/types/core/state
 * @description Comprehensive type definitions for the Modulator state management system
 * @remarks
 * This module provides type definitions for the state management system that handles
 * editor state, block data, and state subscriptions. It includes:
 * - State manager interfaces
 * - State update types
 * - Subscription management
 * - Block state management
 */

import type { BlockData } from '../blocks/index.js';
import type { EditorState } from './editor.js';

/**
 * Generic state management interface for editor components
 * @template T - Type of block data, defaults to BlockData
 * @remarks
 * The StateManager interface provides a standardized way to manage editor state,
 * including blocks, configuration, and subscriptions. It supports:
 * 
 * - Immutable state updates with partial changes
 * - Subscription-based state change notifications
 * - Block-level state management
 * - State persistence and restoration
 * 
 * @example
 * ```typescript
 * class MyStateManager implements StateManager<CustomBlockData> {
 *   private state: EditorState<CustomBlockData>;
 * 
 *   getState(): EditorState<CustomBlockData> {
 *     return this.state;
 *   }
 * 
 *   setState(changes: Partial<EditorState<CustomBlockData>>): void {
 *     this.state = { ...this.state, ...changes };
 *     this.notifySubscribers();
 *   }
 * }
 * ```
 */
export interface StateManager<T extends BlockData = BlockData> {
  /**
   * Retrieve the current editor state
   * @returns Comprehensive state snapshot with block-level access
   * @remarks
   * Returns an immutable snapshot of the current editor state that combines
   * both editor-level and first block-level information. This allows for
   * flexible state access while maintaining type safety.
   * 
   * @example
   * ```typescript
   * // Access editor-level properties
   * const state = stateManager.getState();
   * console.log('Current mode:', state.mode);
   * 
   * // Access first block's properties directly (if exists)
   * console.log('First block content:', state.blocks[0]?.content);
   * ```
   */
  getState(): EditorState<T>;

  /**
   * Update the editor state
   * @param state - Partial state changes to apply
   * @remarks
   * Performs an immutable update of the editor state, merging the
   * provided changes with the existing state. Only changed fields
   * need to be included in the update.
   * 
   * @example
   * ```typescript
   * stateManager.setState({
   *   selectedBlock: 'block-1',
   *   mode: 'edit',
   *   theme: 'dark'
   * });
   * ```
   */
  setState(state: Partial<EditorState<T>>): void;

  /**
   * Apply an update function to the current state
   * @param updateFn - Function that receives current state and returns partial update
   */
  updateState(updateFn: (state: EditorState<T>) => Partial<EditorState<T>>): void;

  /**
   * Reset the state to its initial configuration
   */
  resetState(): void;

  /**
   * Register a callback for state changes
   * @param callback - Function to call when state changes
   * @returns Function to unsubscribe the callback
   * @remarks
   * Subscribers are notified after each state change with the complete
   * new state. The returned function can be called to unsubscribe.
   * 
   * @example
   * ```typescript
   * const unsubscribe = stateManager.subscribe((state) => {
   *   console.log('State updated:', state);
   * });
   * 
   * // Later, to stop receiving updates:
   * unsubscribe();
   * ```
   */
  subscribe(callback: (state: EditorState<T>) => void): () => void;

  /**
   * Retrieve a block by its unique identifier
   * @param id - Block ID to look up
   * @returns Block data if found, undefined otherwise
   * @remarks
   * Provides direct access to block data without needing to traverse
   * the entire state tree.
   * 
   * @example
   * ```typescript
   * const block = stateManager.getBlock('block-1');
   * if (block) {
   *   console.log('Block content:', block.content);
   * }
   * ```
   */
  getBlock(id: string): T | undefined;

  /**
   * Get all blocks in the current state
   * @returns Array of all blocks
   */
  getBlocks(): T[];

  /**
   * Retrieve a specific state value by key
   * @param key - Key of the state value to retrieve
   * @returns Value associated with the given key
   */
  get<K extends keyof EditorState<T>>(key: K): EditorState<T>[K];

  /**
   * Set a specific state value by key
   * @param key - Key of the state value to set
   * @param value - Value to set
   */
  set<K extends keyof EditorState<T>>(key: K, value: EditorState<T>[K]): void;

  /**
   * Update a specific block's data
   * @param id - Block ID to update
   * @param data - New block data or update function
   * @remarks
   * Updates a single block's data without affecting other blocks.
   * The update can be either new data or a function that receives
   * the current data and returns updated data.
   * 
   * @example
   * ```typescript
   * // Direct update
   * stateManager.updateBlock('block-1', {
   *   content: 'New content',
   *   type: 'text'
   * });
   * 
   * // Functional update
   * stateManager.updateBlock('block-1', (block) => ({
   *   ...block,
   *   content: block.content.toUpperCase()
   * }));
   * ```
   */
  updateBlock(id: string, data: Partial<T> | ((block: T) => T)): void;

  /**
   * Add a new block to the editor
   * @param block - Block data to add
   * @param position - Optional position to insert the block
   * @returns ID of the newly added block
   * @remarks
   * Creates a new block with the provided data and adds it to the editor.
   * If a position is specified, the block will be inserted at that position;
   * otherwise, it will be added at the end.
   * 
   * @example
   * ```typescript
   * const newBlockId = stateManager.addBlock({
   *   type: 'text',
   *   content: 'New block content'
   * }, { index: 2 });
   * ```
   */
  addBlock(block: Omit<T, 'id'>, position?: { index: number }): string;

  /**
   * Remove a block from the editor
   * @param id - ID of the block to remove
   * @remarks
   * Removes the specified block and updates the state accordingly.
   * If the removed block was selected, selection will be cleared.
   * 
   * @example
   * ```typescript
   * stateManager.removeBlock('block-1');
   * ```
   */
  removeBlock(id: string): void;

  /**
   * Move a block to a new position
   * @param id - ID of the block to move
   * @param position - New position for the block
   * @remarks
   * Moves a block to the specified position, shifting other blocks
   * as needed. Triggers appropriate state updates and notifications.
   * 
   * @example
   * ```typescript
   * stateManager.moveBlock('block-1', { index: 0 }); // Move to start
   * ```
   */
  moveBlock(id: string, position: { index: number }): void;

  /**
   * Save the current state
   */
  save(): void;

  /**
   * Restore to the last saved state
   */
  restore(): void;

  /**
   * Persist the current state to storage
   */
  persist(): void;

  /**
   * Reset the editor state
   * @remarks
   * Removes all blocks and resets state to initial values.
   * This is a destructive operation that cannot be undone.
   */
  clear(): void;

  /**
   * Undo the last change
   */
  undo(): void;

  /**
   * Redo the last undone change
   */
  redo(): void;
}
