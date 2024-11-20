import type {
  PerformanceMetrics,
  LazyLoadOptions,
  PerformanceConfig,
  PerformanceMonitor,
} from '@modulator/types';

export class PerformanceService implements PerformanceMonitor {
  metrics: PerformanceMetrics = {
    renderTime: 0,
    operationTime: 0,
    memoryUsage: 0,
    blockCount: 0,
    timeToFirstBlock: 0,
    timeToInteractive: 0,
    lastUpdate: Date.now(),
  };

  config: PerformanceConfig = {
    strategies: [],
    lazyLoading: {
      enabled: true, // Required boolean
      threshold: 0.5,
      batchSize: 10,
      debounceTime: 250,
    },
    debounceDelay: 250,
    monitoring: true,
    maxBlocksPerRender: 50,
    virtualizationThreshold: 1000,
  };

  private callbacks: Set<(metrics: PerformanceMetrics) => void> = new Set();
  private monitoring = false;
  private rafId: number | null = null;

  updateConfig(config: Partial<PerformanceConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      lazyLoading: config.lazyLoading
        ? {
            enabled: true, // Always set required field
            threshold: config.lazyLoading.threshold ?? this.config.lazyLoading?.threshold ?? 0.5,
            batchSize: config.lazyLoading.batchSize ?? this.config.lazyLoading?.batchSize ?? 10,
            debounceTime:
              config.lazyLoading.debounceTime ?? this.config.lazyLoading?.debounceTime ?? 250,
          }
        : this.config.lazyLoading,
    };
  }

  recordOperation<T>(operation: () => T): T {
    const start = performance.now();
    const result = operation();
    this.metrics.operationTime = performance.now() - start;
    this.metrics.lastUpdate = Date.now();
    return result;
  }

  recordRender(blockId: string, render: () => void): void {
    const start = performance.now();
    render();
    this.metrics.renderTime = performance.now() - start;
    this.metrics.lastUpdate = Date.now();
  }

  shouldLoadBlock(index: number, viewportStart: number, viewportEnd: number): boolean {
    if (!this.config.lazyLoading?.enabled) return true;

    const threshold = this.config.lazyLoading.threshold;
    const extendedStart = Math.max(0, viewportStart - threshold);
    const extendedEnd = viewportEnd + threshold;

    return index >= extendedStart && index <= extendedEnd;
  }

  shouldVirtualize(blockCount: number): boolean {
    return blockCount > (this.config.virtualizationThreshold || 1000);
  }

  startMonitoring(): void {
    if (this.monitoring) return;
    this.monitoring = true;
    this.updateMetrics();
  }

  stopMonitoring(): void {
    if (!this.monitoring) return;
    this.monitoring = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  onMetricsUpdate(callback: (metrics: PerformanceMetrics) => void): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private updateMetrics(): void {
    if (!this.monitoring) return;

    // Update metrics
    const memory = (performance as any).memory?.usedJSHeapSize || 0;
    const now = performance.now();

    this.metrics = {
      ...this.metrics,
      memoryUsage: memory,
      lastUpdate: Date.now(),
    };

    this.notifyListeners();
    this.rafId = requestAnimationFrame(() => this.updateMetrics());
  }

  private notifyListeners(): void {
    this.callbacks.forEach(callback => callback(this.metrics));
  }
}
