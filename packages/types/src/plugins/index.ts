import type { BlockData } from '../blocks/types.js';
import type { EventHandler, EventEmitter } from '../core/types.js';
import type { StateManager } from '../core/state.js';

// Re-export plugin types
export type {
  PluginStateData,
  PluginStateManager,
  Plugin,
  PluginContext,
  PluginConfig,
  PluginHealth,
  PluginLifecycleHooks,
} from './plugin.js';

// Export PluginState as both type and value
export { PluginState } from './plugin.js';

// Re-export messaging types
export type {
  PluginMessaging,
  PluginMessage,
  PluginMessageType,
  PluginMessageHandler,
} from './messaging.js';

// Re-export toolbar types
export type {
  ToolbarItem,
  ToolbarGroup,
  ToolbarContext,
  ToolbarPlugin,
  ToolbarPosition,
  ToolbarOptions,
} from './toolbar.js';

// Export additional types for convenience
export type { BlockData, EventHandler, EventEmitter, StateManager };
