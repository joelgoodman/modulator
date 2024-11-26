/**
 * @fileoverview UI Props Types for Modulator
 * @module @modulator/types/ui/props
 * @description
 * Defines the prop types and type resolution for UI components.
 */

import type { UIComponent } from './components.js';

/**
 * Props type resolver
 * @template T - Component type string
 * @remarks
 * Resolves the appropriate props type for a given component type.
 * This type is meant to be extended by component-specific prop types.
 */
export type PropsForType<T extends string> = T extends keyof ComponentProps
  ? ComponentProps[T]
  : Record<string, unknown>;

/**
 * Component Props Registry
 * @remarks
 * Maps component types to their respective prop types.
 * Add new component prop types here.
 */
export interface ComponentProps {
  button: {
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'ghost';
  };
  input: {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
  };
  [key: string]: Record<string, unknown>;
}
