import { BlockSelection, ValidationResult, Validator } from '@modulator/types';

/**
 * Validates selection state
 */
export class SelectionValidator implements Validator<BlockSelection | null> {
  validate(value: unknown): ValidationResult<BlockSelection | null> {
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
        errors: ['Selection must be an object or null']
      };
    }

    const selection = value as BlockSelection;
    const errors: string[] = [];

    if (!selection.blockId || typeof selection.blockId !== 'string') {
      errors.push('Selection must have a valid block ID');
    }

    if (typeof selection.start !== 'number' || selection.start < 0) {
      errors.push('Selection must have a valid start position');
    }

    if (typeof selection.end !== 'number' || selection.end < selection.start) {
      errors.push('Selection must have a valid end position');
    }

    return {
      valid: errors.length === 0,
      value: selection,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}
