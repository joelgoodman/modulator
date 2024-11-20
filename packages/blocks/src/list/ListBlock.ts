import type { BlockType, BlockData } from '@modulator/types';
import crypto from 'crypto';

export type ListType = 'bullet' | 'number';

export interface ListItemData {
  content: string;
  checked?: boolean;
}

export interface ListBlockData extends BlockData {
  items: ListItemData[];
}

export const ListBlock: BlockType<ListBlockData> = {
  type: 'list',
  name: 'List Block',

  create: (data?: Partial<ListBlockData>): ListBlockData => ({
    id: crypto.randomUUID(),
    type: 'list',
    items: data?.items ?? [{ content: '' }],
  }),

  validate: (data: ListBlockData): boolean => {
    return (
      Array.isArray(data.items) &&
      data.items.every(
        item =>
          typeof item.content === 'string' &&
          (item.checked === undefined || typeof item.checked === 'boolean')
      )
    );
  },

  transform: (data: ListBlockData): ListBlockData => {
    return {
      ...data,
      items: data.items.map(item => ({
        content: String(item.content),
        checked: item.checked === true,
      })),
    };
  },
};
