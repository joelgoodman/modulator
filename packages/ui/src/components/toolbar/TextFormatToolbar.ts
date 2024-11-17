import {
  ToolbarPlugin,
  ToolbarContext,
  ToolbarItem,
  ToolbarGroup,
  EditorCommand,
} from '@modulator/types';
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikeIcon, CodeIcon } from '../icons/index.js';

/**
 * Text formatting toolbar plugin
 */
export class TextFormatToolbar implements ToolbarPlugin {
  readonly name = 'text-format';

  private context?: ToolbarContext;
  private formatGroup: ToolbarGroup = {
    id: 'format',
    label: 'Text Formatting',
    order: 0,
  };

  private items: ToolbarItem[] = [
    {
      id: 'bold',
      label: 'Bold',
      icon: BoldIcon,
      shortcut: 'Mod+B',
      command: 'bold' as EditorCommand,
      group: 'format',
      order: 0,
    },
    {
      id: 'italic',
      label: 'Italic',
      icon: ItalicIcon,
      shortcut: 'Mod+I',
      command: 'italic' as EditorCommand,
      group: 'format',
      order: 1,
    },
    {
      id: 'underline',
      label: 'Underline',
      icon: UnderlineIcon,
      shortcut: 'Mod+U',
      command: 'underline' as EditorCommand,
      group: 'format',
      order: 2,
    },
    {
      id: 'strike',
      label: 'Strikethrough',
      icon: StrikeIcon,
      shortcut: 'Mod+Shift+S',
      command: 'strike' as EditorCommand,
      group: 'format',
      order: 3,
    },
    {
      id: 'code',
      label: 'Code',
      icon: CodeIcon,
      shortcut: 'Mod+E',
      command: 'code' as EditorCommand,
      group: 'format',
      order: 4,
    },
    {
      id: 'link',
      label: 'Link',
      icon: '𝐋',
      shortcut: '',
      command: 'link' as EditorCommand,
      group: 'format',
      order: 5,
    },
  ];

  /**
   * Initialize the plugin
   */
  initialize(context: ToolbarContext): void {
    this.context = context;

    // Register group and items
    context.registerGroup(this.formatGroup);
    this.items.forEach(item => context.registerItem(item));

    // Listen for selection changes
    context.on('selection:change', this.handleSelectionChange.bind(this));
  }

  /**
   * Clean up the plugin
   */
  cleanup(): void {
    // Remove event listeners
    this.context?.off('selection:change', this.handleSelectionChange.bind(this));
  }

  private handleSelectionChange(event: any): void {
    if (!this.context) return;

    const { marks = {} } = event.data;

    // Update item states based on active marks
    this.items.forEach(item => {
      const isActive = marks[item.command];
      if (isActive) {
        this.context?.updateItem(item.id, { isActive: true });
      } else {
        this.context?.updateItem(item.id, { isActive: false });
      }
    });
  }
}
