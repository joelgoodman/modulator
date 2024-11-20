import type { BlockData } from '../blocks/types.js';
import type { BlockInteractionManager } from '../blocks/interaction.js';
import type { BaseRenderer } from '../blocks/renderer.js';
import type { EventEmitter } from '../core/types.js';
import type { StateManager } from '../core/editor.js';
import type { PluginMessaging } from './messaging.js';

/**
 * Plugin state data
 */
export interface PluginStateData {
  [key: string]: unknown;
}

/**
 * Plugin state manager interface
 */
export interface PluginStateManager<T extends PluginStateData = PluginStateData> {
  /**
   * Get current state
   */
  getState(): T;

  /**
   * Update state
   */
  setState(state: Partial<T>): void;

  /**
   * Reset state to initial
   */
  resetState(): void;

  /**
   * Subscribe to state changes
   */
  subscribe(handler: (state: T) => void): () => void;

  /**
   * Get state value
   */
  get<K extends keyof T>(key: K): T[K];

  /**
   * Set state value
   */
  set<K extends keyof T>(key: K, value: T[K]): void;

  /**
   * Persist state
   */
  persist(): void;
}

/**
 * Plugin lifecycle states
 */
export enum PluginState {
  /**
   * Plugin is registered but not initialized
   */
  REGISTERED = 'REGISTERED',
  /**
   * Plugin is initializing
   */
  INITIALIZING = 'INITIALIZING',
  /**
   * Plugin is initialized but not enabled
   */
  INITIALIZED = 'INITIALIZED',
  /**
   * Plugin is enabling
   */
  ENABLING = 'ENABLING',
  /**
   * Plugin is enabled and running
   */
  ENABLED = 'ENABLED',
  /**
   * Plugin is disabling
   */
  DISABLING = 'DISABLING',
  /**
   * Plugin is disabled
   */
  DISABLED = 'DISABLED',
  /**
   * Plugin encountered an error
   */
  ERROR = 'ERROR',
  /**
   * Plugin crashed
   */
  CRASHED = 'CRASHED',
}

/**
 * Plugin health status
 */
export interface PluginHealth {
  /**
   * Plugin state
   */
  state: PluginState;

  /**
   * Health status
   */
  status: 'healthy' | 'degraded' | 'unhealthy';

  /**
   * Last error
   */
  lastError?: Error;

  /**
   * Error count
   */
  errorCount: number;

  /**
   * Last error time
   */
  lastErrorTime?: number;

  /**
   * Uptime in ms
   */
  uptime: number;

  /**
   * Start time
   */
  startTime: number;

  /**
   * Memory usage in bytes
   */
  memoryUsage?: number;

  /**
   * Dependency health
   */
  dependencies: {
    id: string;
    state: PluginState;
    status: 'healthy' | 'degraded' | 'unhealthy';
  }[];
}

/**
 * Plugin lifecycle hooks
 */
export interface PluginLifecycleHooks<T extends PluginStateData = PluginStateData> {
  /**
   * Before initialization
   */
  beforeInit?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * After initialization
   */
  afterInit?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Before enable
   */
  beforeEnable?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * After enable
   */
  afterEnable?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Before disable
   */
  beforeDisable?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * After disable
   */
  afterDisable?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * On error
   */
  onError?(
    error: Error,
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Health check
   */
  checkHealth?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<Partial<PluginHealth>> | Partial<PluginHealth>;
}

/**
 * Plugin interface
 */
export interface Plugin<T extends PluginStateData = PluginStateData> {
  /**
   * Plugin ID
   */
  id: string;

  /**
   * Plugin name
   */
  name: string;

  /**
   * Plugin version
   */
  version: string;

  /**
   * Initial state
   */
  initialState?: T;

  /**
   * Lifecycle hooks
   */
  hooks?: PluginLifecycleHooks<T>;

  /**
   * Initialize plugin
   */
  initialize(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Cleanup plugin
   */
  destroy?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Error recovery
   */
  recover?(
    error: Error,
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;
}

/**
 * Plugin context
 */
export interface PluginContext {
  /**
   * Event emitter
   */
  eventEmitter: EventEmitter;

  /**
   * State manager
   */
  stateManager: StateManager<BlockData>;

  /**
   * Interaction manager
   */
  interactionManager: BlockInteractionManager;

  /**
   * Renderer
   */
  renderer: BaseRenderer;

  /**
   * Messaging
   */
  messaging: PluginMessaging;
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
  /**
   * Enable plugin
   */
  enabled: boolean;

  /**
   * Plugin options
   */
  options?: Record<string, unknown>;

  /**
   * Load priority
   */
  priority?: number;

  /**
   * Plugin dependencies
   */
  dependencies?: string[];

  /**
   * State persistence
   */
  persistence?: {
    enabled: boolean;
    storage?: 'local' | 'session' | 'memory';
    key?: string;
  };
}

/**
 * Plugin manager interface
 */
export interface PluginManager<T extends PluginStateData = PluginStateData> {
  /**
   * Register a plugin
   */
  register(plugin: Plugin<T>, config?: PluginConfig): void;

  /**
   * Unregister a plugin
   */
  unregister(pluginId: string): void;

  /**
   * Enable a plugin
   */
  enable(pluginId: string): Promise<void>;

  /**
   * Disable a plugin
   */
  disable(pluginId: string): Promise<void>;

  /**
   * Get plugin state
   */
  getPluginState(pluginId: string): T;

  /**
   * Set plugin state
   */
  setPluginState(pluginId: string, state: Partial<T>): void;

  /**
   * Reset plugin state
   */
  resetPluginState(pluginId: string): void;

  /**
   * Subscribe to plugin state changes
   */
  subscribeToState(pluginId: string, handler: (state: T) => void): () => void;

  /**
   * Get plugin health
   */
  getPluginHealth(pluginId: string): PluginHealth | undefined;

  /**
   * Get unhealthy plugins
   */
  getUnhealthyPlugins(): { id: string; health: PluginHealth }[];

  /**
   * Send message to plugin
   */
  sendMessage(source: string, target: string, data: unknown): void;

  /**
   * Broadcast message to all plugins
   */
  broadcastMessage(source: string, channel: string, data: unknown): void;

  /**
   * Send request to plugin
   */
  sendRequest(source: string, target: string, data: unknown, timeout?: number): Promise<unknown>;

  /**
   * Register message handler
   */
  registerMessageHandler(pluginId: string, handler: PluginMessageHandler): () => void;

  /**
   * Register request handler
   */
  registerRequestHandler(
    pluginId: string,
    channel: string,
    handler: PluginRequestHandler
  ): () => void;
}
