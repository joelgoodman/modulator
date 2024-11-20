/**
 * Base state manager interface
 * Generic state management interface that can be implemented by various components
 */
export interface StateManager<T = unknown> {
  /**
   * Get current state
   */
  getState(): T;

  /**
   * Update state with partial changes
   */
  setState(state: Partial<T>): void;
}
