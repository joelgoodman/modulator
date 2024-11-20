/**
 * Plugin message types
 */
export type PluginMessageType =
  | 'plugin:message'
  | 'plugin:request'
  | 'plugin:response'
  | 'plugin:broadcast';

/**
 * Plugin message
 */
export interface PluginMessage<T = unknown> {
  /**
   * Message type
   */
  type: PluginMessageType;

  /**
   * Source plugin ID
   */
  source: string;

  /**
   * Target plugin ID
   */
  target?: string;

  /**
   * Broadcast channel
   */
  channel?: string;

  /**
   * Message data
   */
  data: T;

  /**
   * Message ID for request/response
   */
  id?: string;

  /**
   * Message timestamp
   */
  timestamp: number;
}

/**
 * Plugin message handler
 */
export type PluginMessageHandler<T = unknown> = (message: PluginMessage<T>) => void;

/**
 * Plugin request handler
 */
export type PluginRequestHandler<T = unknown, R = unknown> = (data: T) => Promise<R>;

/**
 * Plugin messaging interface
 */
export interface PluginMessaging {
  /**
   * Send message to plugin
   */
  sendMessage<T>(target: string, data: T): void;

  /**
   * Broadcast message to all plugins
   */
  broadcastMessage<T>(channel: string, data: T): void;

  /**
   * Send request to plugin
   */
  sendRequest<T, R>(target: string, data: T, timeout?: number): Promise<R>;

  /**
   * Handle incoming messages
   */
  onMessage<T>(handler: PluginMessageHandler<T>): () => void;

  /**
   * Handle incoming requests
   */
  onRequest<T, R>(handler: PluginRequestHandler<T, R>): () => void;
}
