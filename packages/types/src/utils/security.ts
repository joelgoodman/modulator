/**
 * Content sanitization options
 */
export interface SanitizationOptions {
  /**
   * Allowed HTML tags
   */
  allowedTags?: string[];

  /**
   * Allowed HTML attributes
   */
  allowedAttributes?: Record<string, string[]>;

  /**
   * Allowed URL protocols
   */
  allowedProtocols?: string[];

  /**
   * Remove unknown elements
   */
  stripUnknown?: boolean;

  /**
   * Remove script elements
   */
  stripScripts?: boolean;

  /**
   * Maximum attribute length
   */
  maxAttributeLength?: number;

  /**
   * Maximum text length
   */
  maxTextLength?: number;
}

/**
 * Content validation result
 */
export interface ValidationResult {
  /**
   * Content is valid
   */
  isValid: boolean;

  /**
   * Validation errors
   */
  errors?: string[];

  /**
   * Validation warnings
   */
  warnings?: string[];
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
   * Content pattern
   */
  pattern?: RegExp;

  /**
   * Custom validator
   */
  validate?(content: unknown): boolean;
}

/**
 * Security policy options
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
    maxRequests: number;
    windowMs: number;
  };
}

/**
 * Security service
 */
export interface SecurityService {
  /**
   * Current configuration
   */
  config: SanitizationOptions;

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SanitizationOptions>): void;

  /**
   * Validate content
   */
  validate(content: unknown, options?: ValidationOptions): ValidationResult;

  /**
   * Sanitize HTML content
   */
  sanitizeHTML(content: string): string;

  /**
   * Validate URL
   */
  validateURL(url: string): ValidationResult;
}
