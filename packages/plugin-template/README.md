# Modulator Plugin Template

This is a template for creating plugins for the Modulator editor. Use this as a starting point for developing your own plugins.

## Getting Started

1. Clone this template:

```bash
# Using degit
npx degit modulator/plugin-template my-plugin

# Or copy the directory
cp -r packages/plugin-template packages/my-plugin
```

2. Update package.json:

- Change the name to your plugin name (e.g., `@modulator/my-plugin`)
- Update the description and other metadata
- Add any additional dependencies

3. Implement your plugin:

- Modify src/index.ts to implement your plugin logic
- Add any additional files needed
- Update tests in tests/

## Plugin Structure

```
my-plugin/
├── src/
│   ├── index.ts         # Main plugin entry point
│   └── ...             # Additional source files
├── tests/
│   └── ...             # Test files
├── package.json        # Plugin metadata and dependencies
├── tsconfig.json       # TypeScript configuration
└── README.md          # Plugin documentation
```

## Plugin Interface

Your plugin must implement the ModulatorPlugin interface:

```typescript
interface ModulatorPlugin {
  id: string; // Unique plugin identifier
  name: string; // Display name
  version: string; // Semantic version
  initialize: (context: PluginContext) => void; // Setup logic
  destroy?: () => void; // Cleanup logic
}
```

For toolbar plugins, also implement ToolbarPlugin:

```typescript
interface ToolbarPlugin extends ModulatorPlugin {
  supportedBlocks?: string[]; // Block types this plugin supports
  groups?: ToolbarGroup[]; // Toolbar groups provided
  items?: ToolbarItem[]; // Toolbar items provided
  initializeToolbar?: (context: ToolbarPluginContext) => void;
}
```

## Example Usage

```typescript
import { ModulatorPlugin, PluginContext } from '@modulator/core';

export class MyPlugin implements ModulatorPlugin {
  id = 'my-plugin';
  name = 'My Plugin';
  version = '1.0.0';

  initialize(context: PluginContext): void {
    // Plugin initialization logic
  }

  destroy(): void {
    // Cleanup logic
  }
}
```

## Testing

```bash
# Run tests
pnpm test

# Run linting
pnpm lint

# Format code
pnpm format
```

## Publishing

1. Build your plugin:

```bash
pnpm build
```

2. Publish to npm:

```bash
pnpm publish
```

## License

MIT
