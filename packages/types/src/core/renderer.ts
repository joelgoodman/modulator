import { BlockData, BlockRenderOptions } from '../blocks/types.js';
import { Block } from '../blocks/index.js';

/**
 * Core interface for block rendering functionality
 * @remarks
 * The BaseRenderer interface defines the essential methods required to render,
 * update, and remove blocks from the DOM. Implementations of this interface
 * handle the visual representation of blocks in the editor.
 *
 * Key responsibilities:
 * - Initial block rendering
 * - Updating block content and appearance
 * - Cleaning up block DOM elements
 */
export interface BaseRenderer {
  /**
   * Create and render a block's DOM representation
   * @template T - Type of block data
   * @param block - Block instance to render
   * @param options - Optional rendering configuration
   * @returns HTMLElement containing the rendered block
   * @remarks
   * This method is responsible for:
   * - Creating the initial DOM structure
   * - Setting up event listeners
   * - Applying styles and attributes
   * - Rendering block content
   */
  render<T extends BlockData>(block: Block<T>, options?: BlockRenderOptions): HTMLElement;

  /**
   * Update an existing block's DOM representation
   * @template T - Type of block data
   * @param block - Block instance with updated data
   * @param element - Existing DOM element to update
   * @param options - Optional rendering configuration
   * @remarks
   * This method should:
   * - Efficiently update only changed content
   * - Preserve event listeners when possible
   * - Maintain selection and focus state
   */
  update<T extends BlockData>(
    block: Block<T>,
    element: HTMLElement,
    options?: BlockRenderOptions
  ): void;

  /**
   * Remove a block's DOM element and clean up resources
   * @param element - DOM element to remove
   * @remarks
   * This method should:
   * - Remove the element from the DOM
   * - Clean up event listeners
   * - Release any held resources
   */
  remove(element: HTMLElement): void;
}
