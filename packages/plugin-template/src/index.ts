import {
  Plugin,
  PluginContext,
  ToolbarPlugin,
  ToolbarPluginContext,
  ToolbarItem,
  ToolbarGroup,
  PluginStateData,
  ExtendedPluginContext,
} from '@modulator/types';

/**
 * Example plugin state
 */
interface ExamplePluginState extends PluginStateData {
  counter: number;
  lastClicked: string | null;
  preferences: {
    showIcon: boolean;
    position: 'left' | 'right';
  };
}

/**
 * Example plugin implementation
 */
export class ExamplePlugin implements ToolbarPlugin<ExamplePluginState> {
  id = 'example-plugin';
  name = 'Example Plugin';
  version = '1.0.0';

  // Initial plugin state
  initialState: ExamplePluginState = {
    counter: 0,
    lastClicked: null,
    preferences: {
      showIcon: true,
      position: 'left',
    },
  };

  // Optional: specify which block types this plugin supports
  supportedBlocks = ['text', 'heading'];

  // Optional: toolbar groups provided by this plugin
  groups: ToolbarGroup<ExamplePluginState>[] = [
    {
      id: 'example',
      label: 'Example Group',
      priority: 100,
      items: [],
    },
  ];

  // Optional: toolbar items provided by this plugin
  items: ToolbarItem<ExamplePluginState>[] = [
    {
      id: 'example-item',
      icon: '★', // Replace with actual icon
      label: 'Example Item',
      group: 'example',
      shortcut: '⌘E',
      isActive: context => {
        const state = context.pluginState.getState();
        return state.counter > 0;
      },
      onClick: context => {
        const state = context.pluginState.getState();
        try {
          context.pluginState.setState({
            counter: state.counter + 1,
            lastClicked: new Date().toISOString(),
          });
        } catch (error) {
          console.error('Error updating plugin state:', error);
        }
      },
    },
  ];

  initialize(context: ExtendedPluginContext<ExamplePluginState>): void {
    // Plugin initialization logic
    console.log('Example plugin initialized');

    // Subscribe to state changes
    context.pluginState.subscribe(state => {
      console.log('Plugin state updated:', state);
    });

    // Load preferences from storage
    try {
      context.pluginState.restore();
    } catch (error) {
      console.error('Error loading plugin state:', error);
    }
  }

  initializeToolbar(context: ToolbarPluginContext<ExamplePluginState>): void {
    // Register toolbar items
    this.items.forEach(item => {
      context.registerItem(item);
    });

    // Register toolbar groups
    this.groups.forEach(group => {
      context.registerGroup(group);
    });

    // Update item visibility based on preferences
    const state = context.getContext().pluginState.getState();
    if (!state.preferences.showIcon) {
      this.items.forEach(item => {
        context.hideItem(item.id);
      });
    }
  }

  destroy(context: ExtendedPluginContext<ExamplePluginState>): void {
    // Persist state before cleanup
    try {
      context.pluginState.persist();
    } catch (error) {
      console.error('Error persisting plugin state:', error);
    }
    console.log('Example plugin destroyed');
  }
}

// Re-export types that plugin authors might need
export type {
  Plugin,
  PluginContext,
  ToolbarPlugin,
  ToolbarPluginContext,
  ToolbarItem,
  ToolbarGroup,
};
