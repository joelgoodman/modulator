/**
 * Generate a unique ID
 */
export function generateId(prefix: string = ''): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Generate a block ID
 */
export function generateBlockId(): string {
  return generateId('block-');
}

/**
 * Generate a plugin ID
 */
export function generatePluginId(): string {
  return generateId('plugin-');
}

/**
 * Validate an ID
 */
export function validateId(id: string): boolean {
  return typeof id === 'string' && id.length > 0;
}

/**
 * Extract prefix from ID
 */
export function extractIdPrefix(id: string): string {
  const match = id.match(/^([a-zA-Z-]+)-/);
  return match ? match[1] : '';
}
