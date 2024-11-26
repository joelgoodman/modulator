/**
 * Performance Metrics Tracking
 * @module PerformanceMetrics
 * @description Provides a comprehensive interface for tracking system performance metrics
 */

/**
 * Performance metrics interface for detailed system performance tracking
 * @interface
 * @description Captures various performance-related measurements to help diagnose and optimize system performance
 */
export interface PerformanceMetrics {
  /**
   * Total block rendering time
   * @type {number}
   * @description Time taken to render all blocks in milliseconds
   * @default 0
   */
  renderTime: number;

  /**
   * Total time for block operations
   * @type {number}
   * @description Cumulative time spent on block-related operations in milliseconds
   * @default 0
   */
  operationTime: number;

  /**
   * Current memory usage
   * @type {number}
   * @description Amount of memory currently used by the system in bytes
   * @default 0
   */
  memoryUsage: number;

  /**
   * Total number of blocks in the system
   * @type {number}
   * @description Count of active blocks in the current context
   * @default 0
   */
  blockCount: number;

  /**
   * Time to render the first block
   * @type {number}
   * @description Duration from system start to rendering the first block in milliseconds
   * @default 0
   */
  timeToFirstBlock: number;

  /**
   * Time to interactive state
   * @type {number}
   * @description Time taken for the system to become fully interactive in milliseconds
   * @default 0
   */
  timeToInteractive: number;

  /**
   * Timestamp of the last metrics update
   * @type {number}
   * @description Unix timestamp (in milliseconds) of the most recent metrics update
   * @default 0
   */
  lastUpdate: number;

  /**
   * Average frames per second (FPS)
   * @type {number}
   * @description Measures rendering performance and smoothness
   * @default 0
   */
  averageFPS?: number;

  /**
   * CPU usage percentage
   * @type {number}
   * @description Percentage of CPU resources used by the system
   * @default 0
   */
  cpuUsage?: number;

  /**
   * Performance score
   * @type {number}
   * @description Aggregate performance score (0-100)
   * @default 100
   */
  performanceScore?: number;
}

/**
 * Default performance metrics
 * @type {PerformanceMetrics}
 * @description Provides initial zero-value performance metrics
 */
export const DEFAULT_PERFORMANCE_METRICS: PerformanceMetrics = {
  renderTime: 0,
  operationTime: 0,
  memoryUsage: 0,
  blockCount: 0,
  timeToFirstBlock: 0,
  timeToInteractive: 0,
  lastUpdate: Date.now(),
  averageFPS: 0,
  cpuUsage: 0,
  performanceScore: 100
};
