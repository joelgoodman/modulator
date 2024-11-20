import type {
  Plugin,
  PluginContext,
  PluginStateData,
  PluginStateManager,
  PluginState,
  PluginHealth,
} from '@modulator/types/plugins';

interface HighlightState extends PluginStateData {
  highlightedBlocks: string[];
  highlightColor: string;
}

const DEFAULT_STATE: HighlightState = {
  highlightedBlocks: [],
  highlightColor: '#ffeb3b',
};

export class HighlightPlugin implements Plugin<HighlightState> {
  id = 'highlight-plugin';
  name = 'Block Highlighter';
  version = '0.1.0';
  initialState = DEFAULT_STATE;

  async initialize(
    context: PluginContext & {
      pluginState: PluginStateManager<HighlightState>;
    }
  ): Promise<void> {
    // Subscribe to block selection events
    context.eventEmitter.on('block:selected', event => {
      const state = context.pluginState.getState();
      if (!state.highlightedBlocks.includes(event.blockId)) {
        context.pluginState.setState({
          highlightedBlocks: [...state.highlightedBlocks, event.blockId],
        });
      }
    });

    context.eventEmitter.on('block:deselected', event => {
      const state = context.pluginState.getState();
      context.pluginState.setState({
        highlightedBlocks: state.highlightedBlocks.filter(id => id !== event.blockId),
      });
    });
  }

  async destroy(
    context: PluginContext & {
      pluginState: PluginStateManager<HighlightState>;
    }
  ): Promise<void> {
    // Clean up any highlighted blocks
    const state = context.pluginState.getState();
    state.highlightedBlocks.forEach(blockId => {
      const block = context.stateManager.getBlock(blockId);
      if (block) {
        // Remove highlight styles
        const element = document.getElementById(blockId);
        if (element) {
          element.style.backgroundColor = '';
        }
      }
    });
  }

  async recover(
    error: Error,
    context: PluginContext & {
      pluginState: PluginStateManager<HighlightState>;
    }
  ): Promise<void> {
    // Reset state on error
    context.pluginState.resetState();
  }

  hooks = {
    beforeEnable: async (
      context: PluginContext & {
        pluginState: PluginStateManager<HighlightState>;
      }
    ) => {
      // Apply highlights to any existing highlighted blocks
      const state = context.pluginState.getState();
      state.highlightedBlocks.forEach(blockId => {
        const block = context.stateManager.getBlock(blockId);
        if (block) {
          // Apply highlight styles
          const element = document.getElementById(blockId);
          if (element) {
            element.style.backgroundColor = state.highlightColor;
          }
        }
      });
    },

    beforeDisable: async (
      context: PluginContext & {
        pluginState: PluginStateManager<HighlightState>;
      }
    ) => {
      // Remove all highlights
      const state = context.pluginState.getState();
      state.highlightedBlocks.forEach(blockId => {
        const block = context.stateManager.getBlock(blockId);
        if (block) {
          // Remove highlight styles
          const element = document.getElementById(blockId);
          if (element) {
            element.style.backgroundColor = '';
          }
        }
      });
    },

    checkHealth: async (
      context: PluginContext & {
        pluginState: PluginStateManager<HighlightState>;
      }
    ): Promise<Partial<PluginHealth>> => {
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
