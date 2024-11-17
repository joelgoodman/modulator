/**
 * Selection range interface
 */
export interface SelectionRange {
  /**
   * Start offset
   */
  start: number;

  /**
   * End offset
   */
  end: number;

  /**
   * Whether selection is collapsed
   */
  collapsed: boolean;
}

/**
 * Selection interface
 */
export interface Selection {
  /**
   * Selected block ID
   */
  blockId: string;

  /**
   * Selection range
   */
  range: SelectionRange;

  /**
   * Whether block is focused
   */
  focused: boolean;

  /**
   * Selection direction
   */
  direction: 'forward' | 'backward' | 'none';

  /**
   * Selected content
   */
  content?: string;

  /**
   * Selection format marks
   */
  marks?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    strike?: boolean;
    code?: boolean;
    link?: boolean;
  };
}
