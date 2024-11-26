import { BlockData, ValidationResult, Validator } from '@modulator/types';

/**
 * Validates block data
 */
export class BlockValidator implements Validator<BlockData> {
  validate(data: BlockData): ValidationResult<BlockData> {
    if (!data || typeof data !== 'object') {
      return {
        valid: false,
        value: data,
        errors: ['Block must be an object']
      };
    }

    const errors: string[] = [];

    if (!data.id || typeof data.id !== 'string') {
      errors.push('Block must have a string id');
    }

    if (!data.type || typeof data.type !== 'string') {
      errors.push('Block must have a string type');
    }

    if (!data.data || typeof data.data !== 'object') {
      errors.push('Block must have an object data property');
    }

    if (data.metadata !== undefined && typeof data.metadata !== 'object') {
      errors.push('Block metadata must be an object if provided');
    }

    return {
      valid: errors.length === 0,
      value: data,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}
