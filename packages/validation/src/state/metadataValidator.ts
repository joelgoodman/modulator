import { ValidationResult, Validator } from '@modulator/types';

/**
 * Validates metadata
 */
export class MetadataValidator implements Validator<Record<string, unknown>> {
  validate(value: unknown): ValidationResult<Record<string, unknown>> {
    if (!value || typeof value !== 'object') {
      return {
        valid: false,
        value: {},
        errors: ['Metadata must be an object']
      };
    }

    const metadata = value as Record<string, unknown>;
    const errors: string[] = [];

    // Check that all keys are strings
    for (const key in metadata) {
      if (typeof key !== 'string') {
        errors.push(`Metadata key "${key}" must be a string`);
      }
    }

    return {
      valid: errors.length === 0,
      value: metadata,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}
