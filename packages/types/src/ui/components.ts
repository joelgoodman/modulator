/**
 * @fileoverview UI Component Types for Modulator
 * @module @modulator/types/ui/components
 * @description
 * Defines the core types for UI components in the Modulator system.
 */

/**
 * Base UI Component interface
 * @remarks
 * Defines the minimal structure that all UI components must implement.
 */
export interface UIComponent {
  /** Unique identifier for the component */
  id?: string;
  /** Component type identifier */
  type: string;
  /** Component children */
  children?: UIComponent[];
  /** Component props */
  props?: Record<string, unknown>;
}
