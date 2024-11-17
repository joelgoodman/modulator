/**
 * Sanitization configuration
 */
export interface SanitizationConfig {
  /**
   * Allowed HTML tags
   */
  allowedTags: string[];

  /**
   * Allowed HTML attributes
   */
  allowedAttributes: Record<string, string[]>;

  /**
   * Allowed URL protocols
   */
  allowedProtocols: string[];

  /**
   * Remove unknown tags
   */
  stripUnknown: boolean;

  /**
   * Remove all scripts
   */
  stripScripts: boolean;

  /**
   * Maximum length for attribute values
   */
  maxAttributeLength: number;

  /**
   * Maximum length for text content
   */
  maxTextLength: number;
}

/**
 * Security validation result
 */
export interface ValidationResult {
  /**
   * Whether the content is valid
   */
  isValid: boolean;

  /**
   * List of validation errors
   */
  errors: string[];

  /**
   * Sanitized content (if validation failed)
   */
  sanitized?: unknown;
}

/**
 * Content validation options
 */
export interface ValidationOptions {
  /**
   * Allow HTML content
   */
  allowHTML?: boolean;

  /**
   * Allow external URLs
   */
  allowExternalUrls?: boolean;

  /**
   * Maximum content length
   */
  maxLength?: number;

  /**
   * Required content pattern
   */
  pattern?: RegExp;

  /**
   * Custom validation function
   */
  validate?: (content: unknown) => boolean;
}

/**
 * Security context
 */
export interface SecurityContext {
  /**
   * Current configuration
   */
  config: SanitizationConfig;

  /**
   * Update configuration
   */
  updateConfig: (config: Partial<SanitizationConfig>) => void;

  /**
   * Validate content
   */
  validate: (content: unknown, options?: ValidationOptions) => ValidationResult;

  /**
   * Sanitize HTML content
   */
  sanitizeHTML: (content: string) => string;

  /**
   * Validate URL
   */
  validateURL: (url: string) => ValidationResult;
}

/**
 * Security policy
 */
export interface SecurityPolicy {
  /**
   * Content Security Policy
   */
  csp?: string;

  /**
   * Allowed origins
   */
  allowedOrigins?: string[];

  /**
   * Allowed file types
   */
  allowedFileTypes?: string[];

  /**
   * Maximum file size (bytes)
   */
  maxFileSize?: number;

  /**
   * Rate limiting
   */
  rateLimit?: {
    /**
     * Maximum requests per window
     */
    maxRequests: number;

    /**
     * Time window (ms)
     */
    windowMs: number;
  };
}
