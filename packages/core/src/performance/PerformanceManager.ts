import {
  BlockEventType,
  type PerformanceMetrics,
  type PerformanceContext,
  type PerformanceConfig,
  type LazyLoadOptions,
  OptimizationStrategy,
} from '@modulator/types';
import { EventEmitter } from '../events/EventEmitter.js';

/**
 * Manages editor performance optimizations
 */
export class PerformanceManager implements PerformanceContext {
  private _config: PerformanceConfig;
  private _metrics: PerformanceMetrics;
  private eventEmitter: EventEmitter;
  private pendingUpdates: Set<string>;
  private updateTimeout?: number;

  constructor(config: Partial<PerformanceConfig> = {}) {
    this.eventEmitter = new EventEmitter();
    this.pendingUpdates = new Set();

    const defaultLazyLoading: LazyLoadOptions = {
      enabled: true,
      threshold: 100,
      batchSize: 10,
      debounceTime: 100,
    };

    // Initialize with type-safe default config
    this._config = {
      lazyLoad: false,
      lazyLoading: defaultLazyLoading,
      strategies: [OptimizationStrategy.LAZY_LOADING],
      debounceDelay: 250,
      monitoring: false,
      maxBlocksPerRender: 50,
      virtualizationThreshold: 100,
    };

    // Merge with provided config
    if (config) {
      this._config = {
        ...this._config,
        ...config,
      };
    }

    // Ensure lazyLoading is always an object
    if (config.lazyLoad !== undefined) {
      this._config.lazyLoading = {
        ...defaultLazyLoading,
        enabled: config.lazyLoad,
      };
    }

    this._metrics = {
      renderTime: 0,
      operationTime: 0,
      memoryUsage: 0,
      blockCount: 0,
      timeToFirstBlock: 0,
      timeToInteractive: 0,
      lastUpdate: Date.now(),
    };
  }

  /**
   * Update performance configuration
   */
  updateConfig(config: Partial<PerformanceConfig>): void {
    this._config = {
      ...this._config,
      ...config,
      lazyLoading: config.lazyLoading
        ? {
            enabled: true, // Always set required field
            threshold: config.lazyLoading.threshold ?? this._config.lazyLoading?.threshold ?? 100,
            batchSize: config.lazyLoading.batchSize ?? this._config.lazyLoading?.batchSize ?? 10,
            debounceTime:
              config.lazyLoading.debounceTime ?? this._config.lazyLoading?.debounceTime ?? 100,
          }
        : this._config.lazyLoading,
    };
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
   * Check if a block should be loaded based on lazy loading configuration
   */
  public shouldLoadBlock(index: number, viewportStart: number, viewportEnd: number): boolean {
    const { lazyLoading } = this._config;

    if (!lazyLoading?.enabled) {
      return true;
    }

    // Ensure all required properties exist with defaults
    const threshold = lazyLoading?.threshold ?? 100;
    const batchSize = lazyLoading?.batchSize ?? 10;

    // Check if block is within viewport threshold
    return (
      index >= Math.max(0, viewportStart - threshold) &&
      index <= viewportEnd + threshold &&
      index % batchSize === 0
    );
  }

  /**
   * Check if virtualization should be enabled
   */
  shouldVirtualize(blockCount: number): boolean {
    const threshold = this._config.virtualizationThreshold || 100;
    return blockCount > threshold;
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
  private emitMetricsUpdate() {
    this._metrics.lastUpdate = Date.now();
    this.eventEmitter.emit({
      type: BlockEventType.METRICS_UPDATE,
      blockId: 'performance',
      data: this._metrics,
    });

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

  /**
   * Measure performance of a specific operation
   * @param name Name of the performance measurement
   * @param duration Duration of the performance measurement
   */
  measure(name: string, duration: number): void {
    this.eventEmitter.emit({
      type: BlockEventType.PERFORMANCE_MEASURE,
      blockId: 'performance',
      data: {
        name,
        duration,
      },
    });
  }
}
