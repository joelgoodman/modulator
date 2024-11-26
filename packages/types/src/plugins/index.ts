/**
 * @fileoverview Plugin System Type Exports
 * @module @modulator/types/plugins
 */

import type { BlockData } from '../blocks/types.js';
import type { EventHandler, EventEmitter } from '../core/types.js';
import type { StateManager } from '../core/state.js';

export type {
  Plugin,
  PluginConfig,
  PluginContext,
  PluginHealth,
  PluginStateData,
  PluginStateManager,
  PluginMessaging,
  PluginEvents
} from './plugin.js';

export type {
  StateManagerAdapter,
  EventHandler,
  EventSubscription,
  EventEmitter
} from './stateManagerAdapter.js';

export type {
  BlockInteractionManager,
  GenericRenderer
} from './interaction.js';

/**
 * Export additional core types for convenience
 * @remarks
 * Provides quick access to commonly used types from other modules
 */
export type {
  /** Block data structure */
  BlockData,
  /** Generic event handler type */
  EventHandler,
  /** Event emitter interface */
  EventEmitter,
  /** State management interface */
  StateManager,
};
