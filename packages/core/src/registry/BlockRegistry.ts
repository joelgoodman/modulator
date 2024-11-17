import { BlockType, BlockData } from '@modulator/types';

/**
 * Registry for block types
 */
export class BlockRegistry<T extends BlockData = BlockData> {
  private types: Map<string, BlockType<T>>;

  constructor() {
    this.types = new Map();
  }

  /**
   * Register a block type
   */
  registerType<U extends T>(type: BlockType<U>): void {
    if (this.types.has(type.type)) {
      throw new Error(`Block type '${type.type}' is already registered`);
    }
    this.types.set(type.type, type as unknown as BlockType<T>);
  }

  /**
   * Get a block type
   */
  getType<U extends T>(type: string): BlockType<U> | undefined {
    return this.types.get(type) as BlockType<U>;
  }

  /**
   * Check if a block type exists
   */
  hasType(type: string): boolean {
    return this.types.has(type);
  }

  /**
   * Get all registered block types
   */
  getAllTypes(): BlockType<T>[] {
    return Array.from(this.types.values());
  }

  /**
   * Create block data for a type
   */
  createBlockData<U extends T>(type: string, data?: Partial<U>): U {
    const blockType = this.getType<U>(type);
    if (!blockType) {
      throw new Error(`Block type '${type}' not found`);
    }
    return blockType.create(data);
  }

  /**
   * Validate block data
   */
  validateBlockData<U extends T>(type: string, data: U): boolean {
    const blockType = this.getType<U>(type);
    if (!blockType?.validate) return true;
    return blockType.validate(data);
  }
}
