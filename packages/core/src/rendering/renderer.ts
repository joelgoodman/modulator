import { Block } from '../blocks/index.js';
import { BlockData, BlockRenderOptions } from '@modulator/types';

/**
 * Base renderer class
 */
export abstract class BaseRenderer {
  /**
   * Render a block
   */
  abstract render<T extends BlockData>(block: Block<T>, options?: BlockRenderOptions): HTMLElement;

  /**
   * Update block rendering
   */
  abstract update<T extends BlockData>(
    block: Block<T>,
    element: HTMLElement,
    options?: BlockRenderOptions
  ): void;

  /**
   * Remove block rendering
   */
  abstract remove(element: HTMLElement): void;
}

/**
 * Default renderer implementation
 */
export class DefaultRenderer extends BaseRenderer {
  /**
   * Render a block
   */
  render<T extends BlockData>(block: Block<T>, options: BlockRenderOptions = {}): HTMLElement {
    const element = document.createElement('div');
    element.setAttribute('data-block-id', block.id);
    element.setAttribute('data-block-type', block.type);

    if (options.className) {
      element.className = options.className;
    }

    if (options.style) {
      Object.assign(element.style, options.style);
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    if (options.editable !== false) {
      element.contentEditable = 'true';
      element.setAttribute('role', 'textbox');
      element.setAttribute('aria-multiline', 'true');
    }

    this.update(block, element, options);
    return element;
  }

  /**
   * Update block rendering
   */
  update<T extends BlockData>(
    block: Block<T>,
    element: HTMLElement,
    options: BlockRenderOptions = {}
  ): void {
    // Basic text content rendering
    if (typeof block.data.content === 'string') {
      element.textContent = block.data.content;
    } else {
      element.textContent = JSON.stringify(block.data);
    }

    // Update attributes based on options
    if (options.className) {
      element.className = options.className;
    }

    if (options.style) {
      Object.assign(element.style, options.style);
    }

    if (options.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }
  }

  /**
   * Remove block rendering
   */
  remove(element: HTMLElement): void {
    element.remove();
  }
}
