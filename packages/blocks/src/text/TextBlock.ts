import type { BlockType, BlockData, ToolbarContext, ToolbarItem } from '@modulator/types';
import { BlockToolbar } from '@modulator/ui';
import crypto from 'crypto';

export type TextMarkType = 'bold' | 'italic' | 'link' | 'code' | 'underline' | 'strike';

export interface TextMark {
  type: TextMarkType;
  attrs?: {
    href?: string;
    title?: string;
  };
}

export interface TextNode {
  text: string;
  marks?: TextMark[];
}

export interface TextBlockData extends BlockData {
  nodes: TextNode[];
}

export interface TextBlockOperations {
  toggleMark(data: TextBlockData, markType: TextMarkType, attrs?: TextMark['attrs']): TextBlockData;
  addLink(data: TextBlockData, href: string, title?: string): TextBlockData;
  toHTML(data: TextBlockData): string;
  fromHTML(html: string): TextBlockData;
}

export const TextBlock: BlockType<TextBlockData> & {
  operations: TextBlockOperations;
  toolbarConfig: {
    blockType: string;
    groups: {
      [key: string]: {
        id: string;
        label: string;
        items: string[];
      };
    };
    defaultItems: {
      [key: string]: ToolbarItem<TextBlockData>;
    };
  };
} = {
  type: 'text',
  name: 'Text Block',

  create: (data?: Partial<TextBlockData>): TextBlockData => ({
    id: crypto.randomUUID(),
    type: 'text',
    nodes: data?.nodes ?? [{ text: '' }],
  }),

  validate: (data: TextBlockData): boolean => {
    return (
      typeof data.id === 'string' &&
      data.type === 'text' &&
      Array.isArray(data.nodes) &&
      data.nodes.every(
        node =>
          typeof node.text === 'string' &&
          (!node.marks || Array.isArray(node.marks)) &&
          (!node.marks ||
            node.marks.every(
              mark =>
                typeof mark.type === 'string' && (!mark.attrs || typeof mark.attrs === 'object')
            ))
      )
    );
  },

  transform: (data: TextBlockData): TextBlockData => ({
    ...data,
    nodes: data.nodes.map(node => ({
      text: node.text,
      ...(node.marks && node.marks.length > 0 ? { marks: node.marks } : {}),
    })),
  }),

  operations: {
    toggleMark(
      data: TextBlockData,
      markType: TextMarkType,
      attrs?: TextMark['attrs']
    ): TextBlockData {
      return {
        id: data.id,
        type: data.type,
        nodes: data.nodes.map(node => {
          const existingMark = node.marks?.find(m => m.type === markType);
          if (existingMark) {
            return {
              ...node,
              marks: node.marks?.filter(m => m.type !== markType),
            };
          } else {
            return {
              ...node,
              marks: [...(node.marks || []), { type: markType, attrs }],
            };
          }
        }),
      };
    },

    addLink(data: TextBlockData, href: string, title?: string): TextBlockData {
      return this.toggleMark(data, 'link', { href, title });
    },

    toHTML(data: TextBlockData): string {
      return data.nodes
        .map(node => {
          let content = node.text;
          if (node.marks) {
            content = node.marks.reduce((acc, mark) => {
              switch (mark.type) {
                case 'bold':
                  return `<strong>${acc}</strong>`;
                case 'italic':
                  return `<em>${acc}</em>`;
                case 'underline':
                  return `<u>${acc}</u>`;
                case 'strike':
                  return `<s>${acc}</s>`;
                case 'code':
                  return `<code>${acc}</code>`;
                case 'link':
                  const href = mark.attrs?.href || '';
                  const title = mark.attrs?.title ? ` title="${mark.attrs.title}"` : '';
                  return `<a href="${href}"${title}>${acc}</a>`;
                default:
                  return acc;
              }
            }, content);
          }
          return content;
        })
        .join('');
    },

    fromHTML(html: string): TextBlockData {
      return {
        id: crypto.randomUUID(),
        type: 'text',
        nodes: [{ text: html }],
      };
    },
  },

  toolbarConfig: {
    blockType: 'text',
    groups: {
      formatting: {
        id: 'formatting',
        label: 'Text Formatting',
        items: ['bold', 'italic', 'link', 'code', 'underline', 'strike'],
      },
    },
    defaultItems: {
      bold: {
        id: 'bold',
        label: 'Bold',
        icon: '𝐁',
        group: 'formatting',
        shortcut: 'Ctrl+B',
        onClick: (context: ToolbarContext<TextBlockData>) => {
          const data = context.data as TextBlockData | undefined;
          if (!data?.nodes || !data.id || !data.type) return;
          const updatedData = TextBlock.operations.toggleMark(data, 'bold');
          context.pluginState.set('data', updatedData);
        },
        isActive: (context: ToolbarContext<TextBlockData>) => context.format?.bold ?? false,
      },
      italic: {
        id: 'italic',
        label: 'Italic',
        icon: '𝐈',
        group: 'formatting',
        shortcut: 'Ctrl+I',
        onClick: (context: ToolbarContext<TextBlockData>) => {
          const data = context.data as TextBlockData | undefined;
          if (!data?.nodes || !data.id || !data.type) return;
          const updatedData = TextBlock.operations.toggleMark(data, 'italic');
          context.pluginState.set('data', updatedData);
        },
        isActive: (context: ToolbarContext<TextBlockData>) => context.format?.italic ?? false,
      },
      underline: {
        id: 'underline',
        label: 'Underline',
        icon: '𝐔',
        group: 'formatting',
        shortcut: 'Ctrl+U',
        onClick: (context: ToolbarContext<TextBlockData>) => {
          const data = context.data as TextBlockData | undefined;
          if (!data?.nodes || !data.id || !data.type) return;
          const updatedData = TextBlock.operations.toggleMark(data, 'underline');
          context.pluginState.set('data', updatedData);
        },
        isActive: (context: ToolbarContext<TextBlockData>) => context.format?.underline ?? false,
      },
      strike: {
        id: 'strike',
        label: 'Strikethrough',
        icon: '𝐒',
        group: 'formatting',
        shortcut: 'Ctrl+Shift+S',
        onClick: (context: ToolbarContext<TextBlockData>) => {
          const data = context.data as TextBlockData | undefined;
          if (!data?.nodes || !data.id || !data.type) return;
          const updatedData = TextBlock.operations.toggleMark(data, 'strike');
          context.pluginState.set('data', updatedData);
        },
        isActive: (context: ToolbarContext<TextBlockData>) =>
          context.format?.strikethrough ?? false,
      },
      code: {
        id: 'code',
        label: 'Code',
        icon: '𝐂',
        group: 'formatting',
        shortcut: 'Ctrl+Shift+C',
        onClick: (context: ToolbarContext<TextBlockData>) => {
          const data = context.data as TextBlockData | undefined;
          if (!data?.nodes || !data.id || !data.type) return;
          const updatedData = TextBlock.operations.toggleMark(data, 'code');
          context.pluginState.set('data', updatedData);
        },
        isActive: (context: ToolbarContext<TextBlockData>) => context.format?.code ?? false,
      },
      link: {
        id: 'link',
        label: 'Link',
        icon: '𝐋',
        group: 'formatting',
        shortcut: 'Ctrl+Shift+L',
        onClick: (context: ToolbarContext<TextBlockData>) => {
          const data = context.data as TextBlockData | undefined;
          if (!data?.nodes || !data.id || !data.type) return;
          const updatedData = TextBlock.operations.addLink(data, 'https://example.com');
          context.pluginState.set('data', updatedData);
        },
        isActive: (context: ToolbarContext<TextBlockData>) => context.format?.link ?? false,
      },
    },
  },
};
