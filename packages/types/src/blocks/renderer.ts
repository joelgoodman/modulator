import type { BlockData } from './types.js';

/**
 * Block render options
 */
export interface BlockRenderOptions {
  /**
   * Enable editing
   */
  editable?: boolean;

  /**
   * Custom class name
   */
  className?: string;

  /**
   * Custom styles
   */
  style?: Partial<CSSStyleDeclaration>;

  /**
   * Custom attributes
   */
  attributes?: Record<string, string>;
}

/**
 * Block configuration
 */
export interface BlockConfig<T extends BlockData = BlockData> {
  /**
   * Block ID
   */
  id: string;

  /**
   * Block type
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
  updateBlock(block: BlockConfig<T>, element: HTMLElement, options?: BlockRenderOptions): void;

  /**
   * Remove block
   */
  removeBlock(element: HTMLElement): void;

  /**
   * Focus block
   */
  focusBlock(element: HTMLElement): void;

  /**
   * Blur block
   */
  blurBlock(element: HTMLElement): void;
}
