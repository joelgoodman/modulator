/**
 * @fileoverview Block Interaction System Types
 * @module @modulator/types/blocks/interaction
 * @remarks
 * Defines comprehensive types for block interaction management.
 * Provides interfaces for handling user interactions, 
 * focus management, and event handling.
 */

import type { BlockSelection } from './selection.js';

/**
 * Configuration options for block focus behavior
 * @remarks
 * Defines how a block should be focused and selected.
 * 
 * @example
 * ```typescript
 * const focusOptions: BlockFocusOptions = {
 *   select: true,
 *   position: 'end'
 * };
 * ```
 */
export interface BlockFocusOptions {
  /** 
   * Whether to automatically select the block when focused 
   * @remarks Determines if the block should be visually selected
   */
  select?: boolean;

  /** 
   * Initial cursor position within the block 
   * @remarks Determines where the cursor is placed when the block is focused
   */
  position?: 'start' | 'end';
}

/**
 * Event handler definitions for block interactions
 * @remarks
 * Provides a flexible interface for handling various user interaction events.
 * 
 * @example
 * ```typescript
 * const handlers: BlockInteractionHandlers = {
 *   onClick: (event) => { ... },
 *   onKeyDown: (event) => { ... }
 * };
 * ```
 */
export interface BlockInteractionHandlers {
  /** 
   * Handler for block click events 
   * @param event - Native MouseEvent
   */
  onClick?(event: MouseEvent): void;

  /** 
   * Handler for keydown events within the block 
   * @param event - Native KeyboardEvent
   */
  onKeyDown?(event: KeyboardEvent): void;

  /** 
   * Handler for paste events within the block 
   * @param event - Native ClipboardEvent
   */
  onPaste?(event: ClipboardEvent): void;

  /** 
   * Handler for drag and drop events within the block 
   * @param event - Native DragEvent
   */
  onDrop?(event: DragEvent): void;
}

/**
 * Comprehensive block interaction management interface
 * @remarks
 * Provides a complete set of methods for managing block interactions,
 * selection, focus, and event handling.
 * 
 * @example
 * ```typescript
 * const interactionManager: BlockInteractionManager = {
 *   getSelection: () => currentSelection,
 *   setSelection: (selection) => { ... },
 *   focusBlock: (blockId) => { ... }
 * };
 * ```
 */
export interface BlockInteractionManager {
  /** 
   * Retrieve the current block selection 
   * @returns Current BlockSelection or null
   */
  getSelection(): BlockSelection | null;

  /** 
   * Set the current block selection 
   * @param selection - New block selection
   */
  setSelection(selection: BlockSelection | null): void;

  /** 
   * Focus a specific block 
   * @param blockId - Unique identifier of the block
   * @param options - Optional focus configuration
   */
  focusBlock(blockId: string, options?: BlockFocusOptions): void;

  /** 
   * Remove focus from a specific block 
   * @param blockId - Unique identifier of the block
   */
  blurBlock(blockId: string): void;

  /** 
   * Select a specific block 
   * @param blockId - Unique identifier of the block
   */
  selectBlock(blockId: string): void;

  /** 
   * Deselect a specific block 
   * @param blockId - Unique identifier of the block
   */
  deselectBlock(blockId: string): void;

  /** 
   * Handle click event for a specific block 
   * @param blockId - Unique identifier of the block
   * @param event - Native MouseEvent
   */
  handleClick(blockId: string, event: MouseEvent): void;

  /** 
   * Handle keydown event for a specific block 
   * @param blockId - Unique identifier of the block
   * @param event - Native KeyboardEvent
   */
  handleKeyDown(blockId: string, event: KeyboardEvent): void;

  /** 
   * Handle paste event for a specific block 
   * @param blockId - Unique identifier of the block
   * @param event - Native ClipboardEvent
   */
  handlePaste(blockId: string, event: ClipboardEvent): void;

  /** 
   * Handle drag and drop event for a specific block 
   * @param blockId - Unique identifier of the block
   * @param event - Native DragEvent
   */
  handleDrop(blockId: string, event: DragEvent): void;
}
