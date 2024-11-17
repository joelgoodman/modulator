import {
  PerformanceMetrics,
  OptimizationStrategy,
  PerformanceConfig,
  PerformanceContext,
  BlockEvent,
} from '@modulator/types';
import { EventEmitter } from '../events/EventEmitter.js';

/**
 * Manages editor performance optimizations
 */
export class PerformanceManager implements PerformanceContext {
  private _config: PerformanceConfig;
  private _metrics: PerformanceMetrics;
  private eventEmitter: EventEmitter;
  private lastUpdate: number;
  private pendingUpdates: Set<string>;
  private updateTimeout?: number;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.eventEmitter = new EventEmitter();
    this.pendingUpdates = new Set();

    this._config = {
      strategies: [OptimizationStrategy.LAZY_LOADING],
      lazyLoading: {
        enabled: true,
        threshold: 100,
        batchSize: 10,
        debounceTime: 100,
      },
      debounceDelay: 250,
      monitoring: false,
      maxBlocksPerRender: 50,
      virtualizationThreshold: 100,
      ...config,
    };

    this._metrics = {
      renderTime: 0,
      operationTime: 0,
      memoryUsage: 0,
      blockCount: 0,
      timeToFirstBlock: 0,
      timeToInteractive: 0,
    };

    this.lastUpdate = Date.now();
  }

  /**
   * Update performance configuration
   */
  updateConfig(config: Partial<PerformanceConfig>): void {
    this._config = { ...this._config, ...config };
    this.emitMetricsUpdate();
  }

  /**
   * Record operation timing
   */
  recordOperation<T>(operation: () => T): T {
    const start = performance.now();
    try {
      return operation();
    } finally {
      this._metrics.operationTime = performance.now() - start;
      this.emitMetricsUpdate();
    }
  }

  /**
   * Record block render timing
   */
  recordRender(blockId: string, render: () => void): void {
    const start = performance.now();
    try {
      render();
    } finally {
      this._metrics.renderTime = performance.now() - start;
      if (this._metrics.timeToFirstBlock === 0) {
        this._metrics.timeToFirstBlock = this._metrics.renderTime;
      }
      this.pendingUpdates.add(blockId);
      this.scheduleMetricsUpdate();
    }
  }

  /**
   * Check if block should be lazy loaded
   */
  shouldLoadBlock(index: number, viewportStart: number, viewportEnd: number): boolean {
    if (!this._config.lazyLoading.enabled) return true;

    const threshold = this._config.lazyLoading.threshold;
    return index >= viewportStart - threshold && index <= viewportEnd + threshold;
  }

  /**
   * Check if virtualization should be enabled
   */
  shouldVirtualize(blockCount: number): boolean {
    return blockCount > this._config.virtualizationThreshold;
  }

  /**
   * Schedule metrics update
   */
  private scheduleMetricsUpdate(): void {
    if (this.updateTimeout) return;

    this.updateTimeout = window.setTimeout(() => {
      this.emitMetricsUpdate();
      this.updateTimeout = undefined;
    }, this._config.debounceDelay);
  }

  /**
   * Emit metrics update event
   */
  private emitMetricsUpdate(): void {
    const timeSinceLastUpdate = Date.now() - this.lastUpdate;
    if (timeSinceLastUpdate < this._config.debounceDelay) return;

    this.eventEmitter.emit<BlockEvent>({
      type: 'editor:state-changed',
      blockId: '',
      data: {
        metrics: { ...this._metrics },
        config: { ...this._config },
      },
    });

    this.lastUpdate = Date.now();
    this.pendingUpdates.clear();
  }

  /**
   * Get current metrics
   */
  get metrics(): PerformanceMetrics {
    return { ...this._metrics };
  }

  /**
   * Get current config
   */
  get config(): PerformanceConfig {
    return { ...this._config };
  }
}
