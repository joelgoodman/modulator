# @modulator/types

Type definitions for the Modulator editor framework.

## Installation

```bash
pnpm add @modulator/types
```

## Usage

Import types from their respective domains:

```typescript
// Core types
import type { EventEmitter, StateManager } from '@modulator/types/core';

// Block types
import type { BlockData, Block, BlockInteractionManager } from '@modulator/types/blocks';

// Plugin types
import type { Plugin, PluginContext } from '@modulator/types/plugins';

// UI types
import type { Theme, ModulatorConfig } from '@modulator/types/ui';

// Utility types
import type { PerformanceOptions } from '@modulator/types/utils';
```

## Type System Structure

The type system is organized into domains:

### Core Types (`@modulator/types/core`)

- Event system types
- State management types
- Registry types
- Editor types

### Block Types (`@modulator/types/blocks`)

- Base block types
- Block rendering types
- Block interaction types
- Block selection types

### Plugin Types (`@modulator/types/plugins`)

- Plugin system types
- Plugin messaging types
- Toolbar types

### UI Types (`@modulator/types/ui`)

- Accessibility types
- Configuration types
- Theme types

### Utility Types (`@modulator/types/utils`)

- Performance types
- Security types

## Development

```bash
# Build types
pnpm build

# Watch for changes
pnpm dev

# Type check
pnpm typecheck

# Run type tests
pnpm test:types
```

## Type Tests

Type tests are located in `__tests__` directories. Run them with:

```bash
pnpm test:types
```

## API Documentation

Comprehensive API documentation is available in the [docs/api](./docs/api) directory:

### UI System
- [Theme System](./docs/api/theme.md) - Theme configuration, color palettes, typography
- [Animation System](./docs/api/animation.md) - Animation configuration, keyframes, performance
- [Accessibility](./docs/api/accessibility.md) - WCAG compliance, screen readers, keyboard navigation
- [Style System](./docs/api/styles.md) - Component styles, icons, theme overrides
- [Components](./docs/api/components.md) - Base components, props, state management (Coming Soon)
- [Toolbar](./docs/api/toolbar.md) - Toolbar items, layouts, event handling (Coming Soon)

For a complete overview of all available types and documentation, see the [API Documentation Index](./docs/api/README.md).

## Contributing

When adding new types:

1. Place types in their appropriate domain directory
2. Export types through domain index.ts
3. Add type tests
4. Update documentation
5. Run type checks

## License

MIT
