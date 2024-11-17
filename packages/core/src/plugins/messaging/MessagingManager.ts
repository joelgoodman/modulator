import { EventEmitter } from '../../events/EventEmitter.js';
import {
  PluginMessage,
  PluginMessageHandler,
  PluginRequestHandler,
  PluginMessaging,
  PluginMessageType,
} from '@modulator/types';

/**
 * Manages plugin messaging and communication
 */
export class MessagingManager {
  private messageHandlers: Map<string, Set<PluginMessageHandler>>;
  private requestHandlers: Map<string, Map<string, PluginRequestHandler>>;
  private pendingRequests: Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (error: Error) => void;
      timeout: NodeJS.Timeout;
    }
  >;
  private eventEmitter: EventEmitter;

  constructor(eventEmitter: EventEmitter) {
    this.messageHandlers = new Map();
    this.requestHandlers = new Map();
    this.pendingRequests = new Map();
    this.eventEmitter = eventEmitter;
  }

  /**
   * Get message handlers for a plugin
   */
  getHandlers(pluginId: string): Set<PluginMessageHandler> | undefined {
    return this.messageHandlers.get(pluginId);
  }

  /**
   * Get request handlers for a plugin
   */
  getRequestHandlers(pluginId: string): Map<string, PluginRequestHandler> | undefined {
    return this.requestHandlers.get(pluginId);
  }

  /**
   * Register message handler
   */
  registerHandler(pluginId: string, handler: PluginMessageHandler): void {
    let handlers = this.messageHandlers.get(pluginId);
    if (!handlers) {
      handlers = new Set();
      this.messageHandlers.set(pluginId, handlers);
    }
    handlers.add(handler);
  }

  /**
   * Unregister message handler
   */
  unregisterHandler(pluginId: string, handler: PluginMessageHandler): void {
    const handlers = this.messageHandlers.get(pluginId);
    if (handlers) {
      handlers.delete(handler);
      if (handlers.size === 0) {
        this.messageHandlers.delete(pluginId);
      }
    }
  }

  /**
   * Register request handler
   */
  registerRequestHandler(pluginId: string, channel: string, handler: PluginRequestHandler): void {
    let handlers = this.requestHandlers.get(pluginId);
    if (!handlers) {
      handlers = new Map();
      this.requestHandlers.set(pluginId, handlers);
    }
    handlers.set(channel, handler);
  }

  /**
   * Unregister request handler
   */
  unregisterRequestHandler(pluginId: string, channel: string): void {
    const handlers = this.requestHandlers.get(pluginId);
    if (handlers) {
      handlers.delete(channel);
      if (handlers.size === 0) {
        this.requestHandlers.delete(pluginId);
      }
    }
  }

  /**
   * Send message to plugin
   */
  sendMessage(source: string, target: string, data: unknown): void {
    const message: PluginMessage = {
      type: 'plugin:message',
      source,
      target,
      data,
      timestamp: Date.now(),
    };

    const handlers = this.messageHandlers.get(target);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message);
        } catch (error) {
          console.error(`Error handling message in plugin '${target}':`, error);
        }
      });
    }
  }

  /**
   * Broadcast message to all plugins
   */
  broadcast(message: PluginMessage): void {
    this.messageHandlers.forEach((handlers, pluginId) => {
      if (pluginId !== message.source) {
        handlers.forEach(handler => {
          try {
            handler(message);
          } catch (error) {
            console.error(`Error handling broadcast in plugin '${pluginId}':`, error);
          }
        });
      }
    });
  }

  /**
   * Create plugin messaging interface
   */
  createPluginMessaging(pluginId: string): PluginMessaging {
    return {
      sendMessage: (target: string, data: unknown) => this.sendMessage(pluginId, target, data),
      broadcastMessage: (channel: string, data: unknown) =>
        this.broadcast({
          type: 'plugin:broadcast',
          source: pluginId,
          channel,
          data,
          timestamp: Date.now(),
        }),
      sendRequest: (target: string, data: unknown, timeout?: number) =>
        this.sendRequest(pluginId, target, data, timeout),
      onMessage: (handler: PluginMessageHandler) => {
        this.registerHandler(pluginId, handler);
        return () => this.unregisterHandler(pluginId, handler);
      },
      onRequest: (channel: string, handler: PluginRequestHandler) => {
        this.registerRequestHandler(pluginId, channel, handler);
        return () => this.unregisterRequestHandler(pluginId, channel);
      },
    };
  }

  /**
   * Send request to plugin
   */
  async sendRequest(
    source: string,
    target: string,
    data: unknown,
    timeout = 5000
  ): Promise<unknown> {
    const id = `${source}-${target}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const message: PluginMessage = {
      type: 'plugin:request',
      source,
      target,
      data,
      id,
      timestamp: Date.now(),
    };

    const handlers = this.requestHandlers.get(target);
    if (!handlers) {
      throw new Error(`Plugin '${target}' does not accept requests`);
    }

    return new Promise((resolve, reject) => {
      // Set timeout
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error(`Request to plugin '${target}' timed out`));
      }, timeout);

      // Store pending request
      this.pendingRequests.set(id, {
        resolve,
        reject,
        timeout: timeoutId,
      });

      // Send request
      handlers.forEach((handler, channel) => {
        if (!message.channel || message.channel === channel) {
          try {
            handler(data)
              .then(response => {
                const pending = this.pendingRequests.get(id);
                if (pending) {
                  clearTimeout(pending.timeout);
                  this.pendingRequests.delete(id);
                  pending.resolve(response);
                }
              })
              .catch(error => {
                const pending = this.pendingRequests.get(id);
                if (pending) {
                  clearTimeout(pending.timeout);
                  this.pendingRequests.delete(id);
                  pending.reject(error);
                }
              });
          } catch (error) {
            console.error(`Error handling request in plugin '${target}':`, error);
          }
        }
      });
    });
  }
}
