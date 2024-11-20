/**
 * Base block data interface
 */
export interface BlockData {
  [key: string]: unknown;
  id: string;
  type: string;
}

/**
 * Position in the document
 */
export interface Position {
  /**
   * Block index
   */
  index: number;

  /**
   * Parent block ID
   */
  parent?: string;
}

/**
 * Block render options
 */
export interface BlockRenderOptions {
  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: Partial<CSSStyleDeclaration>;

  /**
   * Additional HTML attributes
   */
  attributes?: Record<string, string>;
}
