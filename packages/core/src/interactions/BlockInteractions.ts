import { Block } from '../blocks/index.js';
import {
  BlockData,
  BlockEvent,
  Position,
  BlockInteractionContext,
  InteractionState,
  DragState,
  SelectionState,
} from '@modulator/types';
import { EventEmitter } from '../events/index.js';

/**
 * Manages block interactions (drag, drop, select, etc.)
 */
export class BlockInteractionManager implements BlockInteractionContext {
  private eventEmitter: EventEmitter;
  private dragState: DragState | null;
  private selectionState: SelectionState;
  private enabled: boolean;

  constructor() {
    this.eventEmitter = new EventEmitter();
    this.dragState = null;
    this.selectionState = {
      selectedBlocks: new Set(),
      focusedBlock: null,
      anchor: null,
      focus: null,
    };
    this.enabled = true;
  }

  /**
   * Enable interactions
   */
  enable(): void {
    this.enabled = true;
    this.emitStateChange();
  }

  /**
   * Disable interactions
   */
  disable(): void {
    this.enabled = false;
    this.clearSelection();
    this.cancelDrag();
    this.emitStateChange();
  }

  /**
   * Start dragging a block
   */
  startDrag(blockId: string, position: Position): void {
    if (!this.enabled) return;

    this.dragState = {
      blockId,
      startPosition: position,
      currentPosition: position,
      isDragging: true,
    };

    this.emitEvent('block:dragstart', blockId, {
      position,
      state: this.dragState,
    });
  }

  /**
   * Update drag position
   */
  updateDrag(position: Position): void {
    if (!this.dragState || !this.enabled) return;

    this.dragState.currentPosition = position;
    this.emitEvent('block:dragmove', this.dragState.blockId, {
      position,
      state: this.dragState,
    });
  }

  /**
   * End dragging
   */
  endDrag(position: Position): void {
    if (!this.dragState || !this.enabled) return;

    const { blockId, startPosition } = this.dragState;
    this.emitEvent('block:dragend', blockId, {
      startPosition,
      endPosition: position,
      state: this.dragState,
    });

    this.dragState = null;
  }

  /**
   * Cancel dragging
   */
  cancelDrag(): void {
    if (!this.dragState) return;

    const { blockId, startPosition } = this.dragState;
    this.emitEvent('block:dragcancel', blockId, {
      position: startPosition,
      state: this.dragState,
    });

    this.dragState = null;
  }

  /**
   * Select a block
   */
  selectBlock(blockId: string, addToSelection: boolean = false): void {
    if (!this.enabled) return;

    if (!addToSelection) {
      this.clearSelection();
    }

    this.selectionState.selectedBlocks.add(blockId);
    this.selectionState.focusedBlock = blockId;
    this.selectionState.focus = blockId;
    if (!this.selectionState.anchor) {
      this.selectionState.anchor = blockId;
    }

    this.emitEvent('block:selected', blockId, {
      state: this.selectionState,
    });
  }

  /**
   * Deselect a block
   */
  deselectBlock(blockId: string): void {
    if (!this.enabled) return;

    this.selectionState.selectedBlocks.delete(blockId);
    if (this.selectionState.focusedBlock === blockId) {
      this.selectionState.focusedBlock = null;
    }
    if (this.selectionState.anchor === blockId) {
      this.selectionState.anchor = null;
    }
    if (this.selectionState.focus === blockId) {
      this.selectionState.focus = null;
    }

    this.emitEvent('block:deselected', blockId, {
      state: this.selectionState,
    });
  }

  /**
   * Clear selection
   */
  clearSelection(): void {
    if (this.selectionState.selectedBlocks.size === 0) return;

    const selectedBlocks = Array.from(this.selectionState.selectedBlocks);
    this.selectionState.selectedBlocks.clear();
    this.selectionState.focusedBlock = null;
    this.selectionState.anchor = null;
    this.selectionState.focus = null;

    selectedBlocks.forEach(blockId => {
      this.emitEvent('block:deselected', blockId, {
        state: this.selectionState,
      });
    });
  }

  /**
   * Get interaction state
   */
  getState(): InteractionState {
    return {
      enabled: this.enabled,
      dragState: this.dragState,
      selectionState: {
        ...this.selectionState,
        selectedBlocks: Array.from(this.selectionState.selectedBlocks),
      },
    };
  }

  /**
   * Subscribe to interaction events
   */
  on(event: string, handler: (event: BlockEvent) => void): void {
    this.eventEmitter.on(event, handler);
  }

  /**
   * Unsubscribe from interaction events
   */
  off(event: string, handler: (event: BlockEvent) => void): void {
    this.eventEmitter.off(event, handler);
  }

  private emitEvent(type: string, blockId: string, data: Record<string, unknown> = {}): void {
    this.eventEmitter.emit({
      type,
      blockId,
      data,
    });
  }

  private emitStateChange(): void {
    this.emitEvent('interaction:statechange', '', {
      state: this.getState(),
    });
  }
}
