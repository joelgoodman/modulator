/**
 * @module SecurityUtils
 * @description Security-related type definitions for content validation, sanitization, and policy management
 * 
 * This module provides comprehensive type definitions for implementing robust security
 * mechanisms in the Modulator project. It covers content sanitization, validation,
 * security policies, and security service interfaces.
 * 
 * @see {@link SanitizationOptions} For configuring content sanitization
 * @see {@link ValidationOptions} For defining content validation rules
 * @see {@link SecurityPolicy} For defining application-wide security policies
 * 
 * @example
 * // Example of using security types
 * const sanitizationConfig: SanitizationOptions = {
 *   allowedTags: ['p', 'b', 'i'],
 *   stripScripts: true,
 *   maxTextLength: 1000
 * };
 */

/**
 * Content sanitization options
 * @description Configures how HTML content should be sanitized and processed
 */
export interface SanitizationOptions {
  /**
   * Allowed HTML tags
   * @example ['p', 'b', 'i', 'a']
   */
  allowedTags?: string[];

  /**
   * Allowed HTML attributes
   * @example { 'a': ['href', 'title'] }
   */
  allowedAttributes?: Record<string, string[]>;

  /**
   * Allowed URL protocols
   * @example ['http', 'https', 'mailto']
   */
  allowedProtocols?: string[];

  /**
   * Remove unknown elements
   * @default false
   */
  stripUnknown?: boolean;

  /**
   * Remove script elements
   * @default true
   */
  stripScripts?: boolean;

  /**
   * Maximum attribute length
   * @default 200
   */
  maxAttributeLength?: number;

  /**
   * Maximum text length
   * @default 5000
   */
  maxTextLength?: number;
}

/**
 * Content validation result
 * @description Represents the outcome of content validation
 */
export interface ValidationResult {
  /**
   * Indicates whether the content is valid
   */
  isValid: boolean;

  /**
   * List of validation errors, if any
   */
  errors?: string[];

  /**
   * List of validation warnings, if any
   */
  warnings?: string[];
}

/**
 * Content validation options
 * @description Defines rules and constraints for content validation
 */
export interface ValidationOptions {
  /**
   * Allow HTML content
   * @default false
   */
  allowHTML?: boolean;

  /**
   * Allow external URLs
   * @default false
   */
  allowExternalUrls?: boolean;

  /**
   * Maximum content length
   * @default 10000
   */
  maxLength?: number;

  /**
   * Content pattern for validation
   * @example /^[a-zA-Z0-9]+$/
   */
  pattern?: RegExp;

  /**
   * Custom validator function
   * @param content The content to validate
   * @returns Boolean indicating validity
   */
  validate?(content: unknown): boolean;
}

/**
 * Security policy options
 * @description Defines comprehensive security policies for the application
 */
export interface SecurityPolicy {
  /**
   * Content Security Policy (CSP)
   * @example "default-src 'self'; script-src 'self' https://trusted.cdn.com"
   */
  csp?: string;

  /**
   * Allowed origins for cross-origin requests
   * @example ['https://api.example.com', 'https://trusted-domain.com']
   */
  allowedOrigins?: string[];

  /**
   * Allowed file types for upload
   * @example ['.pdf', '.jpg', '.png']
   */
  allowedFileTypes?: string[];

  /**
   * Maximum file size in bytes
   * @default 10 * 1024 * 1024 // 10MB
   */
  maxFileSize?: number;

  /**
   * Rate limiting configuration
   * @description Limits the number of requests within a specified time window
   */
  rateLimit?: {
    /**
     * Maximum number of requests allowed
     */
    maxRequests: number;
    /**
     * Time window in milliseconds
     */
    windowMs: number;
  };
}

/**
 * Security service interface
 * @description Defines methods for content validation, sanitization, and security management
 */
export interface SecurityService {
  /**
   * Current security configuration
   */
  config: SanitizationOptions;

  /**
   * Update the current security configuration
   * @param config Partial configuration to update
   */
  updateConfig(config: Partial<SanitizationOptions>): void;

  /**
   * Validate content based on provided options
   * @param content Content to validate
   * @param options Validation options
   * @returns Validation result
   */
  validate(content: unknown, options?: ValidationOptions): ValidationResult;

  /**
   * Sanitize HTML content
   * @param content HTML content to sanitize
   * @returns Sanitized HTML
   */
  sanitizeHTML(content: string): string;

  /**
   * Validate a URL
   * @param url URL to validate
   * @returns Validation result
   */
  validateURL(url: string): ValidationResult;
}
