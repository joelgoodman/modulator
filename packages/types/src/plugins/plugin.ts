/**
 * @fileoverview Plugin System Type Definitions
 * @module @modulator/types/plugins
 */

import type { BlockData } from '../blocks/types.js';
import type { BlockInteractionManager } from '../blocks/interaction.js';
import type { BaseRenderer } from '../blocks/renderer.js';
import type { EventEmitter } from '../core/types.js';
import type { EditorState } from '../core/editor.js';
import type { PluginMessaging, PluginMessageHandler, PluginRequestHandler } from './messaging.js';
import type {
  Identifiable,
  Configurable,
  StateContainer,
  Observable,
  Serializable,
  Registry,
  DeepPartial,
} from '../core/base.js';

/**
 * Base interface for plugin state data
 * @description Defines the structure of state that can be stored by plugins.
 * Uses an index signature to allow flexible state storage across different plugin types.
 * 
 * @example
 * ```typescript
 * interface MyPluginState extends PluginStateData {
 *   count: number;
 *   settings: { enabled: boolean };
 * }
 * ```
 */
export interface PluginStateData {
  [key: string]: unknown;
}

/**
 * Serializable plugin state data
 * @description A serializable version of the plugin state data
 * @template T - The type of plugin state data
 */
export type SerializablePluginState<T> = Serializable<T>;

/**
 * Interface for managing plugin-specific state
 * @description Provides a comprehensive set of methods for state updates, retrieval,
 * persistence, and state change subscriptions. Implements the StateContainer interface
 * for consistent state management across the system.
 * 
 * @template T - Type of plugin state data, defaults to PluginStateData
 */
export interface PluginStateManager<T = PluginStateData> extends StateContainer<T> {
  /**
   * Subscribe to state changes
   * @param handler - Function to call when state changes
   * @returns Unsubscribe function
   */
  subscribe(handler: (state: T) => void): () => void;

  /**
   * Retrieve a specific state value
   * @param key - Key of the state value to retrieve
   * @returns Value associated with the given key
   */
  get<K extends keyof T>(key: K): T[K];

  /**
   * Set a specific state value
   * @param key - Key of the state value to update
   * @param value - New value to set
   */
  set<K extends keyof T>(key: K, value: T[K]): void;

  /**
   * Persist the current state to storage
   */
  persist(): void;
}

/**
 * Enumeration of possible plugin lifecycle states
 * @description Represents the complete lifecycle of a plugin from registration
 * through initialization, enabling/disabling, and potential error states
 * 
 * Provides a standardized way to track a plugin's current status
 */
export enum PluginState {
  /** Plugin is registered but not yet initialized */
  REGISTERED = 'registered',
  /** Plugin is in the process of initializing */
  INITIALIZING = 'initializing',
  /** Plugin is initialized but not yet enabled */
  INITIALIZED = 'initialized',
  /** Plugin is in the process of being enabled */
  ENABLING = 'enabling',
  /** Plugin is fully enabled and running */
  ENABLED = 'enabled',
  /** Plugin is in the process of being disabled */
  DISABLING = 'disabling',
  /** Plugin is fully disabled */
  DISABLED = 'disabled',
  /** Plugin has encountered a recoverable error */
  ERROR = 'error'
}

/**
 * Comprehensive health status for a plugin
 * @description Provides detailed metrics about a plugin's current state, performance,
 * and potential issues
 */
export interface PluginHealth {
  /** Current lifecycle state of the plugin */
  state: PluginState;

  /** Overall health status */
  status: 'healthy' | 'degraded' | 'unhealthy';

  /** Most recent error encountered by the plugin */
  lastError?: Error;

  /** Total number of errors encountered */
  errorCount: number;

  /** Timestamp of the last error */
  lastErrorTime?: number;

  /** Total time the plugin has been running */
  uptime: number;

  /** Timestamp when the plugin was started */
  startTime: number;

  /** Current memory usage of the plugin */
  memoryUsage?: number;

  /** Health status of plugin dependencies */
  dependencies: Array<{
    /** Unique identifier of the dependency */
    id: string;
    /** Current state of the dependency */
    state: PluginState;
    /** Health status of the dependency */
    status: 'healthy' | 'degraded' | 'unhealthy';
  }>;
}

/**
 * Plugin lifecycle hooks interface
 * @template T - Type of plugin state data
 * @description Provides optional hooks for various stages of a plugin's lifecycle.
 * These hooks allow plugins to perform custom actions during initialization,
 * enabling, disabling, and error handling.
 * 
 * @example
 * ```typescript
 * const myPluginHooks: PluginLifecycleHooks = {
 *   async beforeInit(context) {
 *     // Perform setup before initialization
 *     await context.pluginState.setState({ initialized: false });
 *   },
 *   async afterInit(context) {
 *     // Finalize initialization
 *     await context.pluginState.setState({ initialized: true });
 *   }
 * }
 * ```
 */
export interface PluginLifecycleHooks<T = PluginStateData> {
  /**
   * Called before plugin initialization
   * @param context - Plugin context with state and messaging capabilities
   */
  beforeInit?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Called after plugin initialization
   * @param context - Plugin context with state and messaging capabilities
   */
  afterInit?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Called before plugin is enabled
   * @param context - Plugin context with state and messaging capabilities
   */
  beforeEnable?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Called after plugin is enabled
   * @param context - Plugin context with state and messaging capabilities
   */
  afterEnable?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Called before plugin is disabled
   * @param context - Plugin context with state and messaging capabilities
   */
  beforeDisable?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Called after plugin is disabled
   * @param context - Plugin context with state and messaging capabilities
   */
  afterDisable?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Called when an error occurs in the plugin
   * @param error - The error that was encountered
   * @param context - Plugin context with state and messaging capabilities
   */
  onError?(
    error: Error,
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Perform a health check for the plugin
   * @param context - Plugin context with state and messaging capabilities
   * @returns Partial health status or a promise resolving to health status
   */
  checkHealth?(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<Partial<PluginHealth>> | Partial<PluginHealth>;
}

/**
 * Core plugin interface
 * @template T - Type of plugin state data
 * @description Defines the structure and contract for a plugin in the system.
 * Plugins must implement this interface to be registered and managed.
 * 
 * @example
 * ```typescript
 * class MyPlugin implements Plugin {
 *   id = 'my-plugin';
 *   name = 'My Custom Plugin';
 *   version = '1.0.0';
 *
 *   initialize(context) {
 *     // Initialization logic
 *     context.eventEmitter.emit('plugin:initialized');
 *   }
 *
 *   destroy(context) {
 *     // Cleanup logic
 *   }
 * }
 * ```
 */
export interface Plugin<T = PluginStateData> extends Identifiable {
  /** Human-readable name of the plugin */
  name: string;

  /** Version of the plugin */
  version: string;

  /** Initial state for the plugin */
  initialState?: SerializablePluginState<T>;

  /** Optional lifecycle hooks */
  hooks?: PluginLifecycleHooks<T>;

  /**
   * Initialize the plugin
   * @param context - Plugin context with state and messaging capabilities
   */
  initialize(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Destroy and clean up plugin resources
   * @param context - Plugin context with state and messaging capabilities
   */
  destroy(
    context: PluginContext & {
      pluginState: PluginStateManager<T>;
      messaging: PluginMessaging;
    }
  ): Promise<void> | void;

  /**
   * Attempt to recover from an error
   * @param error - The error that was encountered
   * @param context - Plugin context with state and messaging capabilities
   */
  recover?(error: Error, context: PluginContext & {
    pluginState: PluginStateManager<T>;
    messaging: PluginMessaging;
  }): Promise<void> | void;
}

/**
 * Events that can be emitted by plugins
 */
export interface PluginEvents {
  'plugin:initialized': void;
  'plugin:enabled': void;
  'plugin:disabled': void;
  'plugin:error': Error;
  'plugin:state:changed': Record<string, unknown>;
  'plugin:health:changed': PluginHealth;
}

/**
 * Plugin context interface
 * @description Provides plugins with access to core system services and capabilities.
 * Includes event handling, state management, interaction management,
 * rendering, and inter-plugin messaging.
 * 
 * @example
 * ```typescript
 * function somePluginMethod(context: PluginContext) {
 *   // Access event emitter
 *   context.eventEmitter.emit('plugin:initialized');
 *
 *   // Interact with state manager
 *   const currentState = context.stateManager.getState();
 * }
 * ```
 */
export interface PluginContext {
  /** Event emitter for plugin-specific events */
  eventEmitter: EventEmitter<PluginEvents>;

  /** State manager for block data */
  stateManager: StateManagerAdapter;

  /** Manager for block interactions */
  interactionManager: BlockInteractionManager;

  /** Renderer for block content */
  renderer: BaseRenderer;

  /** Messaging system for inter-plugin communication */
  messaging: PluginMessaging;

  /** Optional plugin state manager */
  pluginStateManager?: PluginStateManager<PluginStateData>;
}

/**
 * Plugin configuration interface
 * @description Defines configuration options for plugins, including
 * initialization, persistence, dependencies, and runtime behavior.
 * 
 * @example
 * ```typescript
 * const pluginConfig: PluginConfig = {
 *   enabled: true,
 *   priority: 10,
 *   dependencies: ['core-plugin'],
 *   persistence: {
 *     enabled: true,
 *     storage: 'local'
 *   }
 * }
 * ```
 */
export interface PluginConfig {
  /** Whether the plugin should be enabled on load */
  enabled: boolean;

  /** Custom configuration options for the plugin */
  options?: Record<string, unknown>;

  /** Plugin load priority (higher values load first) */
  priority?: number;

  /** IDs of plugins that must be loaded before this one */
  dependencies?: string[];

  /** State persistence configuration */
  persistence?: {
    /** Whether to enable state persistence */
    enabled: boolean;
    /** Storage mechanism for persisting state */
    storage?: 'local' | 'session' | 'memory';
    /** Unique key for storing plugin state */
    key?: string;
  };
}

/**
 * State manager adapter interface
 * @description Simplified interface for state management
 */
export interface StateManagerAdapter {
  getState(): BlockData;
  setState(state: DeepPartial<BlockData>): void;
  updateState(updateFn: (state: EditorState) => Partial<EditorState>): void;
  addBlock(block: BlockData, index?: number): string;
  removeBlock(id: string): void;
  moveBlock(id: string, index: number): void;
  getBlock(id: string): BlockData | undefined;
  getBlocks(): BlockData[];
  undo(): void;
  redo(): void;
  save(): void;
  restore(): void;
  clear(): void;
}

/**
 * Plugin manager interface
 * @template T - Type of plugin state data
 * @description Provides comprehensive management of plugins in the system.
 * Handles registration, lifecycle management, state control,
 * health monitoring, and inter-plugin communication.
 * 
 * @example
 * ```typescript
 * // Registering and managing a plugin
 * pluginManager.register(myPlugin, {
 *   enabled: true,
 *   priority: 5
 * });
 *
 * // Enabling a plugin
 * await pluginManager.enable('my-plugin-id');
 * ```
 */
export interface PluginManager<T = PluginStateData> extends Registry<Plugin<T>, PluginConfig> {
  /** Enable a registered plugin */
  enable(pluginId: string): Promise<void>;

  /** Disable an active plugin */
  disable(pluginId: string): Promise<void>;

  /** Get the current state of a plugin */
  getPluginState(pluginId: string): T;

  /** Update a plugin's state */
  setPluginState(pluginId: string, state: Partial<T>): void;

  /** Reset a plugin's state to initial values */
  resetPluginState(pluginId: string): void;

  /** Subscribe to a plugin's state changes */
  subscribeToState(pluginId: string, handler: (state: T) => void): () => void;

  /** Get a plugin's health status */
  getPluginHealth(pluginId: string): PluginHealth | undefined;

  /** Get all unhealthy plugins */
  getUnhealthyPlugins(): Array<{ id: string; health: PluginHealth }>;

  /** Send a message to a specific plugin */
  sendMessage(source: string, target: string, data: unknown): void;

  /** Broadcast a message to all plugins */
  broadcastMessage(source: string, channel: string, data: unknown): void;

  /** Send a request to a plugin and wait for a response */
  sendRequest(source: string, target: string, data: unknown, timeout?: number): Promise<unknown>;

  /** Register a handler for plugin messages */
  registerMessageHandler(pluginId: string, handler: PluginMessageHandler): () => void;

  /** Register a handler for plugin requests */
  registerRequestHandler(
    pluginId: string,
    channel: string,
    handler: PluginRequestHandler
  ): () => void;
}
