# Component Types

This document outlines the type system for Modulator's UI components, providing a comprehensive guide to component interfaces, props, and state management.

## Core Component Types

### `ComponentProps<T>`

Base interface for all component props:

```typescript
interface ComponentProps<T = any> {
  id?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  data?: T;
  disabled?: boolean;
  testId?: string;
}
```

### `ComponentRef`

Interface for component references:

```typescript
interface ComponentRef<T = HTMLElement> {
  current: T | null;
  focus(): void;
  blur(): void;
  scrollIntoView(options?: ScrollIntoViewOptions): void;
}
```

## State Management

### `ComponentState`

Base interface for component state:

```typescript
interface ComponentState<T = any> {
  isActive: boolean;
  isDisabled: boolean;
  isFocused: boolean;
  isHovered: boolean;
  data: T;
}
```

### `StateUpdater<T>`

Type for state update functions:

```typescript
type StateUpdater<T> = (state: T) => T | Partial<T>;
```

## Event Handling

### `ComponentEventHandler`

Type for component event handlers:

```typescript
type ComponentEventHandler<T = any> = (
  event: ComponentEvent<T>,
  context: ComponentContext
) => void | Promise<void>;
```

### `ComponentEvent`

Interface for component events:

```typescript
interface ComponentEvent<T = any> {
  type: string;
  target: HTMLElement;
  data?: T;
  preventDefault(): void;
  stopPropagation(): void;
}
```

## Lifecycle Management

### `ComponentLifecycle`

Interface for component lifecycle hooks:

```typescript
interface ComponentLifecycle {
  onMount?: () => void | Promise<void>;
  onUnmount?: () => void | Promise<void>;
  onUpdate?: (prevProps: any) => void | Promise<void>;
  onError?: (error: Error) => void;
}
```

## Best Practices

1. **Type Safety**
   - Always provide explicit types for props and state
   - Use generics for reusable components
   - Avoid `any` types unless absolutely necessary

2. **Props Design**
   - Keep props interface focused and minimal
   - Use optional props with sensible defaults
   - Document all props with JSDoc comments

3. **State Management**
   - Use immutable state updates
   - Avoid redundant state
   - Consider using reducers for complex state

4. **Event Handling**
   - Type event handlers properly
   - Use event delegation when appropriate
   - Handle async events safely

5. **Performance**
   - Memoize callbacks and computed values
   - Use refs for DOM operations
   - Implement proper cleanup in lifecycle hooks

## Examples

### Basic Component

```typescript
interface ButtonProps extends ComponentProps {
  variant?: 'primary' | 'secondary';
  onClick?: ComponentEventHandler;
}

interface ButtonState extends ComponentState {
  clickCount: number;
}

// Usage
const button: ButtonProps = {
  variant: 'primary',
  onClick: async (event, context) => {
    // Handle click
  }
};
```

### Generic Component

```typescript
interface DataListProps<T> extends ComponentProps<T[]> {
  renderItem: (item: T) => ReactNode;
  onItemSelect?: (item: T) => void;
}

// Usage
const list: DataListProps<User> = {
  data: users,
  renderItem: (user) => <UserCard user={user} />,
  onItemSelect: (user) => console.log(user)
};
```

## Related Documentation

- [Style System](./styles.md)
- [Theme System](./theme.md)
- [Accessibility](./accessibility.md)
- [Animation System](./animation.md)
