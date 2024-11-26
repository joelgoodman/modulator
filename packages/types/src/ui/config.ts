import type { Theme } from './themes.js';
import type { PerformanceConfig } from '../performance/config.js';

/**
 * UI and Configuration Types Module
 * @module UIConfig
 * @description Provides comprehensive configuration types for UI, blocks, security, and system settings
 * @remarks
 * This module defines interfaces for configuring various aspects of the Modulator system,
 * including block types, security, performance, and core system settings
 * 
 * @category UI
 * @packageDocumentation
 */

/**
 * Block Type Configuration Interface
 * @interface
 * @description Defines configuration options for custom block types and their validation rules
 */
export interface BlockTypeConfig {
  /**
   * List of custom block type identifiers
   * @type {string[]}
   * @description Allows registration of additional block types beyond default types
   * @example ['code', 'diagram', 'timeline']
   */
  custom?: string[];

  /**
   * Block type-specific configuration options
   * @type {Record<string, unknown>}
   * @description Provides flexible configuration for different block types
   * @example { 'code': { language: 'typescript' } }
   */
  options?: Record<string, unknown>;

  /**
   * Validation rules for block content
   * @type {object}
   * @description Defines constraints and validation logic for block content
   */
  validation?: {
    /**
     * Indicates if the block is required
     * @type {boolean}
     * @default false
     */
    required?: boolean;

    /**
     * Maximum allowed content length
     * @type {number}
     * @description Limits the size of block content
     */
    maxLength?: number;

    /**
     * Minimum required content length
     * @type {number}
     * @description Ensures a minimum amount of content
     */
    minLength?: number;

    /**
     * Regular expression pattern for content validation
     * @type {string}
     * @description Validates content against a regex pattern
     * @example '^[A-Za-z]+$' // Only alphabetic characters
     */
    pattern?: string;

    /**
     * Custom validation rules
     * @type {Record<string, (content: unknown) => boolean>}
     * @description Allows defining complex, custom validation logic
     * @example { 'isEven': (value) => Number(value) % 2 === 0 }
     */
    customRules?: Record<string, (content: unknown) => boolean>;
  };
}

/**
 * Security Configuration Interface
 * @interface
 * @description Defines security settings for content sanitization and validation
 */
export interface SecurityConfig {
  /**
   * Content sanitization rules
   * @type {object}
   * @description Configures allowed HTML tags, attributes, and URL schemes
   */
  sanitization?: {
    /**
     * Allowed HTML tags
     * @type {string[]}
     * @description List of permitted HTML tags
     * @example ['p', 'strong', 'em', 'a']
     */
    allowedTags?: string[];

    /**
     * Allowed HTML attributes for specific tags
     * @type {Record<string, string[]>}
     * @description Maps tags to their permitted attributes
     * @example { 'a': ['href', 'title'] }
     */
    allowedAttributes?: Record<string, string[]>;

    /**
     * Allowed URL schemes
     * @type {string[]}
     * @description Defines permitted URL protocols
     * @example ['http', 'https', 'mailto']
     */
    allowedSchemes?: string[];
  };

  /**
   * Content validation rules
   * @type {object}
   * @description Defines constraints for content type and size
   */
  validation?: {
    /**
     * Maximum allowed content size in bytes
     * @type {number}
     * @description Prevents excessively large content uploads
     */
    maxSize?: number;

    /**
     * Allowed content types
     * @type {string[]}
     * @description Restricts permitted file or content types
     * @example ['image/png', 'image/jpeg', 'application/pdf']
     */
    allowedTypes?: string[];

    /**
     * Custom validation rules
     * @type {Record<string, (content: unknown) => boolean>}
     * @description Allows defining complex, custom validation logic
     * @example { 'isValidImage': (file) => checkImageIntegrity(file) }
     */
    customRules?: Record<string, (content: unknown) => boolean>;
  };
}

/**
 * Core Modulator Configuration Interface
 * @interface
 * @description Provides comprehensive configuration for the entire Modulator system
 */
export interface ModulatorConfig {
  /**
   * UI Theme configuration
   * @type {Theme}
   * @description Sets the visual theme for the entire application
   */
  theme?: Theme;

  /**
   * Debug mode toggle
   * @type {boolean}
   * @description Enables verbose logging and development features
   * @default false
   */
  debug?: boolean;

  /**
   * Plugin configurations
   * @type {Record<string, unknown>}
   * @description Allows configuring individual plugins
   * @example { 'markdown': { extensions: ['gfm'] } }
   */
  plugins?: Record<string, unknown>;

  /**
   * Block type configurations
   * @type {BlockTypeConfig}
   * @description Configures block types, their options, and validation
   */
  blocks?: BlockTypeConfig;

  /**
   * Security settings
   * @type {SecurityConfig}
   * @description Configures content sanitization and validation
   */
  security?: SecurityConfig;

  /**
   * Performance configuration
   * @type {PerformanceConfig}
   * @description Sets performance optimization strategies
   */
  performance?: PerformanceConfig;
}

/**
 * Default Modulator Configuration
 * @type {ModulatorConfig}
 * @description Provides sensible default configuration for the Modulator system
 */
export const DEFAULT_MODULATOR_CONFIG: ModulatorConfig = {
  debug: false,
  blocks: {
    custom: [],
    validation: {
      required: false,
      maxLength: 10000,
      minLength: 0
    }
  },
  security: {
    sanitization: {
      allowedTags: ['p', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
      allowedAttributes: {
        'a': ['href', 'title']
      },
      allowedSchemes: ['http', 'https', 'mailto']
    },
    validation: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['text/plain', 'text/markdown', 'text/html']
    }
  }
};
