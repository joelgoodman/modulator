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

  /**
   * Timestamp of last metrics update
   */
  lastUpdate: number;
}
