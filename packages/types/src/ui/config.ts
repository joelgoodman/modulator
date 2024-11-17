/**
 * Theme options
 */
export type Theme = 'light' | 'dark';

/**
 * Core editor configuration
 */
export interface ModulatorConfig {
  /**
   * Editor theme
   */
  theme?: Theme;

  /**
   * Enable debugging features
   */
  debug?: boolean;

  /**
   * Plugin configurations
   */
  plugins?: Record<string, unknown>;

  /**
   * Block type configurations
   */
  blocks?: {
    /**
     * Custom block types to register
     */
    custom?: string[];

    /**
     * Block type specific configurations
     */
    config?: Record<string, unknown>;
  };

  /**
   * Security configurations
   */
  security?: {
    /**
     * Content sanitization options
     */
    sanitization?: {
      /**
       * Allowed HTML tags
       */
      allowedTags?: string[];

      /**
       * Strip script tags
       */
      stripScripts?: boolean;
    };
  };

  /**
   * Accessibility configurations
   */
  accessibility?: {
    /**
     * Enable screen reader support
     */
    screenReader?: boolean;

    /**
     * Enable keyboard navigation
     */
    keyboardNavigation?: boolean;

    /**
     * Default locale
     */
    locale?: string;
  };

  /**
   * Performance configurations
   */
  performance?: {
    /**
     * Enable performance monitoring
     */
    monitoring?: boolean;

    /**
     * Enable lazy loading
     */
    lazyLoad?: boolean;

    /**
     * Enable virtualization
     */
    virtualize?: boolean;
  };
}
