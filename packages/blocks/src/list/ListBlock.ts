import type { BlockType, BlockData } from '@modulator/core';

export type ListType = 'bullet' | 'number';

export interface ListItemData {
  content: string;
  checked?: boolean;
}

export interface ListBlockData extends BlockData {
  items: ListItemData[];
  type: ListType;
}

export const ListBlock: BlockType<ListBlockData> = {
  type: 'list',
  name: 'List Block',

  create: (data?: Partial<ListBlockData>): ListBlockData => ({
    items: data?.items ?? [{ content: '' }],
    type: data?.type ?? 'bullet',
  }),

  validate: (data: ListBlockData): boolean => {
    return (
      Array.isArray(data.items) &&
      data.items.every(
        item =>
          typeof item.content === 'string' &&
          (item.checked === undefined || typeof item.checked === 'boolean')
      ) &&
      (data.type === 'bullet' || data.type === 'number')
    );
  },

  transform: (data: ListBlockData): ListBlockData => ({
    items: data.items.map(item => ({
      content: item.content.trim(),
      ...(item.checked !== undefined ? { checked: item.checked } : {}),
    })),
    type: data.type,
  }),
};
