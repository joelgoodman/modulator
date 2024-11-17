import type { BaseRenderer, BlockConfig, BlockRenderOptions, BlockData } from '@modulator/types';

/**
 * Mock renderer for testing
 */
export class MockRenderer<T extends BlockData = BlockData> implements BaseRenderer<T> {
  private blocks: Map<string, HTMLElement> = new Map();

  renderBlock(block: BlockConfig<T>, options?: BlockRenderOptions): HTMLElement {
    const element = document.createElement('div');
    element.setAttribute('data-block-id', block.id);
    element.setAttribute('data-block-type', block.type);

    if (options?.className) {
      element.className = options.className;
    }
    if (options?.style) {
      Object.assign(element.style, options.style);
    }
    if (options?.attributes) {
      Object.entries(options.attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
    }

    this.blocks.set(block.id, element);
    return element;
  }

  updateBlock(block: BlockConfig<T>, element: HTMLElement): void {
    // Update block attributes if needed
    element.setAttribute('data-block-type', block.type);
  }

  removeBlock(element: HTMLElement): void {
    const blockId = element.getAttribute('data-block-id');
    if (blockId) {
      this.blocks.delete(blockId);
      element.remove();
    }
  }

  getBlockElement(blockId: string): HTMLElement | null {
    return this.blocks.get(blockId) || null;
  }

  getBlockElements(): HTMLElement[] {
    return Array.from(this.blocks.values());
  }

  clear(): void {
    this.blocks.clear();
  }
}
