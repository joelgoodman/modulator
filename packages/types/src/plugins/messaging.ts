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
export interface PluginMessage {
  type: PluginMessageType;
  source: string;
  target?: string;
  channel?: string;
  data: unknown;
  id?: string;
  timestamp: number;
}

/**
 * Plugin message handler
 */
export type PluginMessageHandler = (message: PluginMessage) => void;

/**
 * Plugin request handler
 */
export type PluginRequestHandler = (data: unknown) => Promise<unknown>;

/**
 * Plugin messaging interface
 */
export interface PluginMessaging {
  /**
   * Send message to plugin
   */
  sendMessage: (target: string, data: unknown) => void;

  /**
   * Broadcast message to all plugins
   */
  broadcastMessage: (channel: string, data: unknown) => void;

  /**
   * Send request to plugin
   */
  sendRequest: (target: string, data: unknown, timeout?: number) => Promise<unknown>;

  /**
   * Register message handler
   */
  onMessage: (handler: PluginMessageHandler) => () => void;

  /**
   * Register request handler
   */
  onRequest: (channel: string, handler: PluginRequestHandler) => () => void;
}
