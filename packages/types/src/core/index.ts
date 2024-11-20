// Export editor types
export type {
  EditorState,
  EditorOptions,
  EditorCommand,
  BlockRenderOptions,
  BlockSelection,
  BlockInteractionContext,
  InteractionState,
  DragState,
  SelectionState,
  SecurityContext,
  SanitizationConfig,
} from './types.js';

// Export state types
export type { StateManager } from './state.js';

// Export event types
export { BlockEventType } from './event.js';
export type {
  BlockEvent,
  BlockEventMetadata,
  EventHandler,
  EventSubscription,
  EventEmitterOptions,
  EventEmitter,
} from './event.js';

// Export registry types
export type { BlockRegistry, BlockRegistryOptions, BlockRegistryEventData } from './registry.js';
