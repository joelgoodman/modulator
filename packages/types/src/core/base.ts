/**
 * @fileoverview Base Type System
 * @module @modulator/types/core/base
 * @description Foundational types for the Modulator system
 * @remarks
 * This module provides the core type definitions that serve as building blocks
 * for the entire Modulator system. It includes essential interfaces and type
 * utilities for serialization, validation, transformation, and state management.
 */

/**
 * Represents any serializable data
 * @template T - The type of data being serialized
 * @remarks
 * Ensures that data can be safely serialized to JSON by excluding functions
 * and handling nested objects and arrays recursively.
 * 
 * @example
 * ```typescript
 * type UserData = Serializable<{
 *   id: string;
 *   profile: {
 *     name: string;
 *     age: number;
 *   };
 *   posts: string[];
 * }>;
 * ```
 */
export type Serializable<T> = T extends object
  ? { [K in keyof T]: Serializable<T[K]> }
  : T extends (infer U)[]
  ? Serializable<U>[]
  : T extends Function
  ? never
  : T;

/**
 * Deep partial type helper
 * @template T - Type to make deeply partial
 * @remarks
 * Makes all properties in an object hierarchy optional recursively.
 * Useful for update operations where only some fields may be modified.
 * 
 * @example
 * ```typescript
 * interface User {
 *   name: string;
 *   settings: {
 *     theme: string;
 *     notifications: boolean;
 *   };
 * }
 * 
 * const update: DeepPartial<User> = {
 *   settings: {
 *     theme: 'dark'
 *   }
 * };
 * ```
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

/**
 * Typed configuration helper
 * @template T - Configuration type
 * @remarks
 * Provides a type-safe way to define configuration objects with validation
 * and transformation capabilities for each property.
 * 
 * @example
 * ```typescript
 * interface ThemeConfig {
 *   primaryColor: string;
 *   fontSize: number;
 * }
 * 
 * const config: TypedConfig<ThemeConfig> = {
 *   primaryColor: {
 *     value: '#000000',
 *     validate: (color) => /^#[0-9A-F]{6}$/i.test(color)
 *   },
 *   fontSize: {
 *     value: 16,
 *     validate: (size) => size > 0
 *   }
 * };
 * ```
 */
export type TypedConfig<T extends Record<string, unknown>> = {
  [K in keyof T]: {
    value: T[K];
    validate?: (value: T[K]) => boolean;
    transform?: (value: T[K]) => T[K];
  };
};

/**
 * Type guard helper
 * @template T - Type to check
 * @remarks
 * Provides a type-safe way to perform runtime type checks.
 * 
 * @example
 * ```typescript
 * const isString: TypeGuard<string> = 
 *   (value: unknown): value is string => typeof value === 'string';
 * 
 * if (isString(someValue)) {
 *   // TypeScript knows someValue is a string here
 *   console.log(someValue.toUpperCase());
 * }
 * ```
 */
export type TypeGuard<T> = (value: unknown) => value is T;

/**
 * Validation result type
 * @template T - Type being validated
 */
export interface ValidationResult<T = unknown> {
  /** Whether the validation passed */
  valid: boolean;
  /** The validated value */
  value: T;
  /** Error message if validation failed */
  errors?: string[];
}

/**
 * Type-safe validator
 * @template T - Type to validate
 */
export interface Validator<T> {
  /** Validate the given data */
  validate(data: T): ValidationResult<T>;
}

/**
 * Transformation result type
 * @template T - Source type
 * @template R - Result type
 * @remarks
 * Represents the result of a transformation operation, including
 * the transformed value, source value, and any error messages.
 * 
 * @example
 * ```typescript
 * const result: TransformResult<string, number> = {
 *   success: true,
 *   value: 42,
 *   source: '42',
 *   errors: []
 * };
 * ```
 */
export interface TransformResult<T, R> {
  success: boolean;
  value: R;
  source: T;
  errors?: string[];
}

/**
 * Type-safe transformer
 * @template T - Source type
 * @template R - Result type
 * @remarks
 * Interface for implementing type-safe transformation logic.
 * 
 * @example
 * ```typescript
 * class StringToNumberTransformer implements Transformer<string, number> {
 *   transform(value: string): TransformResult<string, number> {
 *     const number = parseInt(value, 10);
 *     if (isNaN(number)) {
 *       return {
 *         success: false,
 *         value: 0,
 *         source: value,
 *         errors: ['Invalid number']
 *       };
 *     }
 *     return { success: true, value: number, source: value };
 *   }
 * }
 * ```
 */
export interface Transformer<T, R> {
  transform(value: T): TransformResult<T, R>;
}

/**
 * Identifiable interface
 * @remarks
 * Provides a common interface for objects that need a unique identifier.
 * 
 * @example
 * ```typescript
 * class User implements Identifiable {
 *   id: string = crypto.randomUUID();
 *   name: string;
 * }
 * ```
 */
export interface Identifiable {
  id: string;
}

/**
 * Versioned interface
 * @remarks
 * Provides a common interface for objects that need version tracking.
 * 
 * @example
 * ```typescript
 * class Document implements Versioned {
 *   version: string = '1.0.0';
 *   content: string;
 * }
 * ```
 */
export interface Versioned {
  version: string;
}

/**
 * Named interface
 * @remarks
 * Provides a common interface for objects that need a name property.
 * 
 * @example
 * ```typescript
 * class Plugin implements Named {
 *   name: string = 'my-plugin';
 *   enabled: boolean = true;
 * }
 * ```
 */
export interface Named {
  name: string;
}

/**
 * Configurable interface
 * @template T - Configuration type
 * @remarks
 * Provides a common interface for objects that can be configured.
 * 
 * @example
 * ```typescript
 * interface EditorConfig {
 *   theme: string;
 *   readOnly: boolean;
 * }
 * 
 * class Editor implements Configurable<EditorConfig> {
 *   config: EditorConfig = {
 *     theme: 'light',
 *     readOnly: false
 *   };
 * }
 * ```
 */
export interface Configurable<T> {
  config: T;
}

/**
 * Validatable interface
 * @remarks
 * Provides a common interface for objects that need to be validated.
 * 
 * @example
 * ```typescript
 * class User implements Validatable {
 *   validate(): boolean {
 *     // validation logic
 *   }
 * }
 * ```
 */
export interface Validatable {
  validate(): boolean;
}

/**
 * Transformable interface
 * @template T - Source type
 * @template R - Result type
 * @remarks
 * Provides a common interface for objects that can be transformed.
 * 
 * @example
 * ```typescript
 * class DataTransformer implements Transformable<string, number> {
 *   transform(data: string): number {
 *     // transformation logic
 *   }
 * }
 * ```
 */
export interface Transformable<T, R> {
  transform(data: T): R;
}

/**
 * Observable interface
 * @template T - Event type map
 * @remarks
 * Provides a common interface for objects that can emit events.
 * 
 * @example
 * ```typescript
 * class EventEmitter implements Observable<{
 *   'event1': string;
 *   'event2': number;
 * }> {
 *   on(event: string, handler: (data: any) => void): void {
 *     // event handling logic
 *   }
 *   off(event: string, handler: (data: any) => void): void {
 *     // event handling logic
 *   }
 *   emit(event: string, data: any): void {
 *     // event handling logic
 *   }
 * }
 * ```
 */
export interface Observable<T extends Record<string, unknown>> {
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void): void;
  off<K extends keyof T>(event: K, handler: (data: T[K]) => void): void;
  emit<K extends keyof T>(event: K, data: T[K]): void;
}

/**
 * State key type
 */
export type StateKey = string | number | symbol;

/**
 * Block data interface
 */
export interface BlockData {
  /** Unique identifier for the block */
  id: string;
  /** Block type identifier */
  type: string;
  /** Block content data */
  data: Record<string, unknown>;
  /** Block metadata */
  metadata?: Record<string, unknown>;
  /** Additional properties */
  [key: string]: unknown;
}

/**
 * Block selection interface
 */
export interface BlockSelection {
  /** Selected block ID */
  blockId: string;
  /** Selection range start */
  start: number;
  /** Selection range end */
  end: number;
}

/**
 * Drag state interface
 */
export interface DragState {
  /** Whether dragging is active */
  isDragging: boolean;
  /** ID of block being dragged */
  draggedBlockId?: string;
  /** Drop target block ID */
  dropTargetId?: string;
  /** Drop position relative to target */
  dropPosition?: 'before' | 'after';
}

/**
 * Editor state interface
 */
export interface EditorState {
  /** List of blocks in the editor */
  blocks: BlockData[];
  /** Current block selection */
  selection?: BlockSelection;
  /** Current drag state */
  dragState?: DragState;
  /** Editor metadata */
  metadata?: Record<string, unknown>;
}

/**
 * State container interface
 * @template T - State type
 * @remarks
 * Provides a common interface for objects that manage state.
 * 
 * @example
 * ```typescript
 * class StateManager implements StateContainer<{
 *   'state1': string;
 *   'state2': number;
 * }> {
 *   getState(): {
 *     'state1': string;
 *     'state2': number;
 *   } {
 *     // state management logic
 *   }
 *   setState(state: Partial<{
 *     'state1': string;
 *     'state2': number;
 *   }>): void {
 *     // state management logic
 *   }
 *   updateState(updater: (state: {
 *     'state1': string;
 *     'state2': number;
 *   }) => Partial<{
 *     'state1': string;
 *     'state2': number;
 *   }>): void {
 *     // state management logic
 *   }
 *   resetState(): void {
 *     // state management logic
 *   }
 *   save(): void {
 *     // state management logic
 *   }
 *   restore(): void {
 *     // state management logic
 *   }
 * }
 * ```
 */
export interface StateContainer<T extends Record<StateKey, any>> {
  getState(): T;
  setState(state: Partial<T>): void;
  updateState(updater: (state: T) => Partial<T>): void;
  resetState(): void;
  save(): void;
  restore(): void;
}

/**
 * Registry interface
 * @template T - Item type
 * @template C - Configuration type
 * @remarks
 * Provides a common interface for objects that manage registries.
 * 
 * @example
 * ```typescript
 * class RegistryManager implements Registry<string, {
 *   'config1': string;
 *   'config2': number;
 * }> {
 *   register(item: string, config?: {
 *     'config1': string;
 *     'config2': number;
 *   }): void {
 *     // registry management logic
 *   }
 *   unregister(id: string): void {
 *     // registry management logic
 *   }
 *   get(id: string): string | undefined {
 *     // registry management logic
 *   }
 *   has(id: string): boolean {
 *     // registry management logic
 *   }
 *   clear(): void {
 *     // registry management logic
 *   }
 * }
 * ```
 */
export interface Registry<T, C = unknown> {
  register(item: T, config?: C): void;
  unregister(id: string): void;
  get(id: string): T | undefined;
  has(id: string): boolean;
  clear(): void;
}

/**
 * Factory interface
 * @template T - Product type
 * @template C - Configuration type
 * @remarks
 * Provides a common interface for objects that create products.
 * 
 * @example
 * ```typescript
 * class ProductFactory implements Factory<string, {
 *   'config1': string;
 *   'config2': number;
 * }> {
 *   create(config: {
 *     'config1': string;
 *     'config2': number;
 *   }): string {
 *     // product creation logic
 *   }
 * }
 * ```
 */
export interface Factory<T, C = unknown> {
  create(config: C): T;
}
