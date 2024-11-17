import { BlockEvent } from './event.js';

/**
 * Block interface
 */
export interface Block<T extends BlockData = BlockData> {
  /**
   * Block ID
   */
  readonly id: string;

  /**
   * Block type
   */
  readonly type: string;

  /**
   * Block data
   */
  readonly data: T;

  /**
   * Update block data
   */
  update(data: Partial<T>): void;

  /**
   * Subscribe to block events
   */
  on(event: string, handler: (event: BlockEvent) => void): void;

  /**
   * Unsubscribe from block events
   */
  off(event: string, handler: (event: BlockEvent) => void): void;
}

/**
 * Base block data interface
 */
export interface BlockData {
  [key: string]: unknown;
  id: string;
  type: string;
}

/**
 * Block configuration
 */
export interface BlockConfig<T extends BlockData = BlockData> {
  /**
   * Unique block identifier
   */
  id: string;

  /**
   * Block type (e.g., 'text', 'heading')
   */
  type: string;

  /**
   * Block data
   */
  data: T;

  /**
   * Child block IDs
   */
  children?: string[];
}

/**
 * Block type definition
 */
export interface BlockType<T extends BlockData = BlockData> {
  /**
   * Block type identifier
   */
  type: string;

  /**
   * Display name
   */
  name: string;

  /**
   * Create a new block instance
   */
  create: (data?: Partial<T>) => T;

  /**
   * Validate block data
   */
  validate?: (data: T) => boolean;

  /**
   * Transform block data before saving
   */
  transform?: (data: T) => BlockData;
}

/**
 * Block operation type
 */
export type BlockOperationType = 'create' | 'update' | 'delete' | 'move';

/**
 * Block operation
 */
export interface BlockOperation<T extends BlockData = BlockData> {
  /**
   * Operation type
   */
  type: BlockOperationType;

  /**
   * Target block ID
   */
  blockId: string;

  /**
   * Block data for create/update operations
   */
  data?: T;

  /**
   * Target position for create/move operations
   */
  position?: Position;
}

/**
 * Position in the document
 */
export interface Position {
  /**
   * Index in the parent container
   */
  index: number;

  /**
   * Parent block ID
   */
  parent?: string;
}

/**
 * Block rendering options
 */
export interface BlockRenderOptions {
  /**
   * Whether the block is editable
   */
  editable?: boolean;

  /**
   * Custom CSS classes
   */
  className?: string;

  /**
   * Block-specific styles
   */
  style?: Partial<CSSStyleDeclaration>;

  /**
   * Additional attributes
   */
  attributes?: Record<string, string>;
}

/**
 * Block selection state
 */
export interface BlockSelection {
  /**
   * Selected block ID
   */
  blockId: string;

  /**
   * Selection range
   */
  range?: Range;

  /**
   * Whether the block is focused
   */
  focused: boolean;
}

/**
 * Block interaction manager interface
 */
export interface BlockInteractionManager {
  /**
   * Get current selection
   */
  getSelection(): BlockSelection | null;

  /**
   * Set selection
   */
  setSelection(selection: BlockSelection | null): void;

  /**
   * Focus block
   */
  focusBlock(blockId: string, options?: { select?: boolean }): void;

  /**
   * Blur block
   */
  blurBlock(blockId: string): void;

  /**
   * Select block
   */
  selectBlock(blockId: string): void;

  /**
   * Deselect block
   */
  deselectBlock(blockId: string): void;

  /**
   * Handle block click
   */
  handleClick(blockId: string, event: MouseEvent): void;

  /**
   * Handle block keydown
   */
  handleKeyDown(blockId: string, event: KeyboardEvent): void;

  /**
   * Handle block paste
   */
  handlePaste(blockId: string, event: ClipboardEvent): void;

  /**
   * Handle block drop
   */
  handleDrop(blockId: string, event: DragEvent): void;
}

/**
 * Block validation result
 */
export interface BlockValidationResult {
  /**
   * Whether the block is valid
   */
  valid: boolean;

  /**
   * Validation error messages
   */
  errors?: string[];
}

/**
 * Block manager context
 */
export interface BlockManagerContext<T extends BlockData = BlockData> {
  /**
   * Get block by ID
   */
  getBlock(id: string): Block<T> | undefined;

  /**
   * Get all blocks
   */
  getBlocks(): Block<T>[];

  /**
   * Create a new block
   */
  createBlock(config: BlockConfig<T>): Block<T>;

  /**
   * Update block data
   */
  updateBlock(id: string, data: Partial<T>): void;

  /**
   * Delete block
   */
  deleteBlock(id: string): void;

  /**
   * Move block to a new position
   */
  moveBlock(id: string, position: Position): void;

  /**
   * Validate block data
   */
  validateBlock(type: string, data: T): BlockValidationResult;

  /**
   * Get selected block ID
   */
  getSelectedBlock(): string | null;

  /**
   * Select block
   */
  selectBlock(id: string | null): void;
}
