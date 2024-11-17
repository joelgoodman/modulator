import {
  Plugin,
  PluginContext,
  PluginState,
  PluginConfig,
  PluginStateManager,
  PluginStateData,
  BlockEvent,
  StateManager,
  BlockInteractionManager,
  BaseRenderer,
  PluginMessage,
  PluginMessageHandler,
  PluginRequestHandler,
  PluginMessaging,
  BlockData,
} from '@modulator/types';
import { EventEmitter } from '../events/EventEmitter.js';
import { MessagingManager } from './messaging/index.js';

/**
 * Memory-based storage implementation
 */
class MemoryStorage implements Storage {
  private data: Map<string, string>;

  constructor() {
    this.data = new Map();
  }

  get length(): number {
    return this.data.size;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] || null;
  }

  getItem(key: string): string | null {
    return this.data.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.data.delete(key);
  }

  clear(): void {
    this.data.clear();
  }
}

/**
 * Plugin state version info
 */
interface StateVersion {
  version: number;
  timestamp: number;
  migrations: string[];
}

/**
 * Plugin state with version
 */
interface VersionedState<T extends PluginStateData = PluginStateData> {
  version: StateVersion;
  data: T;
}

/**
 * Plugin state migration
 */
interface StateMigration<T extends PluginStateData = PluginStateData> {
  version: number;
  migrate: (state: T) => T;
  validate: (state: T) => boolean;
}

/**
 * Plugin health status
 */
export interface PluginHealth {
  state: PluginState;
  status: 'healthy' | 'degraded' | 'unhealthy';
  errorCount: number;
  uptime: number;
  startTime: number;
  dependencies: {
    id: string;
    state: PluginState;
    status: 'healthy' | 'degraded' | 'unhealthy';
  }[];
  lastError?: Error;
  lastErrorTime?: number;
  memoryUsage?: number;
  id: string;
}

/**
 * Plugin health status internal
 */
interface PluginHealthStatus {
  state: PluginState;
  status: 'healthy' | 'degraded' | 'unhealthy';
  errorCount: number;
  uptime: number;
  startTime: number;
  dependencies: {
    id: string;
    state: PluginState;
    status: 'healthy' | 'degraded' | 'unhealthy';
  }[];
  lastError?: Error;
  lastErrorTime?: number;
  memoryUsage?: number;
}

/**
 * Manages editor plugins
 */
export class PluginManager<T extends BlockData = BlockData> {
  private plugins: Map<string, Plugin<T>>;
  private pluginStates: Map<string, PluginState>;
  private pluginConfigs: Map<string, PluginConfig>;
  private pluginData: Map<string, T>;
  private stateVersions: Map<string, StateVersion>;
  private stateMigrations: Map<string, StateMigration<T>[]>;
  private eventEmitter: EventEmitter;
  private stateManager: StateManager<T>;
  private subscribers: Map<string, Set<(state: T) => void>>;
  private memoryStorage: MemoryStorage;
  private baseContext: PluginContext;
  private dependencyGraph: Map<string, Set<string>>;
  private pluginHealth: Map<string, PluginHealthStatus>;
  private pluginStartTimes: Map<string, number>;
  private pluginErrors: Map<string, Error[]>;
  private healthCheckIntervals: Map<string, NodeJS.Timeout>;
  public readonly messagingManager: MessagingManager;

  constructor(
    stateManager: StateManager<T>,
    interactionManager: BlockInteractionManager,
    renderer: BaseRenderer<T>
  ) {
    this.plugins = new Map();
    this.pluginStates = new Map();
    this.pluginConfigs = new Map();
    this.pluginData = new Map();
    this.stateVersions = new Map();
    this.stateMigrations = new Map();
    this.eventEmitter = new EventEmitter();
    this.stateManager = stateManager;
    this.subscribers = new Map();
    this.memoryStorage = new MemoryStorage();
    this.messagingManager = new MessagingManager(this.eventEmitter);
    this.dependencyGraph = new Map();
    this.pluginHealth = new Map();
    this.pluginStartTimes = new Map();
    this.pluginErrors = new Map();
    this.healthCheckIntervals = new Map();

    this.baseContext = {
      stateManager,
      interactionManager,
      renderer,
      eventEmitter: this.eventEmitter,
      messaging: this.messagingManager.createPluginMessaging('system'),
    };
  }

  /**
   * Create plugin context with state management and messaging
   */
  private createPluginContext(pluginId: string): PluginContext & {
    pluginState: PluginStateManager<T>;
    messaging: PluginMessaging;
  } {
    const stateManager: PluginStateManager<T> = {
      getState: () => this.getPluginState(pluginId),
      setState: state => this.setPluginState(pluginId, state),
      resetState: () => this.resetPluginState(pluginId),
      subscribe: handler => this.subscribeToState(pluginId, handler),
      get: <K extends keyof T>(key: K) => this.getPluginStateValue(pluginId, key),
      set: <K extends keyof T>(key: K, value: T[K]) =>
        this.setPluginStateValue(pluginId, key, value),
      persist: () => this.persistPluginState(pluginId),
      restore: () => this.restorePluginState(pluginId),
    };

    return {
      ...this.baseContext,
      pluginState: stateManager,
      messaging: this.messagingManager.createPluginMessaging(pluginId),
    };
  }

  /**
   * Check if all dependencies are available
   */
  private validateDependencies(pluginId: string, dependencies?: string[]): void {
    if (!dependencies) return;

    for (const dependencyId of dependencies) {
      if (!this.plugins.has(dependencyId)) {
        throw new Error(`Plugin '${pluginId}' depends on missing plugin '${dependencyId}'`);
      }
    }
  }

  /**
   * Update dependency graph
   */
  private updateDependencyGraph(pluginId: string, dependencies?: string[]): void {
    if (!dependencies) return;

    let deps = this.dependencyGraph.get(pluginId);
    if (!deps) {
      deps = new Set();
      this.dependencyGraph.set(pluginId, deps);
    }

    for (const dependencyId of dependencies) {
      deps.add(dependencyId);
    }

    // Check for cycles
    const visited = new Set<string>();
    const path = new Set<string>();

    const detectCycle = (current: string): void => {
      if (path.has(current)) {
        const cycle = Array.from(path);
        const start = cycle.indexOf(current);
        throw new Error(
          `Dependency cycle detected: ${cycle.slice(start).join(' -> ')} -> ${current}`
        );
      }

      if (visited.has(current)) return;

      visited.add(current);
      path.add(current);

      const currentDeps = this.dependencyGraph.get(current);
      if (currentDeps) {
        for (const dep of currentDeps) {
          detectCycle(dep);
        }
      }

      path.delete(current);
    };

    detectCycle(pluginId);
  }

  /**
   * Get plugin load order
   */
  private getLoadOrder(): string[] {
    const visited = new Set<string>();
    const order: string[] = [];

    const visit = (pluginId: string): void => {
      if (visited.has(pluginId)) return;

      visited.add(pluginId);

      const deps = this.dependencyGraph.get(pluginId);
      if (deps) {
        for (const dep of deps) {
          visit(dep);
        }
      }

      order.push(pluginId);
    };

    for (const pluginId of this.plugins.keys()) {
      visit(pluginId);
    }

    return order;
  }

  /**
   * Register a plugin
   */
  register(plugin: Plugin<T>, config?: PluginConfig): void {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Plugin '${plugin.id}' is already registered`);
    }

    // Validate dependencies
    this.validateDependencies(plugin.id, config?.dependencies);

    // Update dependency graph
    this.updateDependencyGraph(plugin.id, config?.dependencies);

    // Store plugin configuration
    this.pluginConfigs.set(plugin.id, {
      enabled: true,
      ...config,
    });

    // Initialize plugin state
    const initialState = plugin.initialState || ({} as T);
    this.pluginData.set(plugin.id, initialState);
    this.pluginStates.set(plugin.id, PluginState.REGISTERED);

    // Store plugin instance
    this.plugins.set(plugin.id, plugin);

    // Initialize plugin
    const context = this.createPluginContext(plugin.id);

    try {
      // Call plugin lifecycle hooks
      if (plugin.hooks?.beforeInit) {
        void plugin.hooks.beforeInit(context);
      }

      void plugin.initialize(context);

      if (plugin.hooks?.afterInit) {
        void plugin.hooks.afterInit(context);
      }

      // Start health monitoring
      this.startHealthMonitoring(plugin.id);

      // Enable plugin if configured
      if (config?.enabled !== false) {
        void this.enable(plugin.id);
      }
    } catch (error) {
      void this.handlePluginError(
        plugin.id,
        error instanceof Error ? error : new Error(String(error)),
        true
      );
    }
  }

  /**
   * Unregister a plugin
   */
  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    // Check if any plugins depend on this one
    for (const [id, deps] of this.dependencyGraph.entries()) {
      if (deps.has(pluginId)) {
        throw new Error(
          `Cannot unregister plugin '${pluginId}' because plugin '${id}' depends on it`
        );
      }
    }

    // Clean up plugin
    try {
      const context = this.createPluginContext(pluginId);
      plugin.destroy?.(context);
    } catch (error) {
      console.error(`Failed to clean up plugin '${pluginId}':`, error);
    }

    // Remove plugin
    this.plugins.delete(pluginId);
    this.pluginStates.delete(pluginId);
    this.pluginConfigs.delete(pluginId);
    this.pluginData.delete(pluginId);
    this.subscribers.delete(pluginId);
    this.dependencyGraph.delete(pluginId);

    // Emit event
    this.eventEmitter.emit<BlockEvent>({
      type: 'editor:state-changed',
      blockId: '',
      data: {
        plugin: {
          id: pluginId,
          state: PluginState.DISABLED,
        },
      },
    });
  }

  /**
   * Enable a plugin
   */
  async enable(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    const currentState = this.pluginStates.get(pluginId);
    if (currentState === PluginState.ENABLED) return;

    try {
      this.pluginStates.set(pluginId, PluginState.ENABLING);
      const context = this.createPluginContext(pluginId);

      // Enable dependencies first
      const deps = this.dependencyGraph.get(pluginId);
      if (deps) {
        for (const dep of deps) {
          if (!this.isEnabled(dep)) {
            await this.enable(dep);
          }
        }
      }

      // Run before enable hook
      await plugin.hooks?.beforeEnable?.(context);

      // Initialize if needed
      if (currentState !== PluginState.INITIALIZED) {
        await this.initializePlugin(pluginId);
      }

      // Run after enable hook
      await plugin.hooks?.afterEnable?.(context);

      this.pluginStates.set(pluginId, PluginState.ENABLED);
      this.pluginStartTimes.set(pluginId, Date.now());
      this.startHealthMonitoring(pluginId);
      await this.updatePluginHealth(pluginId);

      // Emit event
      this.eventEmitter.emit<BlockEvent>({
        type: 'editor:state-changed',
        blockId: '',
        data: {
          plugin: {
            id: pluginId,
            state: this.pluginStates.get(pluginId),
          },
        },
      });
    } catch (error) {
      await this.handlePluginError(
        pluginId,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Disable a plugin
   */
  async disable(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    const currentState = this.pluginStates.get(pluginId);
    if (currentState === PluginState.DISABLED) return;

    try {
      // Check if any plugins depend on this one
      for (const [id, deps] of this.dependencyGraph.entries()) {
        if (deps.has(pluginId) && this.isEnabled(id)) {
          throw new Error(
            `Cannot disable plugin '${pluginId}' because enabled plugin '${id}' depends on it`
          );
        }
      }

      this.pluginStates.set(pluginId, PluginState.DISABLING);
      const context = this.createPluginContext(pluginId);

      // Run before disable hook
      await plugin.hooks?.beforeDisable?.(context);

      // Persist state before disabling
      this.persistPluginState(pluginId);

      // Clean up plugin
      await plugin.destroy?.(context);

      // Run after disable hook
      await plugin.hooks?.afterDisable?.(context);

      this.pluginStates.set(pluginId, PluginState.DISABLED);
      this.stopHealthMonitoring(pluginId);
      await this.updatePluginHealth(pluginId);

      // Emit event
      this.eventEmitter.emit<BlockEvent>({
        type: 'editor:state-changed',
        blockId: '',
        data: {
          plugin: {
            id: pluginId,
            state: this.pluginStates.get(pluginId),
          },
        },
      });
    } catch (error) {
      await this.handlePluginError(
        pluginId,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Get plugin state
   */
  private getPluginState(pluginId: string): T {
    return this.pluginData.get(pluginId) || ({} as T);
  }

  /**
   * Set plugin state
   */
  private setPluginState(pluginId: string, state: Partial<T>): void {
    const currentState = this.getPluginState(pluginId);
    const newState = { ...currentState, ...state };
    this.pluginData.set(pluginId, newState);

    // Notify subscribers
    const subscribers = this.subscribers.get(pluginId);
    if (subscribers) {
      subscribers.forEach(handler => handler(newState));
    }
  }

  /**
   * Reset plugin state
   */
  private resetPluginState(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      this.pluginData.set(pluginId, plugin.initialState || ({} as T));
      const subscribers = this.subscribers.get(pluginId);
      if (subscribers) {
        subscribers.forEach(handler => handler(plugin.initialState || ({} as T)));
      }
    }
  }

  /**
   * Subscribe to plugin state changes
   */
  private subscribeToState(pluginId: string, handler: (state: T) => void): () => void {
    let subscribers = this.subscribers.get(pluginId);
    if (!subscribers) {
      subscribers = new Set();
      this.subscribers.set(pluginId, subscribers);
    }
    subscribers.add(handler);
    return () => subscribers?.delete(handler);
  }

  /**
   * Get plugin state value
   */
  private getPluginStateValue<K extends keyof T>(pluginId: string, key: K): T[K] {
    const state = this.getPluginState(pluginId);
    return state[key];
  }

  /**
   * Set plugin state value
   */
  private setPluginStateValue<K extends keyof T>(pluginId: string, key: K, value: T[K]): void {
    const state = this.getPluginState(pluginId);
    this.setPluginState(pluginId, { ...state, [key]: value });
  }

  /**
   * Register state migration
   */
  registerMigration(pluginId: string, migration: StateMigration<T>): void {
    const migrations = this.stateMigrations.get(pluginId) || [];
    migrations.push(migration);
    migrations.sort((a, b) => a.version - b.version);
    this.stateMigrations.set(pluginId, migrations);
  }

  /**
   * Validate plugin state
   */
  private validateState(pluginId: string, state: T): void {
    const migrations = this.stateMigrations.get(pluginId);
    if (!migrations) return;

    const currentVersion = this.stateVersions.get(pluginId)?.version || 0;
    const migration = migrations.find(m => m.version === currentVersion);

    if (migration?.validate && !migration.validate(state)) {
      throw new Error(`Invalid state for plugin '${pluginId}'`);
    }
  }

  /**
   * Migrate plugin state
   */
  private async migrateState(pluginId: string, state: T): Promise<T> {
    const migrations = this.stateMigrations.get(pluginId);
    if (!migrations) return state;

    const currentVersion = this.stateVersions.get(pluginId)?.version || 0;
    let migratedState = state;

    for (const migration of migrations) {
      if (migration.version <= currentVersion) continue;

      try {
        migratedState = migration.migrate(migratedState);

        // Update version info
        const version: StateVersion = {
          version: migration.version,
          timestamp: Date.now(),
          migrations: [
            ...(this.stateVersions.get(pluginId)?.migrations || []),
            `v${currentVersion} -> v${migration.version}`,
          ],
        };
        this.stateVersions.set(pluginId, version);

        // Validate migrated state
        this.validateState(pluginId, migratedState);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(
          `Failed to migrate plugin '${pluginId}' to version ${migration.version}: ${message}`
        );
      }
    }

    return migratedState;
  }

  /**
   * Persist plugin state with version info
   */
  private persistPluginState(pluginId: string): void {
    const config = this.pluginConfigs.get(pluginId);
    if (!config?.persistence?.enabled) return;

    const state = this.getPluginState(pluginId);
    const version = this.stateVersions.get(pluginId);
    const storage = this.getStorage(config.persistence.storage);
    const key = this.getStorageKey(pluginId, config);

    try {
      this.validateState(pluginId, state);
      const versionedState: VersionedState<T> = {
        version: version || {
          version: 1,
          timestamp: Date.now(),
          migrations: [],
        },
        data: state,
      };
      storage.setItem(key, JSON.stringify(versionedState));
    } catch (error) {
      console.error(`Failed to persist state for plugin '${pluginId}':`, error);
      if (error instanceof Error) {
        this.eventEmitter.emit<BlockEvent>({
          type: 'editor:error',
          blockId: '',
          data: {
            error: 'unknown_error',
            message: error.message,
            pluginId,
          },
        });
      } else {
        this.eventEmitter.emit<BlockEvent>({
          type: 'editor:error',
          blockId: '',
          data: {
            error: 'unknown_error',
            message: String(error),
            pluginId,
          },
        });
      }
    }
  }

  /**
   * Restore plugin state with migration
   */
  private async restorePluginState(pluginId: string): Promise<void> {
    const config = this.pluginConfigs.get(pluginId);
    if (!config?.persistence?.enabled) return;

    const storage = this.getStorage(config.persistence.storage);
    const key = this.getStorageKey(pluginId, config);

    try {
      const saved = storage.getItem(key);
      if (saved) {
        const { version, data } = JSON.parse(saved) as VersionedState<T>;
        this.stateVersions.set(pluginId, version);

        // Migrate state if needed
        const migratedState = await this.migrateState(pluginId, data);
        this.setPluginState(pluginId, migratedState);
      }
    } catch (error) {
      console.error(`Failed to restore state for plugin '${pluginId}':`, error);
      if (error instanceof Error) {
        this.eventEmitter.emit<BlockEvent>({
          type: 'editor:error',
          blockId: '',
          data: {
            error: 'unknown_error',
            message: error.message,
            pluginId,
          },
        });
      } else {
        this.eventEmitter.emit<BlockEvent>({
          type: 'editor:error',
          blockId: '',
          data: {
            error: 'unknown_error',
            message: String(error),
            pluginId,
          },
        });
      }
    }
  }

  /**
   * Get storage implementation
   */
  private getStorage(type: 'local' | 'session' | 'memory' = 'memory'): Storage {
    switch (type) {
      case 'local':
        return localStorage;
      case 'session':
        return sessionStorage;
      default:
        return this.memoryStorage;
    }
  }

  /**
   * Get storage key for plugin state
   */
  private getStorageKey(pluginId: string, config: PluginConfig): string {
    return config.persistence?.key || `modulator:plugin:${pluginId}:state`;
  }

  /**
   * Get plugin configuration
   */
  getConfig(pluginId: string): PluginConfig | undefined {
    return this.pluginConfigs.get(pluginId);
  }

  /**
   * Update plugin configuration
   */
  updateConfig(pluginId: string, config: Partial<PluginConfig>): void {
    const currentConfig = this.pluginConfigs.get(pluginId);
    if (!currentConfig) return;

    this.pluginConfigs.set(pluginId, { ...currentConfig, ...config });

    // Re-initialize if enabled state changed
    if (config.enabled !== undefined) {
      if (config.enabled) {
        this.enable(pluginId);
      } else {
        this.disable(pluginId);
      }
    }
  }

  /**
   * Get plugin state manager
   */
  getStateManager(pluginId: string): PluginStateManager<T> | undefined {
    if (!this.plugins.has(pluginId)) return undefined;
    return {
      getState: () => this.getPluginState(pluginId),
      setState: state => this.setPluginState(pluginId, state),
      resetState: () => this.resetPluginState(pluginId),
      subscribe: handler => this.subscribeToState(pluginId, handler),
      get: <K extends keyof T>(key: K) => this.getPluginStateValue(pluginId, key),
      set: <K extends keyof T>(key: K, value: T[K]) =>
        this.setPluginStateValue(pluginId, key, value),
      persist: () => this.persistPluginState(pluginId),
      restore: () => this.restorePluginState(pluginId),
    };
  }

  /**
   * Get plugin lifecycle state
   */
  getState(pluginId: string): PluginState {
    return this.pluginStates.get(pluginId) || PluginState.REGISTERED;
  }

  /**
   * Get all registered plugins
   */
  getPlugins(): Plugin<T>[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get enabled plugins
   */
  getEnabledPlugins(): Plugin<T>[] {
    return Array.from(this.plugins.entries())
      .filter(([id]) => this.pluginStates.get(id) === PluginState.ENABLED)
      .map(([, plugin]) => plugin);
  }

  /**
   * Check if plugin exists
   */
  hasPlugin(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }

  /**
   * Check if plugin is enabled
   */
  isEnabled(pluginId: string): boolean {
    return this.pluginStates.get(pluginId) === PluginState.ENABLED;
  }

  /**
   * Send message to plugin
   */
  sendMessage(source: string, target: string, data: unknown): void {
    const message: PluginMessage = {
      type: 'plugin:message',
      source,
      target,
      data,
      timestamp: Date.now(),
    };

    const handlers = this.messagingManager.getHandlers(target);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error handling message in plugin '${target}':`, error);
        }
      });
    }
  }

  /**
   * Broadcast message to all plugins
   */
  broadcastMessage(source: string, channel: string, data: unknown): void {
    const message: PluginMessage = {
      type: 'plugin:broadcast',
      source,
      channel,
      data,
      timestamp: Date.now(),
    };

    this.messagingManager.broadcast(message);
  }

  /**
   * Send request to plugin
   */
  async sendRequest(
    source: string,
    target: string,
    data: unknown,
    timeout = 5000
  ): Promise<unknown> {
    const id = `${source}-${target}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const message: PluginMessage = {
      type: 'plugin:request',
      source,
      target,
      data,
      id,
      timestamp: Date.now(),
    };

    const handlers = this.messagingManager.getRequestHandlers(target);
    if (!handlers) {
      throw new Error(`Plugin '${target}' does not accept requests`);
    }

    return new Promise((resolve, reject) => {
      // Set timeout
      const timeoutId = setTimeout(() => {
        reject(new Error(`Request to plugin '${target}' timed out`));
      }, timeout);

      // Send request
      handlers.forEach((handler, channel) => {
        if (!message.channel || message.channel === channel) {
          try {
            handler(data)
              .then(response => {
                clearTimeout(timeoutId);
                resolve(response);
              })
              .catch(error => {
                clearTimeout(timeoutId);
                reject(error);
              });
          } catch (error) {
            console.error(`Error handling request in plugin '${target}':`, error);
          }
        }
      });
    });
  }

  /**
   * Register message handler
   */
  registerMessageHandler(pluginId: string, handler: PluginMessageHandler): () => void {
    this.messagingManager.registerHandler(pluginId, handler);
    return () => this.messagingManager.unregisterHandler(pluginId, handler);
  }

  /**
   * Register request handler
   */
  registerRequestHandler(
    pluginId: string,
    channel: string,
    handler: PluginRequestHandler
  ): () => void {
    this.messagingManager.registerRequestHandler(pluginId, channel, handler);
    return () => this.messagingManager.unregisterRequestHandler(pluginId, channel);
  }

  /**
   * Update plugin health
   */
  private async updatePluginHealth(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    const state = this.pluginStates.get(pluginId) || PluginState.DISABLED;
    const startTime = this.pluginStartTimes.get(pluginId) || Date.now();
    const errors = this.pluginErrors.get(pluginId) || [];
    const lastError = errors[errors.length - 1];
    const deps = this.dependencyGraph.get(pluginId);

    const health: PluginHealthStatus = {
      state,
      status: 'healthy',
      errorCount: errors.length,
      uptime: Date.now() - startTime,
      startTime,
      dependencies: [],
    };

    if (lastError) {
      health.lastError = lastError;
      health.lastErrorTime = Date.now();
      health.status = errors.length > 3 ? 'unhealthy' : 'degraded';
    }

    if (deps) {
      health.dependencies = Array.from(deps).map(depId => {
        const depHealth = this.pluginHealth.get(depId);
        return {
          id: depId,
          state: this.pluginStates.get(depId) || PluginState.DISABLED,
          status: depHealth?.status || 'healthy',
        };
      });

      // If any dependency is unhealthy, mark as degraded
      if (health.dependencies.some(dep => dep.status === 'unhealthy')) {
        health.status = 'degraded';
      }
    }

    // Get custom health info from plugin
    try {
      const context = this.createPluginContext(pluginId);
      const customHealth = await plugin.hooks?.checkHealth?.(context);
      if (customHealth) {
        Object.assign(health, customHealth);
      }
    } catch (error) {
      console.error(`Failed to check health for plugin '${pluginId}':`, error);
      health.status = 'degraded';
    }

    this.pluginHealth.set(pluginId, health);

    // Emit health update event
    this.eventEmitter.emit<BlockEvent>({
      type: 'editor:state-changed',
      blockId: '',
      data: {
        plugin: {
          id: pluginId,
          health,
        },
      },
    });
  }

  /**
   * Start health monitoring
   */
  private startHealthMonitoring(pluginId: string): void {
    // Clear existing interval
    this.stopHealthMonitoring(pluginId);

    // Start new monitoring interval
    const interval = setInterval(() => {
      this.updatePluginHealth(pluginId).catch(error => {
        console.error(`Failed to update health for plugin '${pluginId}':`, error);
      });
    }, 30000); // Check every 30 seconds

    this.healthCheckIntervals.set(pluginId, interval);
  }

  /**
   * Stop health monitoring
   */
  private stopHealthMonitoring(pluginId: string): void {
    const interval = this.healthCheckIntervals.get(pluginId);
    if (interval) {
      clearInterval(interval);
      this.healthCheckIntervals.delete(pluginId);
    }
  }

  /**
   * Handle plugin error
   */
  private async handlePluginError(
    pluginId: string,
    error: Error,
    fatal: boolean = false
  ): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    // Update error history
    let errors = this.pluginErrors.get(pluginId);
    if (!errors) {
      errors = [];
      this.pluginErrors.set(pluginId, errors);
    }
    errors.push(error);

    // Update plugin state
    this.pluginStates.set(pluginId, fatal ? PluginState.CRASHED : PluginState.ERROR);

    // Update health
    await this.updatePluginHealth(pluginId);

    // Notify plugin
    try {
      const context = this.createPluginContext(pluginId);
      await plugin.hooks?.onError?.(error, context);
    } catch (handlerError) {
      console.error(`Error handler failed for plugin '${pluginId}':`, handlerError);
    }

    // Try to recover if not fatal
    if (!fatal && plugin.recover) {
      try {
        const context = this.createPluginContext(pluginId);
        await plugin.recover(error, context);
        this.pluginStates.set(pluginId, PluginState.ENABLED);
        await this.updatePluginHealth(pluginId);
      } catch (recoveryError) {
        console.error(`Recovery failed for plugin '${pluginId}':`, recoveryError);
        this.pluginStates.set(pluginId, PluginState.CRASHED);
        await this.updatePluginHealth(pluginId);
      }
    }

    // Emit error event
    this.eventEmitter.emit<BlockEvent>({
      type: 'editor:error',
      blockId: '',
      data: {
        plugin: {
          id: pluginId,
          error: error.message,
          fatal,
        },
      },
    });
  }

  /**
   * Initialize plugin
   */
  private async initializePlugin(pluginId: string): Promise<void> {
    const plugin = this.plugins.get(pluginId);
    if (!plugin) return;

    try {
      this.pluginStates.set(pluginId, PluginState.INITIALIZING);
      const context = this.createPluginContext(pluginId);

      // Run before init hook
      await plugin.hooks?.beforeInit?.(context);

      // Initialize plugin
      await plugin.initialize(context);

      // Run after init hook
      await plugin.hooks?.afterInit?.(context);

      this.pluginStates.set(pluginId, PluginState.INITIALIZED);
      await this.updatePluginHealth(pluginId);
    } catch (error) {
      await this.handlePluginError(
        pluginId,
        error instanceof Error ? error : new Error(String(error))
      );
    }
  }

  /**
   * Get plugin health
   */
  getPluginHealth(pluginId: string): PluginHealth | undefined {
    const status = this.pluginHealth.get(pluginId);
    if (!status) return undefined;

    return {
      ...status,
      id: pluginId,
    };
  }

  /**
   * Get unhealthy plugins
   */
  getUnhealthyPlugins(): { id: string; health: PluginHealth }[] {
    const unhealthy: { id: string; health: PluginHealth }[] = [];
    for (const [id, status] of this.pluginHealth.entries()) {
      if (status.status !== 'healthy') {
        unhealthy.push({
          id,
          health: {
            ...status,
            id,
          },
        });
      }
    }
    return unhealthy;
  }
}
