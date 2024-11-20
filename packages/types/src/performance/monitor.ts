import type { PerformanceMetrics } from './metrics.js';
import type { PerformanceConfig } from './config.js';

/**
 * Performance monitor interface
 */
export interface PerformanceMonitor {
  /**
   * Current performance metrics
   */
  metrics: PerformanceMetrics;

  /**
   * Current configuration
   */
  config: PerformanceConfig;

  /**
   * Update configuration
   */
  updateConfig(config: Partial<PerformanceConfig>): void;

  /**
   * Record operation timing
   */
  recordOperation<T>(operation: () => T): T;

  /**
   * Record block render timing
   */
  recordRender(blockId: string, render: () => void): void;

  /**
   * Check if block should be loaded
   */
  shouldLoadBlock(index: number, viewportStart: number, viewportEnd: number): boolean;

  /**
   * Check if virtualization should be enabled
   */
  shouldVirtualize(blockCount: number): boolean;
}
