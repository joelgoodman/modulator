import type { StateManager, EditorState, BlockData } from '@modulator/types';

/**
 * Mock state manager for testing
 */
export class MockStateManager<T extends BlockData = BlockData> implements StateManager<T> {
  private state: EditorState<T>;
  private subscribers: Set<(state: EditorState<T>) => void>;

  constructor() {
    this.state = {
      blocks: [],
      mode: 'edit',
      theme: 'light',
      history: {
        canUndo: false,
        canRedo: false,
      },
    } as EditorState<T>;
    this.subscribers = new Set();
  }

  getState(): EditorState<T> {
    return this.state;
  }

  setState(state: Partial<EditorState<T>>): void {
    this.state = { ...this.state, ...state };
    this.notifySubscribers();
  }

  subscribe(callback: (state: EditorState<T>) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  getBlock(id: string): T | undefined {
    return this.state.blocks.find((block: T) => block.id === id);
  }

  getBlocks(): T[] {
    return this.state.blocks;
  }

  addBlock(block: T): void {
    this.state.blocks.push(block);
    this.notifySubscribers();
  }

  updateBlock(id: string, data: Partial<T>): void {
    const index = this.state.blocks.findIndex((block: T) => block.id === id);
    if (index !== -1) {
      this.state.blocks[index] = { ...this.state.blocks[index], ...data };
      this.notifySubscribers();
    }
  }

  removeBlock(id: string): void {
    this.state.blocks = this.state.blocks.filter((block: T) => block.id !== id);
    this.notifySubscribers();
  }

  moveBlock(id: string, toIndex: number): void {
    const fromIndex = this.state.blocks.findIndex((block: T) => block.id === id);
    if (fromIndex !== -1) {
      const [block] = this.state.blocks.splice(fromIndex, 1);
      this.state.blocks.splice(toIndex, 0, block);
      this.notifySubscribers();
    }
  }

  clear(): void {
    this.state.blocks = [];
    this.notifySubscribers();
  }

  undo(): void {
    // No-op in mock
  }

  redo(): void {
    // No-op in mock
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.state));
  }
}
