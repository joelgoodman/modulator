/**
 * @module Utils
 * @description Centralized exports for utility types across the Modulator project
 * 
 * This module provides a convenient way to import utility types related to security,
 * performance, type safety, and other cross-cutting concerns in the Modulator ecosystem.
 * 
 * @see {@link module:Security} For detailed security-related type definitions
 * @see {@link module:Performance} For performance-related type definitions
 * @see {@link module:TypeUtils} For type safety and utility type definitions
 */

// Export security types
export type {
  SanitizationOptions,
  ValidationResult,
  ValidationOptions,
  SecurityPolicy,
  SecurityService,
} from './security.js';

// Export performance types
export type {
  PerformanceMetrics,
  PerformanceConfig,
  OptimizationStrategy,
  LazyLoadOptions,
} from '../performance/index.js';

// Export type utilities
export type {
  DeepReadonly,
  StrictExtract,
  UIStateConstraint,
  EnforceStrictProps,
  AssertExhaustive,
} from './typeUtils.js';

export type { DeepPartial } from '../core/base.js';

export { 
  isComponentType, 
  isUIComponent,
  hasRequiredProps,
} from './typeUtils.js';
