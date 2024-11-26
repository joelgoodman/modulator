import type { EventHandler, EventSubscription } from '@modulator/types';

/**
 * Extended event subscription type with unsubscribe method
 */
type ExtendedEventSubscription = EventSubscription & {
  unsubscribe: () => void;
};

/**
 * Type-safe event system for the editor
 */
export class EventSystem {
  private eventSubscriptions: Map<string, Set<EventHandler>> = new Map();

  /**
   * Subscribe to a specific event type
   * @param eventType Type of event to subscribe to
   * @param handler Event handler function
   * @returns Event subscription object
   */
  subscribe(eventType: string, handler: EventHandler): ExtendedEventSubscription {
    const subscriptions = this.eventSubscriptions.get(eventType) || new Set();
    subscriptions.add(handler);
    this.eventSubscriptions.set(eventType, subscriptions);

    return {
      type: eventType,
      handler,
      unsubscribe: () => {
        subscriptions.delete(handler);
      },
    };
  }

  /**
   * Emit an event to all subscribers
   * @param eventType Type of event to emit
   * @param payload Event payload
   */
  emit(eventType: string, payload?: unknown): void {
    const handlers = this.eventSubscriptions.get(eventType);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }

  /**
   * Clear all subscriptions for a specific event type
   * @param eventType Event type to clear
   */
  clearSubscriptions(eventType: string): void {
    this.eventSubscriptions.delete(eventType);
  }
}
