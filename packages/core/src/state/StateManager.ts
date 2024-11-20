import { Block } from '../blocks/index.js';
import { BlockData, EditorState } from '@modulator/types';
import type { StateManager as IStateManager } from '@modulator/types';
import { EventEmitter } from '../events/index.js';

/**
 * History entry type
 */
interface HistoryEntry<T extends BlockData> {
  blocks: Map<string, Block<T>>;
  selectedBlockId: string | null;
  mode: 'edit' | 'read' | 'preview';
}

/**
 * Manages editor state and history
 */
export class StateManager<T extends BlockData = BlockData> implements IStateManager<T> {
  private blocks: Map<string, Block<T>>;
  private history: HistoryEntry<T>[];
  private historyIndex: number;
  private eventEmitter: EventEmitter;
  private selectedBlockId: string | null;
  private mode: 'edit' | 'read' | 'preview';
  private currentTheme: string;
  private subscribers: ((state: EditorState<T>) => void)[] = [];

  constructor() {
    this.blocks = new Map();
    this.history = [];
    this.historyIndex = -1;
    this.eventEmitter = new EventEmitter();
    this.selectedBlockId = null;
    this.mode = 'edit';
    this.currentTheme = 'light';
  }

  /**
   * Get current state
   */
  getState(): EditorState<T> {
    return {
      blocks: Array.from(this.blocks.values()).map(block => block.data),
      selectedBlock: this.selectedBlockId || undefined,
      mode: this.mode,
      theme: this.currentTheme,
      history: {
        canUndo: this.canUndo(),
        canRedo: this.canRedo(),
      },
    };
  }

  /**
   * Update state
   */
  setState(state: Partial<EditorState<T>>): void {
    if (state.blocks) {
      this.blocks.clear();
      state.blocks.forEach(blockData => {
        const block = new Block<T>({
          id: blockData.id,
          type: blockData.type,
          data: blockData,
        });
        this.blocks.set(block.id, block);
      });
    }

    if (state.selectedBlock !== undefined) {
      this.selectedBlockId = state.selectedBlock || null;
    }

    if (state.mode) {
      this.mode = state.mode;
    }

    if (state.theme) {
      this.currentTheme = state.theme;
    }

    this.notifySubscribers();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(callback: (state: EditorState<T>) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index !== -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  /**
   * Get block by ID
   */
  getBlock(id: string): T | undefined {
    return this.blocks.get(id)?.data;
  }

  /**
   * Get all blocks
   */
  getBlocks(): T[] {
    return Array.from(this.blocks.values()).map(block => block.data);
  }

  /**
   * Add block
   */
  addBlock(blockData: T, index?: number): void {
    const block = new Block<T>({
      id: blockData.id,
      type: blockData.type,
      data: blockData,
    });
    this.blocks.set(block.id, block);
    this.recordState();
    this.notifySubscribers();
  }

  /**
   * Update block
   */
  updateBlock(id: string, data: Partial<T>): void {
    const block = this.blocks.get(id);
    if (!block) return;

    block.update(data);
    this.recordState();
    this.notifySubscribers();
  }

  /**
   * Remove block
   */
  removeBlock(id: string): void {
    if (this.blocks.delete(id)) {
      this.recordState();
      this.notifySubscribers();
    }
  }

  /**
   * Move block
   */
  moveBlock(id: string, toIndex: number): void {
    // TODO: Implement block reordering
    this.notifySubscribers();
  }

  /**
   * Clear state
   */
  clear(): void {
    this.blocks.clear();
    this.selectedBlockId = null;
    this.history = [];
    this.historyIndex = -1;
    this.notifySubscribers();
  }

  /**
   * Can undo
   */
  private canUndo(): boolean {
    return this.historyIndex > 0;
  }

  /**
   * Can redo
   */
  private canRedo(): boolean {
    return this.historyIndex < this.history.length - 1;
  }

  /**
   * Record current state
   */
  private recordState(): void {
    const entry: HistoryEntry<T> = {
      blocks: new Map(this.blocks),
      selectedBlockId: this.selectedBlockId,
      mode: this.mode,
    };

    // Remove any future states if we're in the middle of history
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }

    this.history.push(entry);
    this.historyIndex++;
  }

  /**
   * Undo last change
   */
  undo(): void {
    if (!this.canUndo()) return;

    this.historyIndex--;
    this.restoreState(this.history[this.historyIndex]);
    this.notifySubscribers();
  }

  /**
   * Redo last undone change
   */
  redo(): void {
    if (!this.canRedo()) return;

    this.historyIndex++;
    this.restoreState(this.history[this.historyIndex]);
    this.notifySubscribers();
  }

  /**
   * Restore state from history entry
   */
  private restoreState(entry: HistoryEntry<T>): void {
    this.blocks = new Map(entry.blocks);
    this.selectedBlockId = entry.selectedBlockId;
    this.mode = entry.mode;
  }

  /**
   * Notify subscribers of state changes
   */
  private notifySubscribers(): void {
    const state = this.getState();
    this.subscribers.forEach(callback => callback(state));
  }
}
