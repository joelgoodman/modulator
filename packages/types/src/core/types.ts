import type { BlockData, Position } from '../blocks/types.js';

/**
 * Event handler type
 */
export type EventHandler<T = unknown> = (event: T) => void;

/**
 * Block event metadata
 */
export interface BlockEventMetadata {
  metrics?: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * Event subscription
 */
export interface EventSubscription {
  type: string;
  handler: EventHandler;
  once?: boolean;
}

/**
 * Event emitter options
 */
export interface EventEmitterOptions {
  maxListeners?: number;
  captureStackTrace?: boolean;
}

/**
 * Event emitter interface
 */
export interface EventEmitter {
  on(type: string, handler: EventHandler): void;
  once(type: string, handler: EventHandler): void;
  off(type: string, handler: EventHandler): void;
  removeAllListeners(): void;
  emit(type: string, data?: any): void;
  listeners(type: string): EventHandler[];
  listenerCount(type: string): number;
}

/**
 * Editor state interface
 */
export interface EditorState {
  blocks: BlockData[];
  selectedBlock?: string;
  position?: Position;
}

/**
 * Editor options interface
 */
export interface EditorOptions {
  initialBlocks?: BlockData[];
  plugins?: string[];
  theme?: string;
}

/**
 * Editor command type
 */
export type EditorCommand = 'undo' | 'redo' | 'copy' | 'paste' | 'delete' | string;

/**
 * Block render options
 */
export interface BlockRenderOptions {
  theme?: string;
  interactive?: boolean;
}

/**
 * Block selection interface
 */
export interface BlockSelection {
  blockId: string;
  start?: number;
  end?: number;
  position?: Position;
}

/**
 * Block interaction context
 */
export interface BlockInteractionContext {
  blockId: string;
  event: Event;
  position?: Position;
}

/**
 * Interaction state with extended properties
 */
export interface InteractionState {
  isDragging: boolean;
  isSelecting: boolean;
  currentPosition?: Position;
  enabled?: boolean;
}

/**
 * Drag state with additional properties
 */
export interface DragState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  startPosition?: Position;
  currentPosition?: Position;
  blockId: string;
}

/**
 * Selection state with extended properties
 */
export interface SelectionState {
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
}

/**
 * Security context
 */
export interface SecurityContext {
  sanitize: (content: string) => string;
}

/**
 * Sanitization configuration
 */
export interface SanitizationConfig {
  allowedTags?: string[];
  allowedAttributes?: Record<string, string[]>;
  stripScripts?: boolean;
}
