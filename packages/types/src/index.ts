// Export all types from each module
export * from './blocks/index.js';
export * from './core/index.js';
export * from './plugins/index.js';
export * from './ui/index.js';
export * from './utils/index.js';

// Explicitly re-export toolbar types to resolve ambiguity
export type {
  ToolbarContext,
  ToolbarGroup,
  ToolbarItem,
  ToolbarOptions,
  ToolbarPosition,
} from './plugins/toolbar.js';

export type { BaseRenderer } from './core/renderer.js';

// Re-export performance types explicitly to avoid conflicts
export {
  type PerformanceMetrics,
  type PerformanceConfig,
  type PerformanceMonitor,
  type PerformanceContext,
  OptimizationStrategy,
  type LazyLoadOptions,
} from './performance/index.js';
