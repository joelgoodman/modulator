import type { BlockData, PluginContext } from '@modulator/types';
import { EventEmitter } from '../../src/events/EventEmitter.js';
import { PluginManager, PluginHealth } from '../../src/plugins/PluginManager.js';
import { MockStorage } from './MockStorage.js';
import { MockBlockInteractionManager } from './MockBlockInteractionManager.js';
import { MockRenderer } from './MockRenderer.js';
import { MockStateManager } from './MockStateManager.js';

/**
 * Create test environment
 */
export function createTestEnvironment<T extends BlockData = BlockData>(
  options: {
    errorRate?: number;
    latency?: number;
  } = {}
) {
  const eventEmitter = new EventEmitter();
  const stateManager = new MockStateManager<T>();
  const interactionManager = new MockBlockInteractionManager();
  const renderer = new MockRenderer<T>();
  const storage = new MockStorage(options);

  const pluginManager = new PluginManager<T>(stateManager, interactionManager, renderer);

  const baseContext = {
    eventEmitter,
    stateManager,
    interactionManager,
    renderer,
    messaging: pluginManager.messagingManager.createPluginMessaging('system'),
  } satisfies PluginContext<T>;

  return {
    eventEmitter,
    stateManager,
    interactionManager,
    renderer,
    pluginManager,
    storage,
    baseContext,
  };
}

/**
 * Wait for plugin state
 */
export async function waitForPluginState(
  pluginManager: PluginManager,
  pluginId: string,
  predicate: (health: PluginHealth) => boolean,
  timeout = 5000
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const health = pluginManager.getPluginHealth(pluginId);
    if (health && predicate(health)) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error(`Timeout waiting for plugin ${pluginId} state`);
}

/**
 * Wait for all plugins healthy
 */
export async function waitForAllPluginsHealthy(
  pluginManager: PluginManager,
  timeout = 5000
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const unhealthy = pluginManager.getUnhealthyPlugins();
    if (unhealthy.length === 0) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  throw new Error('Timeout waiting for all plugins to be healthy');
}
