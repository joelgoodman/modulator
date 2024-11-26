# UI Package Implementation Plan

## Overview

This document outlines the implementation plan for building the @modulator/ui package using a type-first approach, focusing on a modular Toolbar system that adapts to different Block Types.

## Phase 1: Block Type Configuration System

### 1. Block Toolbar Configuration

- **Component**: `BlockToolbarManager`
- **Types**: `BlockToolbarConfig`, `ToolbarItem`, `ToolbarGroup`
- **Path**: `@modulator/ui/src/toolbar/config`

#### Requirements

- [ ] Configuration System:
  - [ ] Implement `BlockToolbarInterface`
  - [ ] Support registration of block-specific toolbars
  - [ ] Handle toolbar visibility conditions
  - [ ] Manage toolbar positioning

#### Testing

- [ ] Configuration validation
- [ ] Block type registration
- [ ] Visibility rules
- [ ] Position management

## Phase 2: Toolbar Component System

### 1. Core Toolbar Implementation

- **Component**: `ModularToolbar`
- **Types**: `ToolbarContext`, `ToolbarState`, `ToolbarEvent`
- **Path**: `@modulator/ui/src/toolbar/components`

#### Requirements

- [ ] Core Functionality:
  - [ ] Implement event system using `ToolbarEventType`
  - [ ] Manage toolbar state via `ToolbarState`
  - [ ] Handle toolbar context via `ToolbarContext`
  - [ ] Support toolbar positioning via `ToolbarPosition`

#### Testing

- [ ] Event handling
- [ ] State management
- [ ] Context updates
- [ ] Position updates

### 2. Toolbar Item Components

- **Components**: Various toolbar item implementations
- **Types**: `ToolbarItem`, `ToolbarGroup`, `ToolbarGroupState`
- **Path**: `@modulator/ui/src/toolbar/items`

#### Requirements

- [ ] Standard Items:
  - [ ] Text formatting items
  - [ ] Link management
  - [ ] List controls
  - [ ] Alignment tools
- [ ] Group Management:
  - [ ] Group state handling
  - [ ] Collapse/expand behavior
  - [ ] Priority-based ordering

## Phase 3: Style System Implementation

### 1. Core Style Configuration

- **Component**: `StyleManager`
- **Types**: `StyleConfig`, `ComponentStyles`, `ColorConfig`, `FontConfig`
- **Path**: `@modulator/ui/src/styles`

#### Requirements

- [ ] Style Configuration System:
  - [ ] Implement style registration and management
  - [ ] Support theme inheritance via `extends` property
  - [ ] Handle style overrides and customization
  - [ ] Manage dynamic style updates

#### Testing

- [ ] Style registration
- [ ] Theme inheritance
- [ ] Style overrides
- [ ] Dynamic updates

### 2. Icon System

- **Component**: `IconRegistry`
- **Types**: `IconName`, `IconConfig`
- **Path**: `@modulator/ui/src/styles/icons`

#### Requirements

- [ ] Icon Management:
  - [ ] Register built-in and custom icons
  - [ ] Support SVG and font icons
  - [ ] Handle icon sizing and coloring
  - [ ] Implement icon customization

#### Testing

- [ ] Icon registration
- [ ] Custom icon support
- [ ] Icon rendering
- [ ] Style application

### 3. Theme Integration

- **Component**: `ThemeProvider`
- **Types**: `UserStyleConfig`, `ThemeOverrides`
- **Path**: `@modulator/ui/src/styles/theme`

#### Requirements

- [ ] Theme Management:
  - [ ] Implement theme switching
  - [ ] Handle user style configurations
  - [ ] Support CSS variable generation
  - [ ] Manage responsive styles

#### Testing

- [ ] Theme switching
- [ ] Style override application
- [ ] CSS variable generation
- [ ] Responsive behavior

## Phase 4: Theme Integration

### 1. Theme Implementation

- **Component**: `ThemeProvider`
- **Types**: `ThemeConfig`, `ThemeOverrides`, `ThemeRegistry`
- **Path**: `@modulator/ui/src/theme`

#### Requirements

- [ ] Theme Management:
  - [ ] Implement `ThemeRegistry` interface
  - [ ] Support built-in themes (`BuiltInTheme`)
  - [ ] Handle theme overrides via `ThemeOverrides`
  - [ ] Support theme inheritance

#### Testing

- [ ] Theme registration
- [ ] Override application
- [ ] Inheritance chain
- [ ] Variable resolution

### 2. Block-Specific Theming

- **Component**: `BlockThemeManager`
- **Types**: `BlockToolbarConfig`, `ThemeConfig`
- **Path**: `@modulator/ui/src/theme/blocks`

#### Requirements

- [ ] Integration Features:
  - [ ] Block-specific theme application
  - [ ] Theme inheritance from global theme
  - [ ] Dynamic theme switching
  - [ ] CSS variable generation

### CSS Variable Structure

```css
/* Using existing ThemeOverrides interface */
.modulator-toolbar {
  ${({theme}: {theme: ThemeConfig}) => Object.entries(theme.variables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n')}
}
```

## Implementation Guidelines

### Block Type Configuration Pattern

```typescript
// Using existing BlockToolbarConfig interface
const textBlockToolbar: BlockToolbarConfig = {
  blockType: 'text',
  groups: [
    {
      id: 'formatting',
      label: 'Text Formatting',
      priority: 1,
    },
  ],
  items: [
    {
      id: 'bold',
      type: 'button',
      label: 'Bold',
      icon: 'format_bold',
      command: 'toggleBold',
    },
  ],
  theme: 'default',
  position: {
    type: 'floating',
    anchor: 'top',
  },
};
```

### Theme Configuration Pattern

```typescript
// Using existing ThemeConfig interface
const customTheme: ThemeConfig = {
  id: 'custom-dark',
  name: 'Custom Dark Theme',
  variables: {
    '--toolbar-bg': '#1a1a1a',
    '--toolbar-text': '#ffffff',
    '--toolbar-border': '#333333',
  },
  extends: 'dark',
};
```

## Implementation Details

### Style System Architecture

The style system will be implemented using a layered approach:

1. **Base Layer**: Core style definitions and theme inheritance

   ```typescript
   interface StyleConfig {
     id: string;
     name: string;
     styles: ComponentStyles;
     extends?: string;
   }
   ```

2. **Component Layer**: Component-specific style configurations

   ```typescript
   interface ComponentStyles {
     typography: Record<string, FontConfig>;
     icons: {
       size: Record<string, string>;
       color: Record<string, string>;
     };
     colors: ColorConfig;
   }
   ```

3. **User Layer**: User-configurable style options
   ```typescript
   interface UserStyleConfig {
     theme: string | StyleConfig;
     overrides?: Partial<ComponentStyles>;
     customIcons?: Record<IconName, string>;
   }
   ```

### Integration with Existing Systems

The style system will integrate with:

1. **Block Type System**:

   - Block-specific style configurations
   - Custom toolbar styling per block type
   - Dynamic style updates based on block state

2. **Toolbar System**:

   - Themed toolbar components
   - Icon integration in toolbar items
   - Responsive toolbar styling

3. **Theme System**:
   - Extension of existing theme capabilities
   - Support for CSS variable generation
   - Dynamic theme switching

## Success Criteria

1. Type Compliance:

   - Strict adherence to @modulator/types definitions
   - No type assertions or overrides
   - Complete interface implementations

2. Modularity:

   - Block-specific toolbar configurations
   - Theme customization per block type
   - Extensible item system

3. Performance:

   - Efficient toolbar updates
   - Optimized theme switching
   - Minimal re-renders

4. Integration:
   - Seamless block type integration
   - Consistent theming
   - Reliable state management
