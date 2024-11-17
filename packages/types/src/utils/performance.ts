/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  /**
   * Block rendering time (ms)
   */
  renderTime: number;

  /**
   * Block operation time (ms)
   */
  operationTime: number;

  /**
   * Memory usage (bytes)
   */
  memoryUsage: number;

  /**
   * Number of blocks
   */
  blockCount: number;

  /**
   * Time to first block render (ms)
   */
  timeToFirstBlock: number;

  /**
   * Time to interactive (ms)
   */
  timeToInteractive: number;
}

/**
 * Optimization strategies
 */
export enum OptimizationStrategy {
  /**
   * No optimization
   */
  NONE = 'none',

  /**
   * Load blocks as they come into view
   */
  LAZY_LOADING = 'lazy_loading',

  /**
   * Only render visible blocks
   */
  VIRTUALIZATION = 'virtualization',

  /**
   * Batch updates together
   */
  BATCH_UPDATES = 'batch_updates',

  /**
   * Debounce rapid updates
   */
  DEBOUNCE = 'debounce',
}

/**
 * Lazy loading configuration
 */
export interface LazyLoadingConfig {
  /**
   * Enable lazy loading
   */
  enabled: boolean;

  /**
   * Distance from viewport to start loading (px)
   */
  threshold: number;

  /**
   * Number of blocks to load at once
   */
  batchSize: number;

  /**
   * Minimum time between loads (ms)
   */
  debounceTime: number;
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  /**
   * Active optimization strategies
   */
  strategies: OptimizationStrategy[];

  /**
   * Lazy loading configuration
   */
  lazyLoading: LazyLoadingConfig;

  /**
   * Debounce delay for updates (ms)
   */
  debounceDelay: number;

  /**
   * Enable performance monitoring
   */
  monitoring: boolean;

  /**
   * Maximum blocks to render at once
   */
  maxBlocksPerRender: number;

  /**
   * Maximum blocks before virtualization
   */
  virtualizationThreshold: number;
}

/**
 * Performance context
 */
export interface PerformanceContext {
  /**
   * Current metrics
   */
  metrics: PerformanceMetrics;

  /**
   * Current configuration
   */
  config: PerformanceConfig;

  /**
   * Update configuration
   */
  updateConfig: (config: Partial<PerformanceConfig>) => void;

  /**
   * Record operation timing
   */
  recordOperation: <T>(operation: () => T) => T;

  /**
   * Record render timing
   */
  recordRender: (blockId: string, render: () => void) => void;

  /**
   * Check if block should be loaded
   */
  shouldLoadBlock: (index: number, viewportStart: number, viewportEnd: number) => boolean;

  /**
   * Check if blocks should be virtualized
   */
  shouldVirtualize: (blockCount: number) => boolean;
}
