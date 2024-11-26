import type { BlockData } from '../blocks/index.js';
import type { ModulatorConfig } from '../ui/config.js';

/**
 * Configuration options for editor initialization
 * @template T - Type of block data, defaults to BlockData
 * @extends ModulatorConfig
 * @remarks
 * This interface defines all configuration options available when creating a new editor instance.
 * It extends the base ModulatorConfig to include editor-specific options.
 */
export interface EditorOptions<T extends BlockData = BlockData> extends ModulatorConfig {
  /**
   * DOM element where the editor will be rendered
   * @remarks
   * Must be a valid HTMLElement that exists in the DOM when the editor is initialized
   */
  container: HTMLElement;

  /**
   * Blocks to populate the editor with during initialization
   * @remarks
   * If not provided, the editor will start empty
   */
  initialBlocks?: T[];

  /**
   * Operating mode of the editor
   * @remarks
   * - 'edit': Full editing capabilities enabled
   * - 'read': Read-only mode, no editing allowed
   * - 'preview': Preview mode with limited interactivity
   * @default 'edit'
   */
  mode?: 'edit' | 'read' | 'preview';

  /**
   * Initial editor state configuration
   * @remarks
   * Allows setting initial selection and focus state
   */
  state?: {
    /**
     * ID of block that should be initially selected
     * @remarks
     * Must correspond to a block in initialBlocks
     */
    selectedBlock?: string;

    /**
     * Initial text selection range
     * @remarks
     * Only applicable if selectedBlock is set
     */
    selection?: Range | null;
  };

  /**
   * UI component visibility configuration
   * @remarks
   * Controls which UI elements are shown in the editor
   */
  ui?: {
    /**
     * Whether to show the toolbar
     * @default true
     */
    toolbar?: boolean;

    /**
     * Whether to show block manipulation handles
     * @default true
     */
    blockHandles?: boolean;

    /**
     * Whether to show the block insertion menu
     * @default true
     */
    blockMenu?: boolean;
  };
}

/**
 * Current state of the editor
 * @template T - Type of block data, defaults to BlockData
 * @remarks
 * Represents the complete state of the editor at any given time,
 * including content, selection, mode, and history state.
 */
export interface EditorState<T extends BlockData = BlockData> {
  /**
   * Array of all blocks in the editor
   * @remarks
   * Blocks are stored in order of appearance
   */
  blocks: T[];

  /**
   * ID of the currently selected block
   * @remarks
   * undefined if no block is selected
   */
  selectedBlock?: string;

  /**
   * Current operating mode of the editor
   * @see EditorOptions.mode for possible values
   */
  mode: 'edit' | 'read' | 'preview';

  /**
   * Currently active theme
   * @remarks
   * Must correspond to a registered theme
   */
  theme: string;

  /**
   * Indicates whether the editor state has been modified
   * @remarks
   * Useful for tracking unsaved changes
   */
  isModified: boolean;

  /**
   * Version of the current editor state
   * @remarks
   * Can be used for tracking state changes and versioning
   */
  version: string;

  /**
   * Undo/redo history state
   * @remarks
   * Tracks whether history operations are available
   */
  history: {
    /**
     * Whether there are changes that can be undone
     */
    canUndo: boolean;

    /**
     * Whether there are undone changes that can be redone
     */
    canRedo: boolean;
  };
}

/**
 * Interface for managing editor state
 * @template T - Type of block data, defaults to BlockData
 * @remarks
 * Provides methods for reading and modifying editor state,
 * managing blocks, and handling undo/redo operations.
 */
export interface StateManager<T extends BlockData = BlockData> {
  /**
   * Get the current editor state
   * @returns Current state of the editor
   */
  getState(): EditorState<T>;

  /**
   * Update the editor state
   * @param state - Partial state to merge with current state
   * @remarks
   * Only provided fields will be updated
   */
  setState(state: Partial<EditorState<T>>): void;

  /**
   * Subscribe to state changes
   * @param callback - Function to call when state changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (state: EditorState<T>) => void): () => void;

  /**
   * Retrieve a block by its ID
   * @param id - ID of the block to retrieve
   * @returns The block if found, undefined otherwise
   */
  getBlock(id: string): T | undefined;

  /**
   * Get all blocks in the editor
   * @returns Array of all blocks in order
   */
  getBlocks(): T[];

  /**
   * Add a new block to the editor
   * @param block - Block to add
   * @param index - Optional index to insert at
   * @remarks
   * If index is not provided, block is added at the end
   */
  addBlock(block: T, index?: number): void;

  /**
   * Update an existing block
   * @param id - ID of block to update
   * @param data - Partial block data to merge
   */
  updateBlock(id: string, data: Partial<T>): void;

  /**
   * Remove a block from the editor
   * @param id - ID of block to remove
   */
  removeBlock(id: string): void;

  /**
   * Move a block to a new position
   * @param id - ID of block to move
   * @param toIndex - Destination index
   */
  moveBlock(id: string, toIndex: number): void;

  /**
   * Clear all blocks from the editor
   */
  clear(): void;

  /**
   * Undo the last change
   * @remarks
   * Only available if history.canUndo is true
   */
  undo(): void;

  /**
   * Redo the last undone change
   * @remarks
   * Only available if history.canRedo is true
   */
  redo(): void;
}
