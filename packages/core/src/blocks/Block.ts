import { BlockConfig, BlockData, BlockEvent } from '@modulator/types';
import { EventEmitter } from '../events/EventEmitter.js';

/**
 * Block instance
 */
export class Block<T extends BlockData = BlockData> {
  private eventEmitter: EventEmitter;
  private _data: T;

  readonly id: string;
  readonly type: string;

  constructor(config: BlockConfig<T>) {
    this.id = config.id;
    this.type = config.type;
    this._data = config.data;
    this.eventEmitter = new EventEmitter();
  }

  /**
   * Get block data
   */
  get data(): T {
    return { ...this._data };
  }

  /**
   * Update block data
   */
  update(data: Partial<T>): void {
    const previousData = { ...this._data };
    this._data = { ...this._data, ...data };

    this.emitEvent('block:updated', {
      previousData,
      currentData: this.data,
    });
  }

  /**
   * Subscribe to block events
   */
  on(event: string, handler: (event: BlockEvent) => void): void {
    this.eventEmitter.on(event, handler);
  }

  /**
   * Unsubscribe from block events
   */
  off(event: string, handler: (event: BlockEvent) => void): void {
    this.eventEmitter.off(event, handler);
  }

  /**
   * Clone block
   */
  clone(newId: string): Block<T> {
    return new Block<T>({
      id: newId,
      type: this.type,
      data: { ...this._data },
    });
  }

  /**
   * Convert block to JSON
   */
  toJSON(): BlockConfig<T> {
    return {
      id: this.id,
      type: this.type,
      data: this.data,
    };
  }

  /**
   * Create block from JSON
   */
  static fromJSON<T extends BlockData>(json: BlockConfig<T>): Block<T> {
    return new Block<T>(json);
  }

  private emitEvent(type: string, data: Record<string, unknown> = {}): void {
    this.eventEmitter.emit({
      type,
      blockId: this.id,
      data,
    });
  }
}
