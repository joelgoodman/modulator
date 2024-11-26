# Theme System API

## Overview

The theme system provides comprehensive type definitions for managing UI themes, including color schemes, typography, spacing, animations, and transitions. It supports dynamic theme switching, responsive design, and accessibility features.

## Core Types

### ThemeConfig

The base configuration for a theme.

```typescript
interface ThemeConfig {
  /** Unique theme identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Theme color mode (light/dark/system) */
  mode: ThemeMode;
  /** Color palette configuration */
  palette: ThemePalette;
  /** Typography settings */
  typography: ThemeTypography;
  /** Spacing scale */
  spacing: ThemeSpacing;
  /** Theme-specific variables */
  variables?: ThemeVariables;
}
```

### ThemePalette

Color configuration for the theme.

```typescript
interface ThemePalette {
  /** Primary brand colors */
  primary: ColorConfig;
  /** Secondary brand colors */
  secondary: ColorConfig;
  /** Background colors */
  background: ColorConfig;
  /** Text colors */
  text: ColorConfig;
  /** Semantic colors (success, error, etc.) */
  semantic: SemanticColorConfig;
}
```

### ThemeTypography

Typography configuration for different text elements.

```typescript
interface ThemeTypography {
  /** Base font settings */
  base: FontConfig;
  /** Heading styles (h1-h6) */
  headings: Record<HeadingLevel, FontConfig>;
  /** Body text styles */
  body: FontConfig;
  /** Code block styles */
  code: FontConfig;
}
```

## Theme Transitions

### ThemeTransitionConfig

Configuration for smooth theme transitions.

```typescript
interface ThemeTransitionConfig {
  /** Transition timing */
  timing: ThemeTransitionTiming;
  /** Properties to animate */
  properties: string[];
  /** Transition direction */
  direction?: AnimationDirection;
  /** Fill mode */
  fillMode?: AnimationFillMode;
  /** Accessibility settings */
  accessibility?: AnimationAccessibilityConfig;
}
```

### ThemeTransitionGroup

Groups related elements for coordinated transitions.

```typescript
interface ThemeTransitionGroup {
  /** Group identifier */
  name: string;
  /** Elements in the group */
  elements: string[];
  /** Transition configuration */
  transition: ThemeTransitionConfig;
  /** Whether to coordinate transitions */
  coordinated: boolean;
  /** Transition order */
  order: 'sequential' | 'staggered' | 'parallel';
}
```

## Theme Management

### ThemeManagerConfig

Global configuration for theme management.

```typescript
interface ThemeManagerConfig {
  /** Default theme */
  defaultTheme: string;
  /** Available themes */
  themes: ThemeConfig[];
  /** Theme variants */
  variants?: ThemeVariant[];
  /** Default color mode */
  defaultMode: ThemeMode;
  /** Whether to persist theme selection */
  persistSelection: boolean;
  /** CSS-in-JS solution */
  cssInJs?: 'emotion' | 'styled-components' | 'none';
}
```

## Usage Examples

### Basic Theme Configuration

```typescript
const lightTheme: ThemeConfig = {
  id: 'light',
  name: 'Light Theme',
  mode: 'light',
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5'
    },
    text: {
      primary: '#000000',
      secondary: '#666666'
    }
  },
  typography: {
    base: {
      family: 'Inter, sans-serif',
      size: '16px',
      lineHeight: 1.5
    },
    headings: {
      h1: { size: '2.5rem', weight: 700 },
      h2: { size: '2rem', weight: 600 }
    }
  },
  spacing: {
    unit: 8,
    scale: [0, 4, 8, 16, 24, 32, 48]
  }
};
```

### Theme Transition Setup

```typescript
const transitionConfig: ThemeTransitionConfig = {
  timing: {
    duration: 300,
    easing: 'ease-in-out'
  },
  properties: ['background-color', 'color'],
  accessibility: {
    respectMotionPreferences: true,
    reducedMotionAlternative: {
      duration: 0
    }
  }
};

const headerGroup: ThemeTransitionGroup = {
  name: 'header',
  elements: ['nav', 'logo', 'menu'],
  transition: transitionConfig,
  coordinated: true,
  order: 'staggered'
};
```

### Theme Manager Setup

```typescript
const themeManager: ThemeManagerConfig = {
  defaultTheme: 'light',
  themes: [lightTheme, darkTheme],
  variants: [
    {
      name: 'high-contrast',
      parent: 'light',
      overrides: {
        palette: {
          text: {
            primary: '#000000',
            secondary: '#333333'
          }
        }
      }
    }
  ],
  defaultMode: 'system',
  persistSelection: true,
  cssInJs: 'emotion'
};
```

## Best Practices

1. **Theme Structure**
   - Keep color palettes consistent across themes
   - Use semantic color naming
   - Define a clear spacing scale
   - Maintain consistent typography hierarchy

2. **Transitions**
   - Group related elements for coordinated transitions
   - Respect user motion preferences
   - Keep transitions under 400ms for optimal UX
   - Use hardware-accelerated properties when possible

3. **Accessibility**
   - Ensure sufficient color contrast
   - Provide reduced motion alternatives
   - Support system color scheme preferences
   - Test with screen readers

4. **Performance**
   - Minimize theme-switching overhead
   - Use efficient CSS-in-JS solutions
   - Batch theme updates
   - Implement proper caching strategies
