/**
 * @fileoverview Block Selection System Types
 * @module @modulator/types/blocks/selection
 * @remarks
 * Defines comprehensive types for block selection and focus management.
 * Provides interfaces for tracking and managing block selections.
 */

/**
 * Represents a selection within a block
 * @remarks
 * Captures detailed information about the current block selection,
 * including the block ID, selection range, and focus state.
 * 
 * @example
 * ```typescript
 * const selection: BlockSelection = {
 *   blockId: 'block-123',
 *   range: document.createRange(),
 *   focused: true
 * };
 * ```
 */
export interface BlockSelection {
  /** 
   * Unique identifier of the selected block 
   * @remarks Ensures precise block targeting
   */
  blockId: string;

  /** 
   * Text selection range within the block 
   * @remarks Provides detailed information about the selected content
   */
  range?: Range;

  /** 
   * Whether the block is currently focused 
   * @remarks Indicates active editing state
   */
  focused: boolean;
}

/**
 * Represents a selection range with start and end points
 * @remarks
 * Provides a simplified representation of a text selection
 * with zero-based character indices.
 * 
 * @example
 * ```typescript
 * const textRange: TextRange = {
 *   start: 5,
 *   end: 15
 * };
 * ```
 */
export interface TextRange {
  /** 
   * Starting index of the selection 
   * @remarks Zero-based character index
   */
  start: number;

  /** 
   * Ending index of the selection 
   * @remarks Zero-based character index
   */
  end: number;
}

/**
 * Configuration for selection behavior
 * @remarks
 * Defines options for managing and configuring block selections.
 * 
 * @example
 * ```typescript
 * const selectionConfig: SelectionConfig = {
 *   multiSelect: true,
 *   scrollIntoView: true
 * };
 * ```
 */
export interface SelectionConfig {
  /** 
   * Allow multiple block selections 
   * @remarks Enables selecting multiple blocks simultaneously
   */
  multiSelect?: boolean;

  /** 
   * Automatically scroll selected block into view 
   * @remarks Ensures selected content is visible
   */
  scrollIntoView?: boolean;

  /** 
   * Highlight style for selections 
   * @remarks Defines visual appearance of selected blocks
   */
  highlightStyle?: 'outline' | 'background' | 'border';
}
