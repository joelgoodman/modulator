import { BlockData, BlockRenderOptions } from '../blocks/types.js';
import { Block } from '../blocks/index.js';

/**
 * Base renderer type definition
 */
export interface BaseRenderer {
  /**
   * Render a block
   */
  render<T extends BlockData>(block: Block<T>, options?: BlockRenderOptions): HTMLElement;

  /**
   * Update block rendering
   */
  update<T extends BlockData>(
    block: Block<T>,
    element: HTMLElement,
    options?: BlockRenderOptions
  ): void;

  /**
   * Remove block rendering
   */
  remove(element: HTMLElement): void;
}
