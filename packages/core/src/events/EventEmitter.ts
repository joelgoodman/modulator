import {
  BlockEvent,
  BlockEventType,
  EventHandler,
  EventSubscription,
  EventEmitterOptions,
} from '@modulator/types';

/**
 * Event emitter implementation
 */
export class EventEmitter {
  private handlers: Map<string, Set<EventHandler>>;
  private options: EventEmitterOptions;

  constructor(options: EventEmitterOptions = {}) {
    this.handlers = new Map();
    this.options = {
      maxListeners: 10,
      captureStackTrace: false,
      ...options,
    };
  }

  /**
   * Add event listener
   */
  on<T = BlockEvent>(type: string, handler: EventHandler<T>): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }

    const handlers = this.handlers.get(type)!;
    if (handlers.size >= (this.options.maxListeners || 10)) {
      console.warn(`Max listeners (${this.options.maxListeners}) exceeded for event '${type}'`);
    }

    handlers.add(handler as EventHandler);
  }

  /**
   * Add one-time event listener
   */
  once<T = BlockEvent>(type: string, handler: EventHandler<T>): void {
    const onceHandler: EventHandler<T> = (event: T) => {
      this.off(type, onceHandler);
      handler(event);
    };

    this.on(type, onceHandler);
  }

  /**
   * Remove event listener
   */
  off<T = BlockEvent>(type: string, handler: EventHandler<T>): void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      if (handlers.size === 0) {
        this.handlers.delete(type);
      }
    }
  }

  /**
   * Remove all event listeners
   */
  clear(): void {
    this.handlers.clear();
  }

  /**
   * Emit event
   */
  emit<T = BlockEvent>(event: T): void {
    if (typeof event === 'object' && event !== null && 'type' in event) {
      const type = (event as { type: string }).type;
      const handlers = this.handlers.get(type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            (handler as EventHandler<T>)(event);
          } catch (error) {
            console.error(`Error in event handler for "${type}":`, error);
            if (this.options.captureStackTrace) {
              console.error(error instanceof Error ? error.stack : new Error().stack);
            }
          }
        });
      }

      // Handle wildcard listeners
      const wildcardHandlers = this.handlers.get('*');
      if (wildcardHandlers) {
        wildcardHandlers.forEach(handler => {
          try {
            (handler as EventHandler<T>)(event);
          } catch (error) {
            console.error(`Error in wildcard event handler for "${type}":`, error);
            if (this.options.captureStackTrace) {
              console.error(error instanceof Error ? error.stack : new Error().stack);
            }
          }
        });
      }
    }
  }

  /**
   * Get event listeners
   */
  listeners(type: string): EventHandler[] {
    const handlers = this.handlers.get(type);
    return handlers ? Array.from(handlers) : [];
  }

  /**
   * Get event listener count
   */
  listenerCount(type: string): number {
    const handlers = this.handlers.get(type);
    return handlers ? handlers.size : 0;
  }
}
