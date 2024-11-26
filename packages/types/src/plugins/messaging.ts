/**
 * @fileoverview Plugin Messaging System
 * @module @modulator/types/plugins/messaging
 * @remarks
 * Defines the messaging infrastructure for inter-plugin communication.
 * Provides types and interfaces for message passing, broadcasting,
 * and request-response patterns.
 */

/**
 * Enumeration of plugin message types
 * @remarks
 * Defines the different types of messages that can be sent between plugins.
 * Supports standard messages, requests, responses, and broadcasts.
 */
export type PluginMessageType =
  | 'plugin:message'  // Standard message between plugins
  | 'plugin:request'  // Request-response style communication
  | 'plugin:response' // Response to a previous request
  | 'plugin:broadcast'; // Message sent to multiple or all plugins

/**
 * Structure of a plugin message
 * @template T - Type of message data
 * @remarks
 * Provides a standardized format for messages passed between plugins.
 * Includes metadata like source, target, and timestamp for traceability.
 *
 * @example
 * ```typescript
 * const message: PluginMessage<string> = {
 *   type: 'plugin:message',
 *   source: 'sender-plugin',
 *   target: 'receiver-plugin',
 *   data: 'Hello, other plugin!',
 *   timestamp: Date.now()
 * };
 * ```
 */
export interface PluginMessage<T = unknown> {
  /** Type of the message */
  type: PluginMessageType;

  /** ID of the plugin sending the message */
  source: string;

  /** ID of the plugin receiving the message (optional for broadcasts) */
  target?: string;

  /** Broadcast channel name (for broadcast messages) */
  channel?: string;

  /** Message payload */
  data: T;

  /** Timestamp when the message was created */
  timestamp: number;

  /** Optional correlation ID for request-response pairs */
  correlationId?: string;
}

/**
 * Handler function for processing plugin messages
 * @template T - Type of message data
 * @remarks
 * A function that can process incoming plugin messages.
 * Used for registering message listeners in the plugin system.
 *
 * @example
 * ```typescript
 * const messageHandler: PluginMessageHandler<string> = (message) => {
 *   console.log(`Received message: ${message.data}`);
 * };
 * ```
 */
export type PluginMessageHandler<T = unknown> = (message: PluginMessage<T>) => void;

/**
 * Handler function for processing plugin requests
 * @template T - Type of request data
 * @template R - Type of response data
 * @remarks
 * A function that processes a request and returns a promise with a response.
 * Supports asynchronous request-response communication between plugins.
 *
 * @example
 * ```typescript
 * const requestHandler: PluginRequestHandler<string, number> = async (data) => {
 *   // Process request and return a response
 *   return data.length;
 * };
 * ```
 */
export type PluginRequestHandler<T = unknown, R = unknown> = (data: T) => Promise<R>;

/**
 * Interface for plugin messaging capabilities
 * @remarks
 * Provides methods for sending messages, making requests,
 * and handling incoming communications between plugins.
 *
 * @example
 * ```typescript
 * // Sending a message
 * messaging.sendMessage('target-plugin', { key: 'value' });
 *
 * // Handling incoming messages
 * messaging.onMessage((message) => {
 *   // Process message
 * });
 * ```
 */
export interface PluginMessaging {
  /**
   * Send a message to a specific plugin
   * @template T - Type of message data
   * @param target - ID of the target plugin
   * @param data - Message payload
   */
  sendMessage<T = unknown>(target: string, data: T): void;

  /**
   * Broadcast a message to all plugins on a specific channel
   * @template T - Type of message data
   * @param channel - Broadcast channel name
   * @param data - Message payload
   */
  broadcastMessage<T = unknown>(channel: string, data: T): void;

  /**
   * Send a request to a plugin and wait for a response
   * @template T - Type of request data
   * @template R - Type of response data
   * @param target - ID of the target plugin
   * @param data - Request payload
   * @param timeout - Optional timeout for the request
   * @returns Promise resolving to the response
   */
  sendRequest<T = unknown, R = unknown>(
    target: string,
    data: T,
    timeout?: number
  ): Promise<R>;

  /**
   * Register a handler for incoming messages
   * @template T - Type of message data
   * @param handler - Function to process incoming messages
   * @returns Function to unregister the message handler
   */
  onMessage<T = unknown>(handler: PluginMessageHandler<T>): () => void;

  /**
   * Register a handler for incoming requests
   * @template T - Type of request data
   * @template R - Type of response data
   * @param handler - Function to process incoming requests
   * @returns Function to unregister the request handler
   */
  onRequest<T = unknown, R = unknown>(handler: PluginRequestHandler<T, R>): () => void;
}
