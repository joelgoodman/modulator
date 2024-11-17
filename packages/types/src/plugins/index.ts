import { EventEmitter } from './event.js';
import { StateManager } from './editor.js';
import { BlockInteractionManager, BlockData } from './blocks.js';
import { BaseRenderer } from './renderer.js';
import { PluginMessaging } from './messaging.js';

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

  /**
   * Restore persisted state
   */
  restore(): void;
}

/**
 * Plugin lifecycle states
 */
export enum PluginState {
  REGISTERED = 'registered',
  INITIALIZING = 'initializing',
  INITIALIZED = 'initialized',
  LOADING = 'loading',
  LOADED = 'loaded',
  ENABLING = 'enabling',
  ENABLED = 'enabled',
  DISABLING = 'disabling',
  DISABLED = 'disabled',
  ERROR = 'error',
  CRASHED = 'crashed',
}

/**
 * Plugin health status
 */
export interface PluginHealth {
  state: PluginState;
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastError?: Error;
  errorCount: number;
  lastErrorTime?: number;
  uptime: number;
  startTime: number;
  memoryUsage?: number;
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
   * Called before plugin initialization
   */
  beforeInit?: (
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;

  /**
   * Called after plugin initialization
   */
  afterInit?: (
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;

  /**
   * Called before plugin is enabled
   */
  beforeEnable?: (
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;

  /**
   * Called after plugin is enabled
   */
  afterEnable?: (
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;

  /**
   * Called before plugin is disabled
   */
  beforeDisable?: (
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;

  /**
   * Called after plugin is disabled
   */
  afterDisable?: (
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;

  /**
   * Called when plugin encounters an error
   */
  onError?: (
    error: Error,
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;

  /**
   * Called to check plugin health
   */
  checkHealth?: (
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<Partial<PluginHealth>> | Partial<PluginHealth>;
}

/**
 * Base Plugin Interface
 */
export interface Plugin<T extends PluginStateData = PluginStateData> {
  /**
   * Unique identifier for the plugin
   */
  id: string;

  /**
   * Display name of the plugin
   */
  name: string;

  /**
   * Plugin version (semver)
   */
  version: string;

  /**
   * Initial plugin state
   */
  initialState?: T;

  /**
   * Plugin lifecycle hooks
   */
  hooks?: PluginLifecycleHooks<T>;

  /**
   * Initialize the plugin
   */
  initialize: (
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;

  /**
   * Clean up plugin resources
   */
  destroy?: (
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;

  /**
   * Recover from error
   */
  recover?: (
    error: Error,
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ) => Promise<void> | void;
}

/**
 * Context provided to plugins
 */
export interface PluginContext<T extends BlockData = BlockData> {
  eventEmitter: EventEmitter;
  stateManager: StateManager<T>;
  interactionManager: BlockInteractionManager;
  renderer: BaseRenderer<T>;
  messaging: PluginMessaging;
}

/**
 * Plugin configuration
 */
export interface PluginConfig {
  /**
   * Whether the plugin is enabled
   */
  enabled: boolean;

  /**
   * Plugin-specific options
   */
  options?: Record<string, unknown>;

  /**
   * Plugin priority (higher runs first)
   */
  priority?: number;

  /**
   * Plugin dependencies
   */
  dependencies?: string[];

  /**
   * State persistence options
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
export interface PluginManagerContext {
  /**
   * Register a plugin
   */
  register(plugin: Plugin, config?: PluginConfig): void;

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
   * Get plugin configuration
   */
  getConfig(pluginId: string): PluginConfig | undefined;

  /**
   * Update plugin configuration
   */
  updateConfig(pluginId: string, config: Partial<PluginConfig>): void;

  /**
   * Get plugin state manager
   */
  getStateManager(pluginId: string): PluginStateManager | undefined;

  /**
   * Get plugin lifecycle state
   */
  getState(pluginId: string): PluginState;

  /**
   * Get all registered plugins
   */
  getPlugins(): Plugin[];

  /**
   * Get enabled plugins
   */
  getEnabledPlugins(): Plugin[];

  /**
   * Check if plugin exists
   */
  hasPlugin(pluginId: string): boolean;

  /**
   * Check if plugin is enabled
   */
  isEnabled(pluginId: string): boolean;

  /**
   * Get plugin health
   */
  getPluginHealth(pluginId: string): PluginHealth | undefined;

  /**
   * Get unhealthy plugins
   */
  getUnhealthyPlugins(): { id: string; health: PluginHealth }[];
}
