import type { BlockData, Position } from '../blocks/types.js';
import type {
  EventHandler,
  EventSubscription,
  EventEmitter,
  EventEmitterOptions,
} from './types.js';

export type { EventHandler, EventSubscription, EventEmitter, EventEmitterOptions };

/**
 * Block event types
 */
export enum BlockEventType {
  // Block events
  BLOCK_CREATED = 'block:created',
  BLOCK_UPDATED = 'block:updated',
  BLOCK_DELETED = 'block:deleted',
  BLOCK_MOVED = 'block:moved',
  BLOCK_SELECTED = 'block:selected',
  BLOCK_DESELECTED = 'block:deselected',
  BLOCK_FOCUSED = 'block:focused',
  BLOCK_BLURRED = 'block:blurred',
  BLOCK_CLEARED = 'block:cleared',

  // Editor events
  EDITOR_INITIALIZED = 'editor:initialized',
  EDITOR_STATE_CHANGED = 'editor:state-changed',
  EDITOR_MODE_CHANGED = 'editor:mode-changed',
  EDITOR_THEME_CHANGED = 'editor:theme-changed',
  EDITOR_COMMAND_EXECUTED = 'editor:command-executed',
  EDITOR_ERROR = 'editor:error',
  EDITOR_DESTROYED = 'editor:destroyed',

  // History events
  HISTORY_UNDO = 'history:undo',
  HISTORY_REDO = 'history:redo',

  // Accessibility events
  ACCESSIBILITY_UPDATED = 'accessibility:updated',

  // Selection events
  SELECTION_CHANGED = 'selection:changed',

  // Performance events
  METRICS_UPDATE = 'metrics:update',
  PERFORMANCE_MEASURE = 'performance:measure',
}

/**
 * Block event metadata
 */
export interface BlockEventMetadata {
  /**
   * Block data
   */
  blockData?: BlockData;

  /**
   * Block position
   */
  position?: Position;

  /**
   * Performance metrics
   */
  metrics?: Record<string, number>;
}

/**
 * Block event interface
 */
export interface BlockEvent {
  /**
   * Event type
   */
  type: BlockEventType;

  /**
   * Block ID
   */
  blockId: string;

  /**
   * Event data
   */
  data?: BlockEventMetadata;
}
