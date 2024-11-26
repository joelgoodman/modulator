/**
 * @fileoverview Core type definitions for the Modulator editor
 * @module @modulator/types/core
 * @remarks
 * This module exports all core type definitions used throughout the Modulator editor.
 * It serves as the central type system for the editor, organizing types into logical
 * groups based on their functionality:
 *
 * - Editor types: Core editor configuration and state
 * - State types: State management interfaces
 * - Event types: Event system and handlers
 * - Registry types: Block registry and management
 */

// Export core types
export type {
  Validator,
  ValidationResult,
  BlockData,
  BlockSelection,
  DragState,
  EditorState
} from './base.js';

// Export editor types
export type {
  /** Editor initialization options */
  EditorOptions,
  /** Available editor commands */
  EditorCommand,
  /** Block rendering configuration */
  BlockRenderOptions,
  /** Block interaction context */
  BlockInteractionContext,
  /** Editor interaction state */
  InteractionState,
  /** Text selection state */
  SelectionState,
  /** Security context for content */
  SecurityContext,
  /** Content sanitization config */
  SanitizationConfig,
} from './types.js';

// Export state types
export type {
  /** Generic state management interface */
  StateManager,
} from './state.js';

// Export event types
export {
  /** Enumeration of block event types */
  BlockEventType,
} from './event.js';
export type {
  /** Block event interface */
  BlockEvent,
  /** Block event metadata */
  BlockEventMetadata,
  /** Event handler type */
  EventHandler,
  /** Event subscription interface */
  EventSubscription,
  /** Event emitter options */
  EventEmitterOptions,
  /** Event emitter interface */
  EventEmitter,
} from './event.js';

// Export registry types
export type {
  /** Block registry interface */
  BlockRegistry,
  /** Block registry options */
  BlockRegistryOptions,
  /** Block registry event data */
  BlockRegistryEventData,
} from './registry.js';
