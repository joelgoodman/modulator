// Core functionality
export { ModulatorEditor } from './editor/ModulatorEditor.js';
export { Block } from './blocks/Block.js';
export { BlockManager } from './blocks/BlockManager.js';
export { BlockRegistry } from './registry/BlockRegistry.js';
export { StateManager } from './state/StateManager.js';
export { EventEmitter } from './events/EventEmitter.js';

// Plugin system
export { PluginManager } from './plugins/PluginManager.js';

// Rendering
export { BaseRenderer, DefaultRenderer } from './rendering/renderer.js';

// Features
export { AccessibilityManager } from './accessibility/AccessibilityManager.js';
export { PerformanceManager } from './performance/PerformanceManager.js';
export { SecurityManager } from './security/SecurityManager.js';
export { BlockInteractionManager } from './interactions/BlockInteractions.js';

// Configuration
export { ConfigLoader } from './config/ConfigLoader.js';

// Re-export types
export type {
  BlockData,
  BlockType,
  BlockConfig,
  Position,
  BlockOperation,
  BlockRenderOptions,
  BlockSelection,
  PluginContext,
  Plugin,
  EditorOptions,
  EditorState,
  EditorCommand,
  ToolbarContext,
  ToolbarItem,
  ToolbarGroup,
  ToolbarPlugin,
  ToolbarPluginContext,
  SanitizationConfig,
  ValidationResult,
  ValidationOptions,
  SecurityContext,
  SecurityPolicy,
  EventHandler,
  EventSubscription,
  EventEmitterOptions,
  AccessibilityContext,
  PerformanceContext,
} from '@modulator/types';
