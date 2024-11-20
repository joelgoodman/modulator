/**
 * Optimization strategies
 */
export enum OptimizationStrategy {
  /**
   * Lazy loading strategy for performance optimization
   */
  LAZY_LOADING = 'LAZY_LOADING',

  /**
   * Virtualization strategy for performance optimization
   */
  VIRTUALIZATION = 'VIRTUALIZATION',

  /**
   * Memoization strategy for performance optimization
   */
  MEMOIZATION = 'MEMOIZATION',
}

/**
 * Lazy loading options
 */
export interface LazyLoadOptions {
  /**
   * Enable lazy loading
   */
  enabled: boolean;

  /**
   * Viewport threshold
   */
  threshold: number;

  /**
   * Load batch size
   */
  batchSize: number;

  /**
   * Debounce time (ms)
   */
  debounceTime: number;
}

/**
 * Performance configuration
 */
export interface PerformanceConfig {
  /** Legacy support for simple lazy loading toggle */
  lazyLoad?: boolean;

  /** Detailed lazy loading configuration */
  lazyLoading?: LazyLoadOptions;

  /** List of optimization strategies to apply */
  strategies?: OptimizationStrategy[];

  /** Delay between performance metric updates */
  debounceDelay?: number;

  /** Enable performance monitoring */
  monitoring?: boolean;

  /** Maximum number of blocks to render at once */
  maxBlocksPerRender?: number;

  /** Threshold for enabling virtualization */
  virtualizationThreshold?: number;
}
