import type { BlockData } from '../blocks/index.js';
import type { ModulatorConfig } from '../ui/config.js';

/**
 * Editor options extending core configuration
 */
export interface EditorOptions<T extends BlockData = BlockData> extends ModulatorConfig {
  /**
   * Container element to render the editor
   */
  container: HTMLElement;

  /**
   * Initial blocks to load
   */
  initialBlocks?: T[];

  /**
   * Editor mode (default: 'edit')
   */
  mode?: 'edit' | 'read' | 'preview';

  /**
   * Editor state
   */
  state?: {
    /**
     * Currently selected block ID
     */
    selectedBlock?: string;

    /**
     * Current selection range
     */
    selection?: Range | null;
  };

  /**
   * Editor UI options
   */
  ui?: {
    /**
     * Show toolbar
     */
    toolbar?: boolean;

    /**
     * Show block handles
     */
    blockHandles?: boolean;

    /**
     * Show block menu
     */
    blockMenu?: boolean;
  };
}

/**
 * Editor state
 */
export interface EditorState<T extends BlockData = BlockData> {
  /**
   * List of blocks
   */
  blocks: T[];

  /**
   * Currently selected block ID
   */
  selectedBlock?: string;

  /**
   * Editor mode
   */
  mode: 'edit' | 'read' | 'preview';

  /**
   * Editor theme
   */
  theme: string;

  /**
   * History state
   */
  history: {
    /**
     * Can undo
     */
    canUndo: boolean;

    /**
     * Can redo
     */
    canRedo: boolean;
  };
}

/**
 * Editor commands
 */
export type EditorCommand =
  | 'undo'
  | 'redo'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'code'
  | 'link';

/**
 * State manager interface
 */
export interface StateManager<T extends BlockData = BlockData> {
  /**
   * Get current state
   */
  getState(): EditorState<T>;

  /**
   * Update state
   */
  setState(state: Partial<EditorState<T>>): void;

  /**
   * Subscribe to state changes
   */
  subscribe(callback: (state: EditorState<T>) => void): () => void;

  /**
   * Get block by ID
   */
  getBlock(id: string): T | undefined;

  /**
   * Get all blocks
   */
  getBlocks(): T[];

  /**
   * Add block
   */
  addBlock(block: T, index?: number): void;

  /**
   * Update block
   */
  updateBlock(id: string, data: Partial<T>): void;

  /**
   * Remove block
   */
  removeBlock(id: string): void;

  /**
   * Move block
   */
  moveBlock(id: string, toIndex: number): void;

  /**
   * Clear state
   */
  clear(): void;

  /**
   * Undo last change
   */
  undo(): void;

  /**
   * Redo last undone change
   */
  redo(): void;
}
