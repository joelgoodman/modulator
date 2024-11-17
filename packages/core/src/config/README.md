# Modulator Configuration System

## Overview

The Modulator Configuration System provides a flexible and powerful way to customize your block editor's behavior, theming, and functionality.

## Supported Configuration Formats

Modulator supports configuration in two formats:

- JSON (`modulator.config.json`)
- YAML (`modulator.config.yaml`)

## Configuration Options

### Theme Configuration

```json
{
  "theme": {
    "default": "light", // 'light' or 'dark'
    "persist": true // Whether to remember theme between sessions
  }
}
```

### Sanitization Settings

```json
{
  "sanitization": {
    "allowedTags": ["b", "i", "u", "a"], // HTML tags allowed in content
    "stripScripts": true // Remove script tags
  }
}
```

### Block Types

```json
{
  "blockTypes": {
    "custom": ["text", "heading", "list"] // Custom block types to register
  }
}
```

### Plugins

```json
{
  "plugins": {
    "enabled": ["analytics", "spelling"],
    "configs": {
      "analytics": {
        "trackingId": "UA-XXXXX-Y"
      }
    }
  }
}
```

### Performance

```json
{
  "performance": {
    "lazyLoading": true,
    "renderBudget": 16 // Milliseconds per frame
  }
}
```

## Configuration Resolution

Modulator looks for configuration files in the following order:

1. Explicitly provided path
2. `modulator.config.json` in project root
3. `modulator.config.yaml` in project root
4. Default configuration

## Example Configurations

See example configurations in the `/examples/configs` directory:

- `modulator.config.example.json`
- `modulator.config.example.yaml`

## Usage

```typescript
import { ConfigLoader } from '@modulator/core/config';
import { ModulatorEditor } from '@modulator/core/editor';

// Automatically loads configuration
const editor = new ModulatorEditor({
  container: document.getElementById('editor'),
});

// Or load a specific configuration
const customConfig = ConfigLoader.load('/path/to/custom/config.json');
```

## Best Practices

- Keep sensitive information out of configuration files
- Use version control to track configuration changes
- Test different configurations to optimize your editor

## Troubleshooting

- If no configuration is found, default settings will be used
- Configuration errors will be logged to the console
- Partial configurations will be merged with defaults

## Contributing

Found a bug or want to add a feature? Please open an issue or submit a pull request.
