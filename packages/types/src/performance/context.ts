/**
 * Performance context interface
 */
export interface PerformanceContext {
  /**
   * Measure performance of an operation
   * @param name Name of the performance measurement
   * @param duration Duration of the performance measurement in milliseconds
   */
  measure(name: string, duration: number): void;
}
