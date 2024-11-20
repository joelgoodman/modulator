import type { Theme } from './themes.js';
import type { PerformanceConfig } from '../performance/config.js';

/**
 * Theme options
 */

/**
 * Block configuration
 */
export interface BlockTypeConfig {
  /**
   * Custom block types
   */
  custom?: string[];

  /**
   * Block type options
   */
  options?: Record<string, unknown>;

  /**
   * Block validation rules
   */
  validation?: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    customRules?: Record<string, (content: unknown) => boolean>;
  };
}

/**
 * Security configuration
 */
export interface SecurityConfig {
  /**
   * Content sanitization
   */
  sanitization?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    allowedSchemes?: string[];
  };

  /**
   * Content validation
   */
  validation?: {
    maxSize?: number;
    allowedTypes?: string[];
    customRules?: Record<string, (content: unknown) => boolean>;
  };
}

/**
 * Core editor configuration
 */
export interface ModulatorConfig {
  /** Theme setting */
  theme?: Theme;

  /** Enable debug mode */
  debug?: boolean;

  /** Plugin configurations */
  plugins?: Record<string, unknown>;

  /** Block type configurations */
  blocks?: BlockTypeConfig;

  /** Security settings */
  security?: SecurityConfig;

  /** Performance settings */
  performance?: PerformanceConfig;
}
