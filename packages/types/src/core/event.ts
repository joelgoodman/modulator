/**
 * @fileoverview Event System Type Definitions
 * @module @modulator/types/core/event
 * @description Comprehensive type definitions for the Modulator event system
 * @remarks
 * This module provides type definitions for the event system that powers
 * communication between different parts of the Modulator system. It includes:
 * - Event type enumerations
 * - Event metadata interfaces
 * - Event handler types
 * - Event emitter interfaces
 */

import type { BlockData, Position } from '../blocks/types.js';
import type {
  EventHandler,
  EventSubscription,
  EventEmitter,
  EventEmitterOptions,
} from './types.js';

export type { EventHandler, EventSubscription, EventEmitter, EventEmitterOptions };

/**
 * Enumeration of all block-related event types in the system
 * @remarks
 * This enum defines all possible events that can be emitted by blocks and the editor.
 * Events are categorized into different groups for better organization and discoverability:
 * 
 * - Block Lifecycle Events: Creation, updates, deletion
 * - Selection Events: Focus, selection changes
 * - Editor State Events: Mode changes, initialization
 * - History Events: Undo/redo operations
 * - Performance Events: Rendering, optimization
 * 
 * @example
 * ```typescript
 * // Subscribing to block events
 * editor.on(BlockEventType.BLOCK_CREATED, (event) => {
 *   console.log(`New block created: ${event.blockId}`);
 * });
 * 
 * // Emitting block events
 * editor.emit(BlockEventType.BLOCK_UPDATED, {
 *   blockId: 'block-1',
 *   data: { content: 'Updated content' }
 * });
 * ```
 */
export enum BlockEventType {
  // Block Lifecycle Events
  /** Emitted when a new block is created */
  BLOCK_CREATED = 'block:created',
  /** Emitted when a block's content or properties are updated */
  BLOCK_UPDATED = 'block:updated',
  /** Emitted when a block is deleted */
  BLOCK_DELETED = 'block:deleted',
  /** Emitted when a block is moved to a new position */
  BLOCK_MOVED = 'block:moved',
  /** Emitted when a block is selected */
  BLOCK_SELECTED = 'block:selected',
  /** Emitted when a block is deselected */
  BLOCK_DESELECTED = 'block:deselected',
  /** Emitted when a block receives focus */
  BLOCK_FOCUSED = 'block:focused',
  /** Emitted when a block loses focus */
  BLOCK_BLURRED = 'block:blurred',
  /** Emitted when a block's content is cleared */
  BLOCK_CLEARED = 'block:cleared',

  // Editor State Events
  /** Emitted when the editor is fully initialized */
  EDITOR_INITIALIZED = 'editor:initialized',
  /** Emitted when the editor's state changes */
  EDITOR_STATE_CHANGED = 'editor:state-changed',
  /** Emitted when the editor's mode changes (e.g., read-only, edit) */
  EDITOR_MODE_CHANGED = 'editor:mode-changed',
  /** Emitted when the editor's theme changes */
  EDITOR_THEME_CHANGED = 'editor:theme-changed',

  // History Events
  /** Emitted when an operation is added to the history stack */
  HISTORY_PUSH = 'history:push',
  /** Emitted when an operation is undone */
  HISTORY_UNDO = 'history:undo',
  /** Emitted when an operation is redone */
  HISTORY_REDO = 'history:redo',
  /** Emitted when the history stack is cleared */
  HISTORY_CLEAR = 'history:clear',

  // Performance Events
  /** Emitted when block rendering starts */
  RENDER_START = 'render:start',
  /** Emitted when block rendering completes */
  RENDER_COMPLETE = 'render:complete',
  /** Emitted when a performance optimization is applied */
  OPTIMIZATION_APPLIED = 'optimization:applied'
}

/**
 * Additional metadata associated with block events
 * @remarks
 * This interface defines the structure of metadata that can be attached to block events.
 * It includes information about the block's data, position, and performance metrics.
 * 
 * @example
 * ```typescript
 * const metadata: BlockEventMetadata = {
 *   blockData: {
 *     id: 'block-1',
 *     type: 'text',
 *     content: 'Hello World'
 *   },
 *   position: { x: 0, y: 100 },
 *   metrics: {
 *     renderTime: 16.7,
 *     memoryUsage: 1024
 *   }
 * };
 * 
 * editor.emit(BlockEventType.BLOCK_UPDATED, {
 *   blockId: 'block-1',
 *   data: metadata
 * });
 * ```
 */
export interface BlockEventMetadata {
  /** The block's data at the time of the event */
  blockData?: BlockData;
  /** The block's position at the time of the event */
  position?: Position;
  /** Performance metrics associated with the event */
  metrics?: Record<string, number>;
}

/**
 * Core block event interface
 * @remarks
 * Defines the structure of all block-related events in the system.
 * Every block event must include a type and blockId, with optional
 * additional data in the form of BlockEventMetadata.
 * 
 * This interface ensures type safety and consistency across all
 * block-related events in the system.
 * 
 * @example
 * ```typescript
 * // Creating a block event
 * const event: BlockEvent = {
 *   type: BlockEventType.BLOCK_CREATED,
 *   blockId: 'block-1',
 *   data: {
 *     blockData: { type: 'text', content: 'New block' },
 *     position: { x: 0, y: 0 }
 *   }
 * };
 * 
 * // Handling block events
 * editor.on(BlockEventType.BLOCK_CREATED, (event: BlockEvent) => {
 *   console.log(`Block ${event.blockId} created at position:`, event.data?.position);
 * });
 * ```
 */
export interface BlockEvent {
  /** The type of block event */
  type: BlockEventType;
  /** The ID of the block associated with this event */
  blockId: string;
  /** Optional metadata associated with the event */
  data?: BlockEventMetadata;
}
