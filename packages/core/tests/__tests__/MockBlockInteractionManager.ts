import { BlockInteractionManager, BlockSelection } from '@modulator/types';

/**
 * Mock block interaction manager for testing
 */
export class MockBlockInteractionManager implements BlockInteractionManager {
  private selection: BlockSelection | null = null;

  getSelection(): BlockSelection | null {
    return this.selection;
  }

  setSelection(selection: BlockSelection | null): void {
    this.selection = selection;
  }

  focusBlock(blockId: string, options?: { select?: boolean }): void {
    this.selection = {
      blockId,
      focused: true,
    };

    if (options?.select) {
      this.selectBlock(blockId);
    }
  }

  blurBlock(blockId: string): void {
    if (this.selection?.blockId === blockId) {
      this.selection = null;
    }
  }

  selectBlock(blockId: string): void {
    this.selection = {
      blockId,
      focused: this.selection?.blockId === blockId && this.selection.focused,
    };
  }

  deselectBlock(blockId: string): void {
    if (this.selection?.blockId === blockId) {
      this.selection = null;
    }
  }

  handleClick(blockId: string, event: MouseEvent): void {
    this.focusBlock(blockId, { select: true });
  }

  handleKeyDown(blockId: string, event: KeyboardEvent): void {
    // Mock key handling
  }

  handlePaste(blockId: string, event: ClipboardEvent): void {
    // Mock paste handling
  }

  handleDrop(blockId: string, event: DragEvent): void {
    // Mock drop handling
  }
}
