import type { BlockType, BlockData } from '@modulator/core';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingBlockData extends BlockData {
  content: string;
  level: HeadingLevel;
}

export const HeadingBlock: BlockType<HeadingBlockData> = {
  type: 'heading',
  name: 'Heading Block',

  create: (data?: Partial<HeadingBlockData>): HeadingBlockData => ({
    content: data?.content ?? '',
    level: data?.level ?? 1,
  }),

  validate: (data: HeadingBlockData): boolean => {
    return (
      typeof data.content === 'string' &&
      typeof data.level === 'number' &&
      data.level >= 1 &&
      data.level <= 6
    );
  },

  transform: (data: HeadingBlockData): HeadingBlockData => ({
    content: data.content.trim(),
    level: data.level,
  }),
};
