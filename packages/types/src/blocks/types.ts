/**
 * @fileoverview Block System Type Definitions
 * @module @modulator/types/blocks
 * @remarks
 * Defines core type interfaces for block-based document system.
 * Provides foundational types for block data, positioning, 
 * and rendering configurations.
 */

/**
 * Base block data interface
 * @template T - Additional custom data properties
 * @remarks
 * Represents the fundamental structure of a block in the system.
 * Allows for flexible, extensible block data with a consistent core.
 * 
 * @example
 * ```typescript
 * // Basic block data
 * const textBlock: BlockData = {
 *   id: 'block-123',
 *   type: 'text',
 *   content: 'Hello, world!'
 * };
 * 
 * // Extended block data
 * interface TextBlockData extends BlockData {
 *   content: string;
 *   fontSize?: number;
 * }
 * 
 * const customTextBlock: TextBlockData = {
 *   id: 'block-456',
 *   type: 'text',
 *   content: 'Custom text',
 *   fontSize: 16
 * };
 * ```
 */
export interface BlockData<T extends Record<string, unknown> = Record<string, unknown>> {
  /** 
   * Allows for arbitrary additional properties 
   * @remarks Enables flexible block data structures
   */
  [key: string]: unknown;

  /** 
   * Unique identifier for the block 
   * @remarks Ensures each block can be uniquely referenced
   */
  id: string;

  /** 
   * Type of the block 
   * @remarks Defines the block's semantic or structural category
   */
  type: string;

  /** 
   * Optional custom data properties 
   * @remarks Allows type-safe extension of block data
   */
  customData?: T;
}

/**
 * Represents a block's position within a document structure
 * @remarks
 * Provides information about a block's location and hierarchical context.
 * 
 * @example
 * ```typescript
 * const position: Position = {
 *   index: 2,
 *   parent: 'parent-block-id'
 * };
 * ```
 */
export interface Position {
  /** 
   * Zero-based index of the block within its container 
   * @remarks Determines the block's sequential position
   */
  index: number;

  /** 
   * Identifier of the parent block 
   * @remarks Enables nested or hierarchical block structures
   */
  parent?: string;
}

/**
 * Rendering configuration options for blocks
 * @remarks
 * Provides comprehensive styling and attribute customization 
 * for block rendering.
 * 
 * @example
 * ```typescript
 * const renderOptions: BlockRenderOptions = {
 *   className: 'custom-block',
 *   style: { color: 'red', fontSize: '16px' },
 *   attributes: { 'data-custom': 'value' }
 * };
 * ```
 */
export interface BlockRenderOptions {
  /** 
   * Additional CSS class names to apply 
   * @remarks Enables custom styling and theming
   */
  className?: string;

  /** 
   * Inline styles to apply to the block 
   * @remarks Allows dynamic, programmatic styling
   */
  style?: Partial<CSSStyleDeclaration>;

  /** 
   * Additional HTML attributes 
   * @remarks Provides extensibility for custom rendering requirements
   */
  attributes?: Record<string, string>;
}
