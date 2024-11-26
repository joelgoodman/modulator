import {
  BlockData,
  EditorState,
  ValidationResult,
  Validator
} from '@modulator/types';

export class StateManager implements Validator<EditorState> {
  private state: EditorState;
  private readonly validators: Validator<any>[];
  private historyIndex = -1;
  private subscribers = new Set<(state: EditorState) => void>();
  private batchUpdates = false;
  private pendingUpdates: Partial<EditorState>[] = [];
  private initialState: EditorState;
  private savedState?: EditorState;

  constructor(initialState?: Partial<EditorState>, validators?: Validator<any>[]) {
    this.validators = validators || [];
    this.state = this.createInitialState(initialState);
    this.initialState = this.cloneState(this.state);
  }

  validate(state: EditorState): ValidationResult<EditorState> {
    const errors: string[] = [];

    for (const validator of this.validators) {
      const result = validator.validate(state);
      if (!result.valid && result.errors) {
        errors.push(...result.errors);
      }
    }

    return {
      valid: errors.length === 0,
      value: state,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  getState(): EditorState {
    return this.cloneState(this.state);
  }

  setState(updates: Partial<EditorState>): ValidationResult<EditorState> {
    if (this.batchUpdates) {
      this.pendingUpdates.push(updates);
      return { valid: true, value: this.state, errors: undefined };
    }

    const newState = this.createNewState(updates);
    const validationResult = this.validateState(newState);
    if (validationResult.valid) {
      this.state = newState;
      this.notifySubscribers();
    }
    return validationResult;
  }

  subscribe(callback: (state: EditorState) => void): () => void {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  startBatchUpdate(): void {
    this.batchUpdates = true;
  }

  endBatchUpdate(): void {
    this.batchUpdates = false;

    const mergedUpdates = this.pendingUpdates.reduce(
      (acc, update) => ({ ...acc, ...update }),
      {}
    );

    const newState = this.createNewState(mergedUpdates);
    const validationResult = this.validateState(newState);
    if (validationResult.valid) {
      this.state = newState;
      this.notifySubscribers();
    }

    this.pendingUpdates = [];
  }

  getBlock(id: string): BlockData | undefined {
    return this.state.blocks.find(block => block.id === id);
  }

  getBlocks(): BlockData[] {
    return [...this.state.blocks];
  }

  addBlock(block: Omit<BlockData, 'id'>, position?: { index: number }): string {
    const id = this.generateId();
    const newBlock = { ...block, id } as BlockData;
    const blocks = [...this.state.blocks];
    
    if (position?.index !== undefined) {
      blocks.splice(position.index, 0, newBlock);
    } else {
      blocks.push(newBlock);
    }

    this.setState({ blocks });
    return id;
  }

  updateBlock(id: string, data: Partial<BlockData> | ((block: BlockData) => BlockData)): void {
    const blocks = this.state.blocks.map(block => {
      if (block.id === id) {
        if (typeof data === 'function') {
          return data(block);
        }
        return { ...block, ...data };
      }
      return block;
    });

    this.setState({ blocks });
  }

  removeBlock(id: string): void {
    const blocks = this.state.blocks.filter(block => block.id !== id);
    this.setState({ blocks });
  }

  moveBlock(id: string, position: { index: number }): void {
    const blocks = [...this.state.blocks];
    const fromIndex = blocks.findIndex(block => block.id === id);
    if (fromIndex === -1) return;

    const [block] = blocks.splice(fromIndex, 1);
    blocks.splice(position.index, 0, block);
    this.setState({ blocks });
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private createNewState(updates: Partial<EditorState>): EditorState {
    const newState = this.cloneState(this.state);
    Object.assign(newState, updates);
    return newState;
  }

  private validateState(state: EditorState): ValidationResult<EditorState> {
    const errors: string[] = [];

    for (const validator of this.validators) {
      const result = validator.validate(state);
      if (!result.valid && result.errors) {
        errors.push(...result.errors);
      }
    }

    return {
      valid: errors.length === 0,
      value: state,
      errors: errors.length > 0 ? errors : undefined
    };
  }

  private cloneState(state: EditorState): EditorState {
    return {
      ...state,
      blocks: [...state.blocks],
    };
  }

  private notifySubscribers(): void {
    const state = this.getState();
    this.subscribers.forEach(callback => callback(state));
  }

  private createInitialState(initialState?: Partial<EditorState>): EditorState {
    return {
      blocks: [],
      selection: {
        blockId: '',
        start: 0,
        end: 0
      },
      dragState: {
        isDragging: false
      },
      metadata: {},
      ...initialState
    };
  }
}
