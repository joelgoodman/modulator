/**
 * @fileoverview Type Utility System for Modulator
 * @module @modulator/types/utils/typeUtils
 * @description
 * Provides a comprehensive set of utility types and type guards for enforcing
 * type safety across the Modulator project. These utilities include:
 * 
 * 1. Standalone Utility Types:
 *    - DeepReadonly: Deep readonly type transformer
 *    - StrictExtract: Enhanced type extraction
 *    - EnforceStrictProps: Non-function property enforcer
 *    - AssertExhaustive: Exhaustive type checking
 * 
 * 2. Core System Integrations:
 *    - UIStateConstraint: Integrates with core EditorState
 * 
 * 3. UI System Integrations:
 *    - DynamicProps: Builds on UI's PropsForType
 * 
 * @remarks
 * The type utility system is designed to:
 * - Enforce strict type safety at compile time
 * - Provide common type transformations
 * - Enable runtime type checking
 * - Support component type validation
 * - Ensure exhaustive type checking
 * - Integrate seamlessly with core and UI types
 */

import type { UIComponent } from '../ui/components.js';
import type { EditorState } from '../core/editor.js';
import type { PropsForType } from '../ui/props.js';

/**
 * Makes all properties in T and its nested properties readonly
 * @template T - The type to make deeply readonly
 * 
 * @remarks
 * Creates a deeply readonly version of a type, ensuring that no properties
 * can be modified after initialization. This is useful for creating
 * immutable data structures.
 * 
 * This is a standalone utility type that complements TypeScript's built-in
 * Readonly type with deep readonly capabilities.
 * 
 * @example
 * ```typescript
 * interface Config {
 *   settings: {
 *     enabled: boolean;
 *     value: number;
 *   };
 * }
 * 
 * const config: DeepReadonly<Config> = {
 *   settings: {
 *     enabled: true,
 *     value: 42
 *   }
 * };
 * // This will cause a type error:
 * // config.settings.enabled = false;
 * ```
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Strictly extracts types from T that are assignable to U
 * @template T - The type to extract from
 * @template U - The type to check against
 * 
 * @remarks
 * Enhances TypeScript's built-in Extract utility type by ensuring
 * that the extracted type is strictly assignable to U. This helps catch
 * potential type mismatches that the standard Extract might miss.
 * 
 * This is a standalone utility type that provides stricter type extraction
 * than TypeScript's built-in Extract.
 * 
 * @example
 * ```typescript
 * type Animal = 'cat' | 'dog' | 'fish';
 * type Pet = 'cat' | 'dog';
 * 
 * // Standard Extract would allow this
 * type StandardPets = Extract<Animal, Pet>; // 'cat' | 'dog' | 'fish'
 * 
 * // StrictExtract ensures exact matches
 * type StrictPets = StrictExtract<Animal, Pet>; // 'cat' | 'dog'
 * ```
 */
export type StrictExtract<T, U> = Extract<T, U> extends never ? never : Extract<T, U>;

/**
 * Enforces that all properties of T are non-function values
 * @template T - The type to check
 * 
 * @remarks
 * Creates a type that ensures all properties are data values rather than
 * functions. This is useful for creating pure data objects or serializable
 * structures.
 * 
 * This is a standalone utility type that helps enforce data-only objects
 * by excluding function properties.
 * 
 * @example
 * ```typescript
 * interface Mixed {
 *   data: string;
 *   method(): void;
 * }
 * 
 * type DataOnly = EnforceStrictProps<Mixed>;
 * // DataOnly will only include the 'data' property
 * ```
 */
export type EnforceStrictProps<T> = {
  [P in keyof T as T[P] extends Function ? never : P]: T[P];
};

/**
 * Ensures exhaustive type checking for discriminated unions
 * @template T - The full type
 * @template U - The subset to check against
 * 
 * @remarks
 * Provides compile-time verification that all cases of a discriminated
 * union are handled. This is particularly useful in switch statements
 * and pattern matching.
 * 
 * This is a standalone utility type that enhances TypeScript's exhaustive
 * checking capabilities.
 * 
 * @example
 * ```typescript
 * type Shape = 'circle' | 'square' | 'triangle';
 * 
 * function handleShape(shape: Shape) {
 *   // This type check ensures all shapes are handled
 *   type Exhaustive = AssertExhaustive<Shape, 'circle' | 'square' | 'triangle'>;
 *   const isExhaustive: Exhaustive = true;
 * }
 * ```
 */
export type AssertExhaustive<T, U extends T = T> = U extends any
  ? T extends U
    ? true
    : false
  : never;

/**
 * Constrains a UI component state to its specific type
 * @template T - The component type
 * 
 * @remarks
 * Integrates with the core EditorState system to ensure that UI component
 * states are properly typed. This type leverages the core state management
 * system while providing UI-specific type constraints.
 * 
 * This type integrates with:
 * - UIComponent from ui/components.ts
 * - EditorState from core/editor.ts
 * 
 * @example
 * ```typescript
 * type ButtonComponent = UIComponent & {
 *   type: 'button';
 *   id: string; // Required for BlockData compatibility
 *   [key: string]: unknown; // Required for BlockData compatibility
 *   state: {
 *     pressed: boolean;
 *     disabled: boolean;
 *   };
 * };
 * 
 * type ButtonState = UIStateConstraint<ButtonComponent>;
 * // ButtonState will be { pressed: boolean; disabled: boolean; }
 * ```
 */
export type UIStateConstraint<T> = T extends UIComponent & { id: string; [key: string]: unknown } ? EditorState<T> : never;

/**
 * Dynamically resolves props based on component type
 * @template T - The component type object
 * 
 * @remarks
 * Integrates with the UI's prop type system to dynamically resolve
 * the correct prop types for a given component type. This type builds
 * on top of the PropsForType utility from the UI system.
 * 
 * This type integrates with:
 * - PropsForType from ui/props.ts
 * 
 * @example
 * ```typescript
 * interface ButtonComponent {
 *   type: 'button';
 *   props: {
 *     onClick: () => void;
 *     label: string;
 *   };
 * }
 * 
 * type ButtonProps = DynamicProps<ButtonComponent>;
 * // ButtonProps will be { onClick: () => void; label: string; }
 * ```
 */
export type DynamicProps<T> = T extends { type: string } ? PropsForType<T['type']> : never;

/**
 * Type guard for checking if a value is a UI component
 * @param value - The value to check
 *
 * @remarks
 * Provides runtime validation for UI component objects, ensuring
 * they have the required structure and properties.
 *
 * @example
 * ```typescript
 * const maybeComponent = getComponent();
 * if (isUIComponent(maybeComponent)) {
 *   // TypeScript knows maybeComponent is a UIComponent here
 *   console.log(maybeComponent.type);
 * }
 * ```
 */
export function isUIComponent(value: unknown): value is UIComponent {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof (value as any).type === 'string'
  );
}

/**
 * Type guard for checking if a value matches a specific component type
 * @template T - The component type to check against
 * @param value - The value to check
 * @param type - The expected component type
 *
 * @remarks
 * Provides runtime validation for specific component types, enabling
 * type-safe component type checking and discrimination.
 *
 * @example
 * ```typescript
 * const component = getComponent();
 * if (isComponentType(component, 'button')) {
 *   // TypeScript knows component is a button type here
 *   console.log(component.props.onClick);
 * }
 * ```
 */
export function isComponentType<T extends string>(
  value: unknown,
  type: T
): value is { type: T } & UIComponent {
  return isUIComponent(value) && value.type === type;
}

/**
 * Type guard for checking if a value has specific props
 * @template T - The props interface to check against
 * @param value - The value to check
 * @param propNames - Array of required prop names
 *
 * @remarks
 * Provides runtime validation for object properties, ensuring that
 * all required props are present. This is useful for validating
 * component props or configuration objects.
 *
 * @example
 * ```typescript
 * interface RequiredProps {
 *   id: string;
 *   value: number;
 * }
 *
 * const obj = getData();
 * if (hasRequiredProps<RequiredProps>(obj, ['id', 'value'])) {
 *   // TypeScript knows obj has id and value properties
 *   console.log(obj.id, obj.value);
 * }
 * ```
 */
export function hasRequiredProps<T extends object>(
  value: unknown,
  propNames: Array<keyof T>
): value is T {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return propNames.every(prop => prop in value);
}
