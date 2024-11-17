import type { BlockType, BlockData } from '@modulator/core';

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

export const TextBlock: BlockType<TextBlockData> & { operations: TextBlockOperations } = {
  type: 'text',
  name: 'Text Block',

  create: (data?: Partial<TextBlockData>): TextBlockData => ({
    nodes: data?.nodes ?? [{ text: '' }],
  }),

  validate: (data: TextBlockData): boolean => {
    return (
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
    nodes: data.nodes.map(node => ({
      text: node.text,
      ...(node.marks && node.marks.length > 0 ? { marks: node.marks } : {}),
    })),
  }),

  // Helper methods for text operations
  operations: {
    toggleMark(
      data: TextBlockData,
      markType: TextMarkType,
      attrs?: TextMark['attrs']
    ): TextBlockData {
      return {
        nodes: data.nodes.map(node => {
          const existingMark = node.marks?.find(m => m.type === markType);
          if (existingMark) {
            // Remove mark if it exists
            return {
              ...node,
              marks: node.marks?.filter(m => m.type !== markType),
            };
          } else {
            // Add mark if it doesn't exist
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
      // TODO: Implement HTML parsing
      return {
        nodes: [{ text: html }],
      };
    },
  },
};
