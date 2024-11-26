/**
 * @fileoverview Block Rendering System Types
 * @module @modulator/types/blocks/renderer
 * @remarks
 * Defines comprehensive types for block rendering and configuration.
 * Provides interfaces for rendering, updating, and managing block elements.
 */

import type { BlockData } from './types.js';

/**
 * Configuration options for block rendering
 * @remarks
 * Provides fine-grained control over block appearance and behavior.
 * 
 * @example
 * ```typescript
 * const renderOptions: BlockRenderOptions = {
 *   editable: true,
 *   className: 'custom-block',
 *   style: { backgroundColor: 'blue' },
 *   attributes: { 'data-type': 'text' }
 * };
 * ```
 */
export interface BlockRenderOptions {
  /** 
   * Whether the block can be edited 
   * @remarks Determines if the block allows direct user editing
   */
  editable?: boolean;

  /** 
   * Custom CSS class name for the block 
   * @remarks Allows custom styling and theming
   */
  className?: string;

  /** 
   * Inline styles to apply to the block 
   * @remarks Enables dynamic, programmatic styling
   */
  style?: Partial<CSSStyleDeclaration>;

  /** 
   * Additional HTML attributes for the block 
   * @remarks Provides extensibility for custom rendering requirements
   */
  attributes?: Record<string, string>;
}

/**
 * Comprehensive block configuration
 * @template T - Type of block data
 * @remarks
 * Defines the complete configuration for a block, 
 * including its identity, type, data, and hierarchy.
 * 
 * @example
 * ```typescript
 * const blockConfig: BlockConfig = {
 *   id: 'block-123',
 *   type: 'text',
 *   data: { content: 'Hello, world!' },
 *   children: ['child-block-1', 'child-block-2']
 * };
 * ```
 */
export interface BlockConfig<T extends BlockData = BlockData> {
  /** 
   * Unique identifier for the block 
   * @remarks Ensures each block can be uniquely referenced
   */
  id: string;

  /** 
   * Type of the block 
   * @remarks Defines the block's semantic or structural category
   */
  type: string;

  /** 
   * Block-specific data 
   * @remarks Contains all data associated with the block
   */
  data: T;

  /** 
   * IDs of child blocks 
   * @remarks Enables nested or hierarchical block structures
   */
  children?: string[];
}

/**
 * Base rendering interface for block elements
 * @template T - Type of block data
 * @remarks
 * Provides a standardized interface for rendering, 
 * updating, and managing block elements.
 * 
 * @example
 * ```typescript
 * const renderer: BaseRenderer = {
 *   renderBlock: (block) => createBlockElement(block),
 *   updateBlock: (block, element) => updateBlockContent(block, element),
 *   removeBlock: (element) => element.remove()
 * };
 * ```
 */
export interface BaseRenderer<T extends BlockData = BlockData> {
  /** 
   * Render a block into an HTML element 
   * @param block - Block configuration
   * @param options - Optional rendering options
   * @returns Created HTML element representing the block
   */
  renderBlock(block: BlockConfig<T>, options?: BlockRenderOptions): HTMLElement;

  /** 
   * Update an existing block element 
   * @param block - Updated block configuration
   * @param element - Existing block HTML element
   * @param options - Optional rendering options
   */
  updateBlock(block: BlockConfig<T>, element: HTMLElement, options?: BlockRenderOptions): void;

  /** 
   * Remove a block element from the DOM 
   * @param element - Block HTML element to remove
   */
  removeBlock(element: HTMLElement): void;

  /** 
   * Set focus on a block element 
   * @param element - Block HTML element to focus
   */
  focusBlock(element: HTMLElement): void;

  /** 
   * Remove focus from a block element 
   * @param element - Block HTML element to blur
   */
  blurBlock(element: HTMLElement): void;
}

/**
 * Generic renderer wrapper to maintain type compatibility
 * @template T - Type of block data
 */
export type GenericRenderer<T extends BlockData = BlockData> = BaseRenderer<T> & {
  renderBlock(block: BlockConfig<T>, options?: BlockRenderOptions): HTMLElement;
  updateBlock(block: BlockConfig<T>, element: HTMLElement, options?: BlockRenderOptions): void;
};
