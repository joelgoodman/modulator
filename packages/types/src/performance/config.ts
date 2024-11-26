/**
 * Performance Optimization Configuration
 * @module PerformanceConfig
 * @description Provides types and configurations for performance optimization strategies
 */

/**
 * Optimization strategies for performance enhancement
 * @enum {string}
 * @description Defines different strategies to improve system performance
 */
export enum OptimizationStrategy {
  /**
   * Lazy loading strategy for deferring resource loading
   * @remarks Improves initial load time by loading resources only when needed
   */
  LAZY_LOADING = 'LAZY_LOADING',

  /**
   * Virtualization strategy for rendering large datasets efficiently
   * @remarks Renders only visible items, reducing memory and rendering overhead
   */
  VIRTUALIZATION = 'VIRTUALIZATION',

  /**
   * Memoization strategy for caching expensive function results
   * @remarks Improves performance by storing and reusing computed results
   */
  MEMOIZATION = 'MEMOIZATION',
}

/**
 * Lazy loading configuration options
 * @interface
 * @description Provides fine-grained control over lazy loading behavior
 */
export interface LazyLoadOptions {
  /**
   * Flag to enable or disable lazy loading
   * @type {boolean}
   * @default false
   */
  enabled: boolean;

  /**
   * Viewport threshold for triggering lazy loading
   * @type {number}
   * @description Percentage of viewport to trigger loading (0-1)
   * @default 0.5
   */
  threshold: number;

  /**
   * Number of items to load in each batch
   * @type {number}
   * @description Controls the number of items loaded per lazy load cycle
   * @default 10
   */
  batchSize: number;

  /**
   * Debounce time to prevent excessive loading
   * @type {number}
   * @description Milliseconds to wait before triggering lazy load
   * @default 200
   */
  debounceTime: number;
}

/**
 * Performance configuration interface
 * @interface
 * @description Defines comprehensive performance optimization settings
 */
export interface PerformanceConfig {
  /** 
   * Legacy support for simple lazy loading toggle
   * @type {boolean}
   * @deprecated Use LazyLoadOptions instead
   */
  lazyLoad?: boolean;

  /**
   * Lazy loading configuration
   * @type {LazyLoadOptions}
   * @description Detailed lazy loading strategy configuration
   */
  lazyLoading?: LazyLoadOptions;

  /**
   * Enabled optimization strategies
   * @type {OptimizationStrategy[]}
   * @description List of optimization strategies to apply
   */
  strategies?: OptimizationStrategy[];

  /**
   * Delay between performance metric updates
   * @type {number}
   * @description Milliseconds to wait before updating performance metrics
   * @default 500
   */
  debounceDelay?: number;

  /**
   * Enable performance monitoring
   * @type {boolean}
   * @description Flag to enable or disable performance monitoring
   * @default false
   */
  monitoring?: boolean;

  /**
   * Maximum number of blocks to render at once
   * @type {number}
   * @description Controls the number of blocks rendered in a single cycle
   * @default 100
   */
  maxBlocksPerRender?: number;

  /**
   * Threshold for enabling virtualization
   * @type {number}
   * @description Percentage of available memory to use (0-1)
   * @default 0.7
   */
  virtualizationThreshold?: number;
}

/**
 * Default performance configuration
 * @type {PerformanceConfig}
 * @description Provides sensible default performance settings
 */
export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  lazyLoad: false,
  lazyLoading: {
    enabled: false,
    threshold: 0.5,
    batchSize: 10,
    debounceTime: 200
  },
  strategies: [],
  debounceDelay: 500,
  monitoring: false,
  maxBlocksPerRender: 100,
  virtualizationThreshold: 0.7
};
