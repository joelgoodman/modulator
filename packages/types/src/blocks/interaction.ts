import type { BlockSelection } from './selection.js';

/**
 * Block focus options
 */
export interface BlockFocusOptions {
  /**
   * Auto-select block when focused
   */
  select?: boolean;

  /**
   * Focus position
   */
  position?: 'start' | 'end';
}

/**
 * Block interaction event handlers
 */
export interface BlockInteractionHandlers {
  /**
   * Handle block click
   */
  onClick?(event: MouseEvent): void;

  /**
   * Handle block keydown
   */
  onKeyDown?(event: KeyboardEvent): void;

  /**
   * Handle block paste
   */
  onPaste?(event: ClipboardEvent): void;

  /**
   * Handle block drop
   */
  onDrop?(event: DragEvent): void;
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
  focusBlock(blockId: string, options?: BlockFocusOptions): void;

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
