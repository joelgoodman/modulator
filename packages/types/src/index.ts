/**
 * @module @modulator/types
 * @description Type definitions for the Modulator editor ecosystem
 * 
 * @remarks
 * This package provides a centralized collection of type definitions for the Modulator
 * editor. It serves as the core type system, enabling type-safe development across
 * different modules and components.
 * 
 * Key Modules:
 * - Blocks: Types for block management and operations
 * - Core: Foundational types for editor state, events, and rendering
 * - Plugins: Types for plugin system and extensibility
 * - UI: User interface configuration and theming types
 * - Utils: Utility types for security, performance, and cross-cutting concerns
 * 
 * @example
 * // Import types from specific modules
 * import { Block, BlockData } from '@modulator/types/blocks';
 * import { Plugin, PluginContext } from '@modulator/types/plugins';
 * 
 * @see {@link module:Blocks} For block-related type definitions
 * @see {@link module:Core} For core editor type definitions
 * @see {@link module:Plugins} For plugin system type definitions
 * @see {@link module:UI} For user interface type definitions
 * @see {@link module:Utils} For utility type definitions
 */

// Core types
export type {
  // Base types
  Serializable,
  DeepPartial,
  TypedConfig,
  TypeGuard,
  ValidationResult,
  Validator,
  TransformResult,
  Transformer,
  Identifiable,
  Versioned,
  Named,
  Configurable,
  Validatable,
  Transformable,
  Observable,
  StateKey,
  
  // Block types
  BlockData,
  BlockSelection,
  DragState,
  EditorState,
  StateContainer
} from './core/base.js';

// Block types
export type {
  Block,
  BlockType,
  BlockId,
  BlockInstance,
  Position,
  BlockOperation,
  BlockOperationType,
  BlockValidationResult,
  BlockEventType
} from './blocks/index.js';

// Plugin types
export type {
  Plugin,
  PluginConfig,
  PluginContext,
  PluginHealth,
  PluginStateData,
  PluginStateManager,
  PluginMessaging,
  StateManagerAdapter,
  BlockInteractionManager,
  GenericRenderer,
  PluginEvents,
  EventHandler,
  EventSubscription,
  EventEmitter
} from './plugins/index.js';

// UI types
export type {
  Theme,
  ThemeProvider,
  UIComponent,
  UIProps,
  UIState,
  ToolbarContext,
  ToolbarGroup,
  ToolbarItem,
  ToolbarState,
  ToolbarOptions
} from './ui/index.js';

// Utils
export type {
  DeepReadonly,
  StrictExtract,
  AssertExhaustive,
  UIStateConstraint,
  DynamicProps
} from './utils/index.js';
