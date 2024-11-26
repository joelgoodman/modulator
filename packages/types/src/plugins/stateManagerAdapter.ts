import type { 
  StateManager, 
  StateManagerAdapter, 
  BlockData, 
  EditorState 
} from './plugin.js';

export class DefaultStateManagerAdapter implements StateManagerAdapter {
  private stateManager: StateManager<BlockData>;

  constructor(stateManager: StateManager<BlockData>) {
    this.stateManager = stateManager;
  }

  getState(): BlockData {
    return this.stateManager.getState();
  }

  setState(state: Partial<BlockData>): void {
    this.stateManager.setState(state);
  }

  updateState(updateFn: (state: EditorState<BlockData>) => Partial<EditorState<BlockData>>): void {
    this.stateManager.updateState(updateFn);
  }

  addBlock(block: BlockData, index?: number): string {
    return this.stateManager.addBlock(
      block, 
      index !== undefined ? { index } : undefined
    );
  }

  removeBlock(id: string): void {
    this.stateManager.removeBlock(id);
  }

  moveBlock(id: string, index: number): void {
    this.stateManager.moveBlock(id, { index });
  }

  getBlock(id: string): BlockData | undefined {
    return this.stateManager.getBlock(id);
  }

  getBlocks(): BlockData[] {
    return this.stateManager.getBlocks();
  }

  undo(): void {
    this.stateManager.undo();
  }

  redo(): void {
    this.stateManager.redo();
  }

  save(): void {
    this.stateManager.save();
  }

  restore(): void {
    this.stateManager.restore();
  }

  clear(): void {
    this.stateManager.clear();
  }
}
