/**
 * @fileoverview Core type definitions for the Modulator system
 * @module @modulator/types/core
 * @description Provides fundamental type definitions that form the backbone of the Modulator system
 * @remarks
 * This module contains essential type definitions for the event system, editor state,
 * block interactions, and security features. These types are used throughout the codebase
 * to ensure type safety and provide a robust foundation for the application.
 */

import type { BlockData, Position } from '../blocks/types.js';
import type {
  Observable,
  StateContainer,
  Identifiable,
  Configurable,
  ValidationResult,
  Registry,
} from './base.js';

/**
 * Type definition for event handlers in the system
 * @template T - The type of event data that will be passed to the handler
 * @remarks
 * Event handlers are used throughout the system to respond to various events,
 * from user interactions to system state changes.
 * 
 * @example
 * ```typescript
 * const handler: EventHandler<MouseEvent> = (event) => {
 *   console.log(`Mouse clicked at: ${event.clientX}, ${event.clientY}`);
 * };
 * ```
 */
export type EventHandler<T = unknown> = (event: T) => void;

/**
 * Metadata associated with block-related events
 * @remarks
 * Provides additional context and performance metrics for block events.
 * This metadata helps with debugging, analytics, and performance monitoring.
 * 
 * @example
 * ```typescript
 * const metadata: BlockEventMetadata = {
 *   metrics: {
 *     renderTime: 150,
 *     memoryUsage: 1024
 *   }
 * };
 * ```
 */
export interface BlockEventMetadata extends Record<string, unknown> {
  metrics?: Record<string, unknown>;
}

/**
 * Event subscription with enhanced type safety
 * @remarks
 * Defines the structure of event subscriptions with support for
 * one-time listeners and priority-based execution.
 * 
 * @example
 * ```typescript
 * const subscription: EventSubscription<MouseEvent> = {
 *   type: 'click',
 *   handler: (event) => console.log(event),
 *   once: true,
 *   priority: 1
 * };
 * ```
 */
export interface EventSubscription<T = unknown> {
  type: string;
  handler: EventHandler<T>;
  once?: boolean;
  priority?: number;
}

/**
 * Configuration options for EventEmitter instances
 * @remarks
 * Provides configuration options for customizing event emitter behavior,
 * including error handling and listener limits.
 * 
 * @example
 * ```typescript
 * const options: EventEmitterOptions = {
 *   maxListeners: 10,
 *   captureStackTrace: true,
 *   errorHandling: 'log'
 * };
 * ```
 */
export interface EventEmitterOptions {
  maxListeners?: number;
  captureStackTrace?: boolean;
  errorHandling?: 'throw' | 'log' | 'silent';
}

/**
 * Core event emitter interface with typed events
 * @remarks
 * Provides a type-safe event emitter implementation that ensures
 * event types and handlers are properly matched at compile time.
 * Extends the Observable interface for broader compatibility.
 * 
 * @example
 * ```typescript
 * interface MyEvents {
 *   'data': { value: string };
 *   'error': Error;
 * }
 * 
 * const emitter: EventEmitter<MyEvents>;
 * emitter.on('data', ({ value }) => console.log(value));
 * emitter.emit('data', { value: 'test' });
 * ```
 */
export interface EventEmitter<Events extends Record<string, unknown>> extends Observable<Events> {
  on<K extends keyof Events>(type: K, handler: EventHandler<Events[K]>): void;
  once<K extends keyof Events>(type: K, handler: EventHandler<Events[K]>): void;
  off<K extends keyof Events>(type: K, handler: EventHandler<Events[K]>): void;
  emit<K extends keyof Events>(type: K, data: Events[K]): void;
  removeAllListeners(): void;
  listeners<K extends keyof Events>(type: K): Array<EventHandler<Events[K]>>;
  listenerCount<K extends keyof Events>(type: K): number;
}

/**
 * Editor state data interface
 * @remarks
 * Provides a structured representation of the editor state data,
 * including block data, selection state, and metadata.
 */
export interface EditorStateData {
  blocks: Record<string, BlockData>;
  selection: BlockSelection | null;
  dragState: DragState | null;
  metadata: Record<string, any>;
}

/**
 * Enhanced editor options
 * @remarks
 * Provides configuration options for customizing the editor behavior,
 * including initial block data, plugin support, and theme selection.
 * 
 * @example
 * ```typescript
 * const options: EditorOptions = {
 *   initialBlocks: [],
 *   plugins: ['plugin-1', 'plugin-2'],
 *   theme: 'light'
 * };
 * ```
 */
export interface EditorOptions extends Configurable<EditorOptionsConfig> {
  initialBlocks?: BlockData[];
  plugins?: string[];
  theme?: string;
  validation?: {
    mode: 'strict' | 'loose';
    rules: Record<string, unknown>;
  };
}

/**
 * Editor options configuration
 * @remarks
 * Provides a structured representation of the editor options configuration,
 * including readonly mode, auto-save behavior, and plugin support.
 */
export interface EditorOptionsConfig {
  readonly?: boolean;
  autoSave?: boolean;
  saveInterval?: number;
  maxHistory?: number;
  plugins: string[];
}

/**
 * Enhanced editor command interface
 * @remarks
 * Represents a command that can be executed within the editor,
 * including support for undo and validation.
 * 
 * @example
 * ```typescript
 * class MyCommand implements EditorCommand<string> {
 *   execute(context: EditorCommandContext): Promise<string> {
 *     // Execute command logic
 *   }
 * }
 * ```
 */
export interface EditorCommand<T = unknown> extends Identifiable {
  execute(context: EditorCommandContext): Promise<T>;
  undo?(context: EditorCommandContext): Promise<void>;
  validate?(context: EditorCommandContext): ValidationResult<boolean>;
}

/**
 * Editor command context
 * @remarks
 * Provides a structured representation of the editor command context,
 * including the current state and options.
 */
export interface EditorCommandContext {
  state: EditorStateData;
  options: EditorOptions;
  metadata?: Record<string, unknown>;
}

/**
 * Enhanced block render options
 * @remarks
 * Provides configuration options for customizing block rendering,
 * including theme selection, interactive mode, and validation.
 * 
 * @example
 * ```typescript
 * const options: BlockRenderOptions = {
 *   theme: 'light',
 *   interactive: true,
 *   validation: {
 *     mode: 'strict',
 *     rules: {}
 *   }
 * };
 * ```
 */
export interface BlockRenderOptions extends Configurable<BlockRenderConfig> {
  theme?: string;
  interactive?: boolean;
  validation?: BlockValidationOptions;
}

/**
 * Block render configuration
 * @remarks
 * Provides a structured representation of the block render configuration,
 * including cache key, render mode, and optimization options.
 */
export interface BlockRenderConfig {
  cacheKey?: string;
  renderMode?: 'sync' | 'async';
  optimizations?: {
    memoization?: boolean;
    lazyLoading?: boolean;
  };
}

/**
 * Block validation options
 * @remarks
 * Provides configuration options for customizing block validation,
 * including mode and rules.
 */
export interface BlockValidationOptions {
  mode: 'strict' | 'loose';
  rules: Record<string, unknown>;
}

/**
 * Enhanced block selection
 * @remarks
 * Represents a block selection, including the block ID and range.
 */
export interface BlockSelection {
  blockId: string;
  range: SelectionRange | null;
}

/**
 * Enhanced block interaction context
 * @remarks
 * Provides a structured representation of the block interaction context,
 * including the block ID, event, and position.
 */
export interface BlockInteractionContext {
  blockId: string;
  event: Event;
  position?: Position;
  metadata?: Record<string, unknown>;
}

/**
 * Enhanced interaction state
 * @remarks
 * Represents the current interaction state, including dragging and selecting.
 */
export interface InteractionState extends StateContainer<InteractionStateData> {
  isDragging: boolean;
  isSelecting: boolean;
  currentPosition?: Position;
  enabled?: boolean;
  mode: 'default' | 'edit' | 'select' | 'drag';
}

/**
 * Interaction state data
 * @remarks
 * Provides a structured representation of the interaction state data,
 * including dragging and selecting state, and metadata.
 */
export interface InteractionStateData {
  isDragging: boolean;
  isSelecting: boolean;
  currentPosition?: Position;
  enabled?: boolean;
  mode: 'default' | 'edit' | 'select' | 'drag';
  metadata: Record<string, unknown>;
}

/**
 * Enhanced drag state
 * @remarks
 * Represents the current drag state, including the source and target block IDs.
 */
export interface DragState {
  type: 'block' | 'text';
  sourceBlockId: string;
  targetBlockId: string | null;
  position: { x: number; y: number };
}

/**
 * Enhanced selection state
 * @remarks
 * Represents the current selection state, including the anchor and focus block IDs.
 */
export interface SelectionState extends StateContainer<SelectionStateData> {
  anchorBlockId?: string;
  focusBlockId?: string;
  anchorOffset?: number;
  focusOffset?: number;
  anchorPosition?: Position;
  focusPosition?: Position;
  selectedBlocks: Set<string>;
  focusedBlock: string | null;
  anchor: string | null;
  focus: string | null;
  type: 'none' | 'caret' | 'range';
}

/**
 * Selection state data
 * @remarks
 * Provides a structured representation of the selection state data,
 * including anchor and focus block IDs, and metadata.
 */
export interface SelectionStateData {
  anchorBlockId?: string;
  focusBlockId?: string;
  anchorOffset?: number;
  focusOffset?: number;
  anchorPosition?: Position;
  focusPosition?: Position;
  selectedBlocks: string[];
  focusedBlock: string | null;
  anchor: string | null;
  focus: string | null;
  type: 'none' | 'caret' | 'range';
}

/**
 * Enhanced security context
 * @remarks
 * Provides a structured representation of the security context,
 * including sanitization and validation options.
 */
export interface SecurityContext extends Registry<SecurityRule> {
  sanitize(content: string, config?: SanitizationConfig): string;
  validate(content: string, rules?: SecurityRule[]): ValidationResult<string>;
}

/**
 * Security rule interface
 * @remarks
 * Represents a security rule, including validation and sanitization logic.
 */
export interface SecurityRule extends Identifiable {
  validate(content: string): ValidationResult<boolean>;
  sanitize?(content: string): string;
}

/**
 * Enhanced sanitization config
 * @remarks
 * Provides configuration options for customizing sanitization behavior,
 * including allowed tags and attributes, and custom rules.
 */
export interface SanitizationConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripScripts?: boolean;
  customRules?: SecurityRule[];
  mode?: 'strict' | 'loose';
}

/**
 * Selection range
 * @remarks
 * Represents a selection range, including the start and end positions.
 */
export interface SelectionRange {
  start: number;
  end: number;
}
