import { BlockData, Position } from './blocks.js';

/**
 * Block event types
 */
export type BlockEventType =
  // Block events
  | 'block:created'
  | 'block:updated'
  | 'block:deleted'
  | 'block:moved'
  | 'block:selected'
  | 'block:deselected'
  | 'block:focused'
  | 'block:blurred'
  | 'block:cleared'
  // Editor events
  | 'editor:initialized'
  | 'editor:state-changed'
  | 'editor:mode-changed'
  | 'editor:theme-changed'
  | 'editor:command-executed'
  | 'editor:error'
  | 'editor:destroyed'
  // History events
  | 'history:undo'
  | 'history:redo'
  // Accessibility events
  | 'accessibility:updated'
  // Selection events
  | 'selection:changed';

/**
 * Block event metadata
 */
export interface BlockEventMetadata {
  /**
   * Block data for create/update events
   */
  blockData?: BlockData;

  /**
   * Position for move events
   */
  position?: Position;

  /**
   * Additional event metadata
   */
  [key: string]: unknown;
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
   * Target block ID
   */
  blockId: string;

  /**
   * Event metadata
   */
  data?: BlockEventMetadata;
}

/**
 * Event handler type
 */
export type EventHandler<T = unknown> = (event: T) => void;

/**
 * Event subscription options
 */
export interface EventSubscription {
  /**
   * Event type to subscribe to
   */
  type: string;

  /**
   * Event handler function
   */
  handler: EventHandler;

  /**
   * Whether to handle event only once
   */
  once?: boolean;
}

/**
 * Event emitter options
 */
export interface EventEmitterOptions {
  /**
   * Maximum number of listeners per event
   */
  maxListeners?: number;

  /**
   * Whether to capture stack trace for debugging
   */
  captureStackTrace?: boolean;
}

/**
 * Event emitter interface
 */
export interface EventEmitter {
  /**
   * Add event listener
   */
  on<T = unknown>(type: string, handler: EventHandler<T>): void;

  /**
   * Add one-time event listener
   */
  once<T = unknown>(type: string, handler: EventHandler<T>): void;

  /**
   * Remove event listener
   */
  off<T = unknown>(type: string, handler: EventHandler<T>): void;

  /**
   * Remove all event listeners
   */
  clear(): void;

  /**
   * Emit event
   */
  emit<T = unknown>(event: T): void;

  /**
   * Get event listeners
   */
  listeners(type: string): EventHandler[];

  /**
   * Get event listener count
   */
  listenerCount(type: string): number;
}
