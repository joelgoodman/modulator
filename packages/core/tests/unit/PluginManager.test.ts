import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PluginState, BlockData, PluginHealth } from '@modulator/types';
import {
  createTestEnvironment,
  waitForPluginState,
  waitForAllPluginsHealthy,
} from '../__tests__/TestUtils.js';
import { MockPlugin } from '../__tests__/MockPlugin.js';

describe('PluginManager', () => {
  const env = createTestEnvironment();
  const { pluginManager, baseContext } = env;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllTimers();
    pluginManager.getPlugins().forEach(plugin => {
      if (pluginManager.isEnabled(plugin.id)) {
        pluginManager.disable(plugin.id);
      }
      pluginManager.unregister(plugin.id);
    });
  });

  describe('Plugin Lifecycle', () => {
    it('should register and initialize plugin', async () => {
      // Create mock plugin
      const plugin = new MockPlugin('test-plugin');

      // Register plugin
      pluginManager.register(plugin);
      expect(pluginManager.hasPlugin('test-plugin')).toBe(true);

      // Check initial state
      const state = pluginManager.getState('test-plugin');
      expect(state).toBe(PluginState.REGISTERED);

      // Enable plugin
      await pluginManager.enable('test-plugin');
      expect(plugin.initializeCalled).toBe(true);

      // Check enabled state
      expect(pluginManager.isEnabled('test-plugin')).toBe(true);

      // Check health
      const health = pluginManager.getPluginHealth('test-plugin');
      expect(health?.status).toBe('healthy');
    });

    it('should handle plugin dependencies', async () => {
      // Create plugins
      const pluginA = new MockPlugin('plugin-a');
      const pluginB = new MockPlugin('plugin-b');

      // Register with dependencies
      pluginManager.register(pluginA);
      pluginManager.register(pluginB, {
        dependencies: ['plugin-a'],
      });

      // Enable plugin B (should enable A first)
      await pluginManager.enable('plugin-b');

      // Check states
      expect(pluginManager.isEnabled('plugin-a')).toBe(true);
      expect(pluginManager.isEnabled('plugin-b')).toBe(true);

      // Try to disable plugin A (should fail)
      await expect(pluginManager.disable('plugin-a')).rejects.toThrow();

      // Disable in correct order
      await pluginManager.disable('plugin-b');
      await pluginManager.disable('plugin-a');

      expect(pluginManager.isEnabled('plugin-a')).toBe(false);
      expect(pluginManager.isEnabled('plugin-b')).toBe(false);
    });

    it('should handle plugin errors and recovery', async () => {
      // Create plugin
      const plugin = new MockPlugin('error-plugin');
      pluginManager.register(plugin);

      // Enable plugin
      await pluginManager.enable('error-plugin');

      // Simulate error
      const error = new Error('Test error');
      await plugin.hooks?.onError?.(error, {
        ...baseContext,
        pluginState: pluginManager.getStateManager('error-plugin')!,
        messaging: pluginManager.messagingManager.createPluginMessaging('error-plugin'),
      });

      // Check error state
      const health = pluginManager.getPluginHealth('error-plugin');
      expect(health?.status).toBe('degraded');
      expect(plugin.lastError).toBe(error);

      // Check unhealthy plugins
      const unhealthy = pluginManager.getUnhealthyPlugins();
      expect(unhealthy).toHaveLength(1);
      expect(unhealthy[0].id).toBe('error-plugin');

      // Wait for recovery
      await waitForPluginState(
        pluginManager,
        'error-plugin',
        health => health.status === 'healthy'
      );
      expect(plugin.errorCount).toBe(0);
    });

    it('should handle async lifecycle hooks', async () => {
      // Create plugin with slow hooks
      const plugin = new MockPlugin('async-plugin');
      const slowHook = vi
        .fn()
        .mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
      plugin.hooks = {
        ...plugin.hooks,
        beforeInit: slowHook,
        afterInit: slowHook,
        beforeEnable: slowHook,
        afterEnable: slowHook,
      };

      // Register and enable
      pluginManager.register(plugin);
      const enablePromise = pluginManager.enable('async-plugin');

      // Fast-forward timers
      await vi.runAllTimersAsync();
      await enablePromise;

      // Check hooks called
      expect(slowHook).toHaveBeenCalledTimes(4);
      expect(pluginManager.isEnabled('async-plugin')).toBe(true);
    });

    it('should handle plugin health monitoring', async () => {
      // Create plugin
      const plugin = new MockPlugin('health-plugin');
      pluginManager.register(plugin);
      await pluginManager.enable('health-plugin');

      // Check initial health
      let health = pluginManager.getPluginHealth('health-plugin');
      expect(health?.status).toBe('healthy');

      // Simulate multiple errors
      for (let i = 0; i < 4; i++) {
        await plugin.hooks?.onError?.(new Error(`Error ${i}`), {
          ...baseContext,
          pluginState: pluginManager.getStateManager('health-plugin')!,
          messaging: pluginManager.messagingManager.createPluginMessaging('health-plugin'),
        });
      }

      // Check degraded health
      health = pluginManager.getPluginHealth('health-plugin');
      expect(health?.status).toBe('unhealthy');
      expect(health?.errorCount).toBe(4);

      // Wait for health check interval
      await vi.advanceTimersByTimeAsync(30000);
      health = pluginManager.getPluginHealth('health-plugin');
      expect(health?.status).toBe('unhealthy');

      // Recover plugin
      await plugin.recover!(new Error('Recovering'), {
        ...baseContext,
        pluginState: pluginManager.getStateManager('health-plugin')!,
        messaging: pluginManager.messagingManager.createPluginMessaging('health-plugin'),
      });

      // Check recovered health
      health = pluginManager.getPluginHealth('health-plugin');
      expect(health?.status).toBe('healthy');
      expect(health?.errorCount).toBe(0);
    });
  });

  describe('Plugin State Management', () => {
    it('should manage plugin state', async () => {
      const plugin = new MockPlugin('state-plugin');
      pluginManager.register(plugin);
      await pluginManager.enable('state-plugin');

      const stateManager = pluginManager.getStateManager('state-plugin')!;

      // Update state
      stateManager.setState({ count: 1 });
      expect(stateManager.getState().count).toBe(1);

      // Reset state
      stateManager.resetState();
      expect(stateManager.getState().count).toBe(0);

      // Subscribe to changes
      const handler = vi.fn();
      const unsubscribe = stateManager.subscribe(handler);

      stateManager.setState({ count: 2 });
      expect(handler).toHaveBeenCalledWith({ count: 2, data: {} });

      unsubscribe();
      stateManager.setState({ count: 3 });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should persist and restore plugin state', async () => {
      const plugin = new MockPlugin('persist-plugin');
      pluginManager.register(plugin, {
        persistence: {
          enabled: true,
          storage: 'memory',
        },
      });

      await pluginManager.enable('persist-plugin');
      const stateManager = pluginManager.getStateManager('persist-plugin')!;

      // Update and persist state
      stateManager.setState({ count: 5, data: { test: true } });
      await stateManager.persist();

      // Reset state
      stateManager.resetState();
      expect(stateManager.getState().count).toBe(0);

      // Restore state
      await stateManager.restore();
      expect(stateManager.getState().count).toBe(5);
      expect(stateManager.getState().data.test).toBe(true);
    });
  });

  describe('Plugin Communication', () => {
    it('should handle plugin messaging', async () => {
      const pluginA = new MockPlugin('plugin-a');
      const pluginB = new MockPlugin('plugin-b');

      pluginManager.register(pluginA);
      pluginManager.register(pluginB);

      await pluginManager.enable('plugin-a');
      await pluginManager.enable('plugin-b');

      // Send message from A to B
      const message = { type: 'test', data: { value: 42 } };
      pluginManager.messagingManager.sendMessage('plugin-a', 'plugin-b', message);

      // Check B's state was updated
      const stateB = pluginManager.getStateManager('plugin-b')!.getState();
      expect(stateB.count).toBe(1);
      expect(stateB.data.lastMessage).toEqual(message);
    });

    it('should handle plugin requests', async () => {
      const pluginA = new MockPlugin('plugin-a');
      const pluginB = new MockPlugin('plugin-b');

      pluginManager.register(pluginA);
      pluginManager.register(pluginB);

      await pluginManager.enable('plugin-a');
      await pluginManager.enable('plugin-b');

      // Send request from A to B
      const request = 42;
      const response = await pluginManager.messagingManager.sendRequest(
        'plugin-a',
        'plugin-b',
        'test',
        request
      );

      expect(response).toEqual({
        count: 0,
        data: {},
        received: request,
      });
    });
  });
});
