import type {
  ToolbarPluginState,
  ToolbarSyncEvents,
  ToolbarPluginContext,
  ToolbarPlugin,
  ToolbarPluginRegistry,
} from '../toolbarPlugin.js';
import type { ToolbarState } from '../../ui/toolbar.js';
import type { EventEmitter } from '../../core/types.js';
import type { StateManager } from '../../core/editor.js';
import type { BlockInteractionManager } from '../../blocks/interaction.js';
import type { BaseRenderer } from '../../blocks/renderer.js';
import type { PluginStateManager } from '../plugin.js';

// Test toolbar plugin state
const validPluginState: ToolbarPluginState = {
  activeItems: ['bold', 'italic'],
  disabledItems: ['link'],
  hiddenItems: ['code'],
  itemStates: {
    bold: { pressed: true },
    italic: { pressed: false },
  },
  groupStates: {
    formatting: { isVisible: true, isCollapsed: false },
    insert: { isVisible: true, isCollapsed: true },
  },
  layout: {
    position: { type: 'floating', anchor: 'top' },
    size: 'medium',
    orientation: 'horizontal',
  },
  appearance: {
    theme: 'light',
    customClasses: ['custom-toolbar'],
    customStyles: {
      '--toolbar-bg': '#ffffff',
    },
  },
  accessibility: {
    keyboardNavigation: true,
    ariaLabels: {
      toolbar: 'Text Formatting Tools',
      bold: 'Bold Text',
    },
  },
};

// Test toolbar sync events
const validSyncEvents: ToolbarSyncEvents = {
  'toolbar:sync:state': {
    source: 'formatting-plugin',
    state: validPluginState,
  },
  'toolbar:sync:items': {
    source: 'formatting-plugin',
    items: [
      {
        id: 'bold',
        label: 'Bold',
        icon: 'bold-icon',
      },
    ],
  },
  'toolbar:sync:groups': {
    source: 'formatting-plugin',
    groups: [
      {
        id: 'formatting',
        label: 'Text Formatting',
      },
    ],
  },
  'toolbar:sync:layout': {
    source: 'formatting-plugin',
    layout: validPluginState.layout,
  },
};

// Mock event emitter
const eventEmitter: EventEmitter<any> = {
  on: () => {},
  once: () => {},
  off: () => {},
  emit: () => {},
  removeAllListeners: () => {},
  listeners: () => [],
  listenerCount: () => 0,
};

// Mock state manager
const stateManager: StateManager<any> = {
  getState: () => ({
    blocks: [],
    mode: 'edit',
    theme: 'light',
    history: { canUndo: false, canRedo: false },
  }),
  setState: () => {},
  subscribe: () => () => {},
  getBlock: () => undefined,
  getBlocks: () => [],
  addBlock: () => {},
  updateBlock: () => {},
  removeBlock: () => {},
  moveBlock: () => {},
  clear: () => {},
  undo: () => {},
  redo: () => {},
};

// Mock interaction manager
const interactionManager: BlockInteractionManager = {
  getSelection: () => null,
  setSelection: () => {},
  focusBlock: () => {},
  blurBlock: () => {},
  selectBlock: () => {},
  deselectBlock: () => {},
  handleClick: () => {},
  handleKeyDown: () => {},
  handlePaste: () => {},
  handleDrop: () => {},
};

// Mock renderer
const renderer: BaseRenderer<any> = {
  renderBlock: () => document.createElement('div'),
  updateBlock: () => {},
  removeBlock: () => {},
  focusBlock: () => {},
  blurBlock: () => {},
};

// Mock toolbar state
const toolbarState: ToolbarState = {
  activeItems: new Set<string>(),
  disabledItems: new Set<string>(),
  hiddenItems: new Set<string>(),
  groupStates: new Map(),
  getState: () => ({
    activeItems: [],
    disabledItems: [],
    hiddenItems: [],
    groupStates: {},
  }),
  setState: () => {},
  updateState: () => {},
  resetState: () => {},
  save: () => {},
  restore: () => {},
};

// Mock plugin state manager
const pluginStateManager: PluginStateManager<ToolbarPluginState> = {
  getState: () => validPluginState,
  setState: () => {},
  resetState: () => {},
  subscribe: () => () => {},
  get: () => [],
  set: () => {},
  persist: () => {},
  updateState: () => {},
  save: () => {},
  restore: () => {},
};

// Test toolbar plugin context
const context: ToolbarPluginContext = {
  eventEmitter,
  stateManager,
  interactionManager,
  renderer,
  messaging: {
    sendMessage: () => {},
    sendRequest: <R>() => Promise.resolve({} as R),
    broadcastMessage: () => {},
    onMessage: () => () => {},
    onRequest: () => () => {},
  },
  toolbarState,
  pluginState: pluginStateManager,
};

// Test toolbar plugin
const validPlugin: ToolbarPlugin = {
  id: 'formatting-toolbar',
  name: 'Formatting Toolbar',
  version: '1.0.0',
  initialize: async () => {},
  destroy: async () => {},
  recover: async () => {},
  initializeToolbar: async () => {},
  syncToolbarState: async () => {},
  handleToolbarUpdate: async () => {},
  renderToolbarItem: () => null,
  renderToolbarGroup: () => null,
  on: () => {},
  off: () => {},
  emit: () => {},
};

// Test toolbar plugin registry
const registry: ToolbarPluginRegistry = {
  register: () => {},
  unregister: () => {},
  get: () => undefined,
  getAll: () => [],
  getForBlockType: () => [],
};

// Type assignability tests
declare function expectType<T>(value: T): void;
declare function expectError<T>(value: any): void;

// Test type assignability
expectType<ToolbarPluginState>(validPluginState);
expectType<ToolbarSyncEvents>(validSyncEvents);
expectType<ToolbarPluginContext>(context);
expectType<ToolbarPlugin>(validPlugin);
expectType<ToolbarPluginRegistry>(registry);
