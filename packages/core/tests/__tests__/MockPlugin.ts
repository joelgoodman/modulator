import {
  Plugin,
  PluginContext,
  PluginStateManager,
  PluginStateData,
  PluginMessaging,
  PluginLifecycleHooks,
  PluginHealth,
} from '@modulator/types';

/**
 * Mock plugin state
 */
export interface MockPluginState extends PluginStateData {
  count: number;
  data: Record<string, unknown>;
}

/**
 * Mock plugin for testing
 */
export class MockPlugin implements Plugin<MockPluginState> {
  public initializeCalled = false;
  public destroyCalled = false;
  public errorCount = 0;
  public lastError: Error | null = null;
  public healthStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

  constructor(
    public id: string,
    public name: string = 'Mock Plugin',
    public version: string = '1.0.0'
  ) {}

  public initialState: MockPluginState = {
    count: 0,
    data: {},
  };

  public hooks: PluginLifecycleHooks<MockPluginState> = {
    beforeInit: async context => {
      // Simulate async work
      await new Promise(resolve => setTimeout(resolve, 10));
    },

    afterInit: async context => {
      this.initializeCalled = true;
    },

    beforeEnable: async context => {
      // Simulate async work
      await new Promise(resolve => setTimeout(resolve, 10));
    },

    afterEnable: async context => {
      // Simulate enabled state
    },

    beforeDisable: async context => {
      // Simulate async work
      await new Promise(resolve => setTimeout(resolve, 10));
    },

    afterDisable: async context => {
      // Simulate disabled state
    },

    onError: async (error, context) => {
      this.errorCount++;
      this.lastError = error;
      this.healthStatus = this.errorCount > 3 ? 'unhealthy' : 'degraded';
    },

    checkHealth: async context => {
      return {
        status: this.healthStatus,
        errorCount: this.errorCount,
        memoryUsage: Math.random() * 100,
      };
    },
  };

  public async initialize(
    context: PluginContext & {
      pluginState: PluginStateManager<MockPluginState>;
      messaging: PluginMessaging;
    }
  ): Promise<void> {
    // Set up message handlers
    context.messaging.onMessage(message => {
      const state = context.pluginState.getState();
      context.pluginState.setState({
        count: state.count + 1,
        data: {
          ...state.data,
          lastMessage: message,
        },
      });
    });

    // Set up request handlers
    context.messaging.onRequest('test', async data => {
      const state = context.pluginState.getState();
      return {
        count: state.count,
        data: state.data,
        received: data,
      };
    });
  }

  public async destroy(
    context: PluginContext & {
      pluginState: PluginStateManager<MockPluginState>;
      messaging: PluginMessaging;
    }
  ): Promise<void> {
    this.destroyCalled = true;
    await context.pluginState.persist();
  }

  public async recover(
    error: Error,
    context: PluginContext & {
      pluginState: PluginStateManager<MockPluginState>;
      messaging: PluginMessaging;
    }
  ): Promise<void> {
    // Reset state
    context.pluginState.resetState();
    this.errorCount = 0;
    this.lastError = null;
    this.healthStatus = 'healthy';
  }
}
