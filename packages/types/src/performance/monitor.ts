import type { PerformanceMetrics } from './metrics.js';
import type { PerformanceConfig } from './config.js';

/**
 * Performance Monitoring System
 * @module PerformanceMonitor
 * @description Provides an interface for comprehensive performance monitoring and optimization
 */

/**
 * Performance monitor interface for tracking and optimizing system performance
 * @interface
 * @description Defines methods for monitoring, measuring, and dynamically adjusting system performance
 */
export interface PerformanceMonitor {
  /**
   * Current performance metrics
   * @type {PerformanceMetrics}
   * @description Real-time snapshot of system performance metrics
   */
  metrics: PerformanceMetrics;

  /**
   * Current performance configuration
   * @type {PerformanceConfig}
   * @description Active configuration controlling performance optimization strategies
   */
  config: PerformanceConfig;

  /**
   * Update performance configuration dynamically
   * @method
   * @param {Partial<PerformanceConfig>} config - Partial configuration to update
   * @description Allows runtime modification of performance settings
   * 
   * @example
   * ```typescript
   * performanceMonitor.updateConfig({
   *   lazyLoading: { enabled: true, threshold: 0.7 },
   *   monitoring: true
   * });
   * ```
   */
  updateConfig(config: Partial<PerformanceConfig>): void;

  /**
   * Record and measure the performance of an operation
   * @method
   * @template T
   * @param {() => T} operation - Function to measure
   * @returns {T} Result of the operation
   * @description Automatically tracks timing and updates performance metrics
   * 
   * @example
   * ```typescript
   * const result = performanceMonitor.recordOperation(() => {
   *   // Some potentially expensive operation
   *   return expensiveComputation();
   * });
   * ```
   */
  recordOperation<T>(operation: () => T): T;

  /**
   * Record block rendering performance
   * @method
   * @param {string} blockId - Unique identifier of the block being rendered
   * @param {() => void} render - Rendering function
   * @description Tracks rendering time and updates performance metrics
   * 
   * @example
   * ```typescript
   * performanceMonitor.recordRender('block-123', () => {
   *   renderBlockToDOM(block);
   * });
   * ```
   */
  recordRender(blockId: string, render: () => void): void;

  /**
   * Determine if a block should be loaded based on viewport
   * @method
   * @param {number} index - Index of the block
   * @param {number} viewportStart - Starting index of the viewport
   * @param {number} viewportEnd - Ending index of the viewport
   * @returns {boolean} Whether the block should be loaded
   * @description Implements lazy loading strategy
   * 
   * @example
   * ```typescript
   * if (performanceMonitor.shouldLoadBlock(5, 0, 10)) {
   *   loadBlockAtIndex(5);
   * }
   * ```
   */
  shouldLoadBlock(index: number, viewportStart: number, viewportEnd: number): boolean;

  /**
   * Determine if virtualization should be enabled
   * @method
   * @param {number} blockCount - Total number of blocks
   * @returns {boolean} Whether virtualization should be applied
   * @description Decides whether to use virtualization based on block count and performance settings
   * 
   * @example
   * ```typescript
   * if (performanceMonitor.shouldVirtualize(1000)) {
   *   enableVirtualRendering();
   * }
   * ```
   */
  shouldVirtualize(blockCount: number): boolean;

  /**
   * Optional method to generate a performance report
   * @method
   * @returns {string} Detailed performance report
   * @description Generates a comprehensive report of current performance metrics and recommendations
   */
  generateReport?(): string;

  /**
   * Optional method to reset performance metrics
   * @method
   * @description Resets all performance metrics to their initial state
   */
  reset?(): void;
}

/**
 * Default no-op performance monitor implementation
 * @type {PerformanceMonitor}
 * @description Provides a default implementation that does nothing
 */
export const DEFAULT_PERFORMANCE_MONITOR: PerformanceMonitor = {
  metrics: {
    renderTime: 0,
    operationTime: 0,
    memoryUsage: 0,
    blockCount: 0,
    timeToFirstBlock: 0,
    timeToInteractive: 0,
    lastUpdate: Date.now()
  },
  config: {},
  updateConfig: () => {},
  recordOperation: <T>(operation: () => T) => operation(),
  recordRender: () => {},
  shouldLoadBlock: () => true,
  shouldVirtualize: () => false,
  generateReport: () => 'No performance data available',
  reset: () => {}
};
