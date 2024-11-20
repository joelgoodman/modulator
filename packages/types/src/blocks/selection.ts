/**
 * Block selection interface
 */
export interface BlockSelection {
  /**
   * Selected block ID
   */
  blockId: string;

  /**
   * Selection range
   */
  range?: Range;

  /**
   * Whether the block is focused
   */
  focused: boolean;
}
