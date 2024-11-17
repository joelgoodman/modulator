import { Block } from '../blocks/index.js';
import {
  BlockData,
  EditorOptions,
  EditorState,
  EditorCommand,
  Theme,
  BlockEvent,
  StateManager as StateManagerInterface,
} from '@modulator/types';
import { StateManager } from '../state/index.js';
import { BaseRenderer, DefaultRenderer } from '../rendering/renderer.js';
import { EventEmitter } from '../events/EventEmitter.js';

/**
 * Main editor class
 */
export class ModulatorEditor<T extends BlockData = BlockData> {
  private container: HTMLElement;
  private contentContainer!: HTMLElement; // Will be initialized in setupContainer
  private stateManager: StateManagerInterface<T>;
  private renderer: BaseRenderer;
  private eventEmitter: EventEmitter;
  private options: EditorOptions<T>;

  constructor(options: EditorOptions<T>) {
    this.options = options;
    this.container = options.container;
    this.eventEmitter = new EventEmitter();

    // Initialize managers
    this.stateManager = new StateManager<T>();
    this.renderer = new DefaultRenderer();

    // Set initial state
    const initialState: EditorState<T> = {
      blocks: [],
      selectedBlock: options.state?.selectedBlock,
      mode: options.mode || 'edit',
      theme: options.theme || 'light',
      history: { canUndo: false, canRedo: false },
    };
    this.updateState(initialState);

    this.initialize();
  }

  /**
   * Update editor state
   */
  private updateState(state: Partial<EditorState<T>>): void {
    const currentState = this.stateManager.getState();
    Object.assign(currentState, state);
    // @ts-ignore: setState exists on implementation but not interface
    this.stateManager.setState(currentState);
  }

  /**
   * Initialize editor
   */
  private initialize(): void {
    try {
      this.setupContainer();
      this.setupTheme();
      this.loadInitialBlocks();
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize editor:', error);
      this.cleanup();
      throw error;
    }
  }

  /**
   * Setup editor container
   */
  private setupContainer(): void {
    this.container.classList.add('modulator-editor');
    this.container.setAttribute('role', 'textbox');
    this.container.setAttribute('aria-multiline', 'true');
    this.container.setAttribute('contenteditable', 'true');

    this.contentContainer = document.createElement('div');
    this.contentContainer.classList.add('modulator-content');
    this.container.appendChild(this.contentContainer);
  }

  /**
   * Setup editor theme
   */
  private setupTheme(): void {
    const theme = this.stateManager.getState().theme as Theme;
    this.container.setAttribute('data-theme', theme);
  }

  /**
   * Load initial blocks
   */
  private loadInitialBlocks(): void {
    if (this.options.initialBlocks) {
      this.options.initialBlocks.forEach(blockData => {
        const block = new Block<T>({
          id: blockData.id,
          type: blockData.type,
          data: blockData,
        });

        // Add block to state
        const blocks = [...this.stateManager.getState().blocks, blockData];
        this.updateState({ blocks });

        // Render block
        const element = this.renderer.render(block);
        this.contentContainer.appendChild(element);

        // Emit block created event
        this.eventEmitter.emit<BlockEvent>({
          type: 'block:created',
          blockId: block.id,
          data: { blockData: block.data },
        });
      });
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    this.stateManager.subscribe(state => {
      this.eventEmitter.emit<BlockEvent>({
        type: 'editor:state-changed',
        blockId: '',
        data: { state },
      });
    });
  }

  /**
   * Get editor state
   */
  getState(): EditorState<T> {
    return this.stateManager.getState();
  }

  /**
   * Execute editor command
   */
  executeCommand(command: EditorCommand): void {
    // TODO: Implement command execution
  }

  /**
   * Cleanup resources
   */
  private cleanup(): void {
    this.eventEmitter.clear();
    this.stateManager.clear();
    this.contentContainer.remove();
  }

  /**
   * Destroy editor
   */
  destroy(): void {
    this.cleanup();
  }
}
