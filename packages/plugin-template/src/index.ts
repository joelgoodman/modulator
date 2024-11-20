import type {
  Plugin,
  PluginContext,
  PluginStateData,
  PluginStateManager,
  PluginState,
  PluginHealth,
  PluginLifecycleHooks,
  ToolbarPlugin,
  ToolbarPosition,
  ToolbarGroup,
  ToolbarItem,
} from '@modulator/types';

/**
 * Example plugin state
 */
interface ExamplePluginState extends PluginStateData {
  counter: number;
  lastClicked: string | null;
  preferences: {
    showIcon: boolean;
    position: 'left' | 'right';
  };
}

const DEFAULT_STATE: ExamplePluginState = {
  counter: 0,
  lastClicked: null,
  preferences: {
    showIcon: true,
    position: 'left',
  },
};

/**
 * Example toolbar configuration
 */
const TOOLBAR_CONFIG = {
  groups: [
    {
      id: 'example',
      label: 'Example Group',
      items: [
        {
          id: 'example-button',
          type: 'button',
          label: 'Example',
          icon: '★',
          onClick: () => console.log('Clicked!'),
        },
      ],
    },
  ],
};

/**
 * Example plugin implementation
 */
export class ExamplePlugin implements Plugin<ExamplePluginState>, ToolbarPlugin {
  id = 'example-plugin';
  name = 'Example Plugin';
  version = '1.0.0';
  initialState = DEFAULT_STATE;
  position = ToolbarPosition.TOP;
  groups = TOOLBAR_CONFIG.groups;

  async initialize(
    context: PluginContext & {
      pluginState: PluginStateManager<ExamplePluginState>;
    }
  ): Promise<void> {
    // Subscribe to events
    context.eventEmitter.on('editor:initialized', () => {
      console.log('Editor initialized');
    });

    // Initialize state
    const state = context.pluginState.getState();
    console.log('Initial state:', state);
  }

  async destroy(
    context: PluginContext & {
      pluginState: PluginStateManager<ExamplePluginState>;
    }
  ): Promise<void> {
    // Clean up
    console.log('Plugin destroyed');
  }

  async recover(
    error: Error,
    context: PluginContext & {
      pluginState: PluginStateManager<ExamplePluginState>;
    }
  ): Promise<void> {
    // Reset state on error
    context.pluginState.resetState();
    console.error('Plugin error:', error);
  }

  hooks: PluginLifecycleHooks<ExamplePluginState> = {
    beforeInit: async context => {
      console.log('Before initialization');
    },

    afterInit: async context => {
      console.log('After initialization');
    },

    beforeEnable: async context => {
      console.log('Before enable');
    },

    afterEnable: async context => {
      console.log('After enable');
    },

    beforeDisable: async context => {
      console.log('Before disable');
    },

    afterDisable: async context => {
      console.log('After disable');
    },

    onError: async (error, context) => {
      console.error('Plugin error:', error);
    },

    checkHealth: async (context): Promise<Partial<PluginHealth>> => {
      const state = context.pluginState.getState();
      return {
        status: 'healthy',
        state: PluginState.ENABLED,
        errorCount: 0,
        uptime: performance.now(),
        startTime: Date.now(),
        dependencies: [],
      };
    },
  };
}

// Re-export commonly used types for plugin authors
export type {
  Plugin,
  PluginContext,
  PluginStateData,
  PluginStateManager,
  PluginState,
  PluginHealth,
  PluginLifecycleHooks,
  ToolbarPlugin,
  ToolbarPosition,
  ToolbarGroup,
  ToolbarItem,
} from '@modulator/types';
