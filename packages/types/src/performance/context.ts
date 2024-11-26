/**
 * Performance Monitoring Context
 * @module PerformanceContext
 * @description Provides an interface for tracking and measuring performance metrics
 */

/**
 * Performance context interface for measuring and tracking performance
 * @interface
 * @description Defines methods for performance monitoring and measurement
 */
export interface PerformanceContext {
  /**
   * Measure the performance of an operation
   * @method
   * @param {string} name - Unique name or identifier for the performance measurement
   * @param {number} duration - Duration of the operation in milliseconds
   * @description Logs and tracks the performance of a specific operation
   * 
   * @example
   * ```typescript
   * const performanceContext: PerformanceContext = {
   *   measure: (name, duration) => {
   *     console.log(`Operation ${name} took ${duration}ms`);
   *     // Could also send to monitoring service
   *   }
   * };
   * 
   * // Usage
   * const start = performance.now();
   * someExpensiveOperation();
   * const end = performance.now();
   * 
   * performanceContext.measure('someExpensiveOperation', end - start);
   * ```
   */
  measure(name: string, duration: number): void;

  /**
   * Optional method to track memory usage
   * @method
   * @param {number} memoryUsed - Current memory usage in bytes
   * @param {number} totalMemory - Total available memory in bytes
   * @description Tracks memory consumption of the application
   */
  trackMemory?(memoryUsed: number, totalMemory: number): void;

  /**
   * Optional method to log performance warnings
   * @method
   * @param {string} message - Warning message about performance issue
   * @param {number} [severity=1] - Severity of the performance warning (1-5)
   * @description Logs performance-related warnings or potential bottlenecks
   */
  logWarning?(message: string, severity?: number): void;
}

/**
 * Default no-op performance context implementation
 * @type {PerformanceContext}
 * @description Provides a default implementation that does nothing
 */
export const DEFAULT_PERFORMANCE_CONTEXT: PerformanceContext = {
  measure: () => {},
  trackMemory: () => {},
  logWarning: () => {}
};
