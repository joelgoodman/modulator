import { BlockData, EditorState, ValidationResult } from '@modulator/types';
import { StateManager } from './stateManager.js';

/**
 * Core editor implementation following a strict type-first approach
 */
export class EditorCore {
  private stateManager: StateManager;

  constructor(initialState?: Partial<EditorState>) {
    this.stateManager = new StateManager(initialState);
  }

  getState(): EditorState {
    return this.stateManager.getState();
  }

  setState(updates: Partial<EditorState>): ValidationResult<EditorState> {
    return this.stateManager.setState(updates);
  }

  getBlock(id: string): BlockData | undefined {
    return this.stateManager.getBlock(id);
  }

  getBlocks(): BlockData[] {
    return this.stateManager.getBlocks();
  }

  addBlock(block: Omit<BlockData, 'id'>, position?: { index: number }): string {
    return this.stateManager.addBlock(block, position);
  }

  updateBlock(id: string, data: Partial<BlockData> | ((block: BlockData) => BlockData)): void {
    this.stateManager.updateBlock(id, data);
  }

  removeBlock(id: string): void {
    this.stateManager.removeBlock(id);
  }

  moveBlock(id: string, position: { index: number }): void {
    this.stateManager.moveBlock(id, position);
  }

  subscribe(callback: (state: EditorState) => void): () => void {
    return this.stateManager.subscribe(callback);
  }
}
