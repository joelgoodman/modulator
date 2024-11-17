import { BlockConfig, BlockData, BlockRenderOptions } from './blocks.js';

/**
 * Base renderer interface
 */
export interface BaseRenderer<T extends BlockData = BlockData> {
  /**
   * Render block
   */
  renderBlock(block: BlockConfig<T>, options?: BlockRenderOptions): HTMLElement;

  /**
   * Update block
   */
  updateBlock(block: BlockConfig<T>, element: HTMLElement): void;

  /**
   * Remove block
   */
  removeBlock(element: HTMLElement): void;

  /**
   * Get block element
   */
  getBlockElement(blockId: string): HTMLElement | null;

  /**
   * Get all block elements
   */
  getBlockElements(): HTMLElement[];

  /**
   * Clear renderer
   */
  clear(): void;
}
