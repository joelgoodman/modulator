import { DragState, ValidationResult, Validator } from '@modulator/types';

/**
 * Validates drag state
 */
export class DragStateValidator implements Validator<DragState | null> {
  validate(value: unknown): ValidationResult<DragState | null> {
    if (value === null) {
      return {
        valid: true,
        value: null,
        errors: undefined
      };
    }

    if (!value || typeof value !== 'object') {
      return {
        valid: false,
        value: null,
        errors: ['Drag state must be an object or null']
      };
    }

    const dragState = value as DragState;
    const errors: string[] = [];

    if (typeof dragState.isDragging !== 'boolean') {
      errors.push('isDragging must be a boolean');
    }

    if (dragState.draggedBlockId !== undefined && typeof dragState.draggedBlockId !== 'string') {
      errors.push('draggedBlockId must be a string if present');
    }

    if (dragState.dropTargetId !== undefined && typeof dragState.dropTargetId !== 'string') {
      errors.push('dropTargetId must be a string if present');
    }

    if (dragState.dropPosition !== undefined && 
        !['before', 'after'].includes(dragState.dropPosition)) {
      errors.push('dropPosition must be either "before" or "after" if present');
    }

    return {
      valid: errors.length === 0,
      value: dragState,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}
