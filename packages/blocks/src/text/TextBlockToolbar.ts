import { BlockToolbarManager, ToolbarContext } from '@modulator/ui';

// Icons (these could be imported from a separate icon library)
const ICONS = {
  bold: '𝐁',
  italic: '𝐈',
  underline: '𝐔',
  strikethrough: '𝐒',
  code: '&lt;/&gt;',
  link: '🔗',
};

export function registerTextBlockToolbar() {
  BlockToolbarManager.registerBlockToolbar({
    blockType: 'text',
    groups: [
      {
        id: 'formatting',
        label: 'Text Formatting',
        priority: 1,
        items: [],
      },
      {
        id: 'advanced',
        label: 'Advanced Formatting',
        priority: 2,
        items: [],
      },
    ],
    items: [
      // Basic Formatting
      {
        id: 'bold',
        icon: ICONS.bold,
        label: 'Bold',
        group: 'formatting',
        shortcut: 'Ctrl+B',
        isActive: (context: ToolbarContext) => context.format?.bold ?? false,
        onClick: (context: ToolbarContext) => {
          // Implement bold toggle logic
          console.log('Toggle Bold', context);
        },
      },
      {
        id: 'italic',
        icon: ICONS.italic,
        label: 'Italic',
        group: 'formatting',
        shortcut: 'Ctrl+I',
        isActive: (context: ToolbarContext) => context.format?.italic ?? false,
        onClick: (context: ToolbarContext) => {
          // Implement italic toggle logic
          console.log('Toggle Italic', context);
        },
      },
      {
        id: 'underline',
        icon: ICONS.underline,
        label: 'Underline',
        group: 'formatting',
        shortcut: 'Ctrl+U',
        isActive: (context: ToolbarContext) => context.format?.underline ?? false,
        onClick: (context: ToolbarContext) => {
          // Implement underline toggle logic
          console.log('Toggle Underline', context);
        },
      },
      // Advanced Formatting
      {
        id: 'strikethrough',
        icon: ICONS.strikethrough,
        label: 'Strikethrough',
        group: 'advanced',
        isActive: (context: ToolbarContext) => context.format?.strikethrough ?? false,
        onClick: (context: ToolbarContext) => {
          // Implement strikethrough toggle logic
          console.log('Toggle Strikethrough', context);
        },
      },
      {
        id: 'code',
        icon: ICONS.code,
        label: 'Code',
        group: 'advanced',
        isActive: (context: ToolbarContext) => context.format?.code ?? false,
        onClick: (context: ToolbarContext) => {
          // Implement code formatting logic
          console.log('Toggle Code', context);
        },
      },
      {
        id: 'link',
        icon: ICONS.link,
        label: 'Add Link',
        group: 'advanced',
        isDisabled: (context: ToolbarContext) =>
          !context.selection || context.selection.toString().trim() === '',
        onClick: (context: ToolbarContext) => {
          // Implement link insertion logic
          console.log('Insert Link', context);
        },
      },
    ],
    visibility: {
      shouldShow: (context: ToolbarContext) => {
        // Only show toolbar when text is selected
        return !!context.selection && context.selection.toString().trim() !== '';
      },
      minSelectionLength: 1,
    },
    transformContext: (baseContext: ToolbarContext) => {
      // Add any text-specific context transformations
      return {
        ...baseContext,
        format: {
          bold: false,
          italic: false,
          underline: false,
          strikethrough: false,
          code: false,
          // Determine active formats based on current selection
        },
      };
    },
  });
}

// Auto-register the toolbar when this module is imported
registerTextBlockToolbar();
