# Toolbar System

This document outlines the type system for Modulator's toolbar components, providing a comprehensive guide to toolbar items, layouts, and event handling.

## Core Toolbar Types

### `ToolbarItem`

Base interface for toolbar items:

```typescript
interface ToolbarItem {
  id: string;
  type: 'button' | 'select' | 'input' | 'separator' | 'custom';
  label?: string;
  icon?: string;
  tooltip?: string;
  disabled?: boolean;
  hidden?: boolean;
  order?: number;
  group?: string;
}
```

### `ToolbarGroup`

Interface for grouping toolbar items:

```typescript
interface ToolbarGroup {
  id: string;
  label?: string;
  items: ToolbarItem[];
  collapsible?: boolean;
  collapsed?: boolean;
  order?: number;
}
```

## Item Types

### `ToolbarButton`

Interface for toolbar button items:

```typescript
interface ToolbarButton extends ToolbarItem {
  type: 'button';
  onClick: ToolbarEventHandler;
  active?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}
```

### `ToolbarSelect`

Interface for toolbar select items:

```typescript
interface ToolbarSelect<T = any> extends ToolbarItem {
  type: 'select';
  options: Array<{
    value: T;
    label: string;
    icon?: string;
  }>;
  value?: T;
  onChange: (value: T) => void;
}
```

### `ToolbarInput`

Interface for toolbar input items:

```typescript
interface ToolbarInput extends ToolbarItem {
  type: 'input';
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
}
```

## Layout Types

### `ToolbarLayout`

Interface for toolbar layout configuration:

```typescript
interface ToolbarLayout {
  position: 'top' | 'bottom' | 'left' | 'right';
  alignment?: 'start' | 'center' | 'end';
  orientation: 'horizontal' | 'vertical';
  floating?: boolean;
  collapsible?: boolean;
  groups: ToolbarGroup[];
}
```

## Event Handling

### `ToolbarEventHandler`

Type for toolbar event handlers:

```typescript
type ToolbarEventHandler<T = any> = (
  event: ToolbarEvent<T>,
  context: ToolbarContext
) => void | Promise<void>;
```

### `ToolbarEvent`

Interface for toolbar events:

```typescript
interface ToolbarEvent<T = any> {
  type: string;
  item: ToolbarItem;
  data?: T;
  preventDefault(): void;
  stopPropagation(): void;
}
```

## State Management

### `ToolbarState`

Interface for toolbar state:

```typescript
interface ToolbarState {
  activeItems: string[];
  disabledItems: string[];
  hiddenItems: string[];
  collapsedGroups: string[];
  values: Record<string, any>;
}
```

## Best Practices

1. **Organization**
   - Group related items together
   - Use consistent naming for item IDs
   - Order items logically within groups

2. **Accessibility**
   - Provide meaningful labels and tooltips
   - Ensure keyboard navigation
   - Support screen readers

3. **Responsiveness**
   - Handle toolbar overflow gracefully
   - Implement collapsible groups
   - Consider mobile viewports

4. **Performance**
   - Lazy load toolbar items when possible
   - Optimize event handlers
   - Cache toolbar state

## Examples

### Basic Toolbar

```typescript
const toolbar: ToolbarLayout = {
  position: 'top',
  orientation: 'horizontal',
  groups: [
    {
      id: 'formatting',
      label: 'Text Formatting',
      items: [
        {
          id: 'bold',
          type: 'button',
          icon: 'bold',
          tooltip: 'Bold',
          onClick: () => {}
        },
        {
          id: 'fontSize',
          type: 'select',
          options: [
            { value: 12, label: '12px' },
            { value: 14, label: '14px' }
          ],
          onChange: (value) => {}
        }
      ]
    }
  ]
};
```

### Dynamic Toolbar

```typescript
const dynamicToolbar: ToolbarLayout = {
  position: 'top',
  floating: true,
  groups: [
    {
      id: 'contextual',
      collapsible: true,
      items: items.map(item => ({
        id: item.id,
        type: 'button',
        label: item.label,
        onClick: () => handleItemClick(item)
      }))
    }
  ]
};
```

## Related Documentation

- [Component Types](./components.md)
- [Style System](./styles.md)
- [Theme System](./theme.md)
- [Accessibility](./accessibility.md)
