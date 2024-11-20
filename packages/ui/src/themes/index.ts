import type { Theme, ThemeConfig, ThemeRegistry } from '@modulator/types';

const defaultTheme: Theme = 'light';

// Built-in themes
const builtInThemes: Record<string, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Light Theme',
    variables: {
      '--background-color': '#ffffff',
      '--text-color': '#000000',
      '--primary-color': '#0066cc',
      '--secondary-color': '#666666',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark Theme',
    variables: {
      '--background-color': '#1a1a1a',
      '--text-color': '#ffffff',
      '--primary-color': '#66b3ff',
      '--secondary-color': '#999999',
    },
  },
};

// Theme registry implementation
class ThemeRegistryImpl implements ThemeRegistry {
  private themes: Map<string, ThemeConfig> = new Map(Object.entries(builtInThemes));

  register(theme: ThemeConfig): void {
    if (this.themes.has(theme.id)) {
      console.warn(`Theme '${theme.id}' already exists. Overwriting...`);
    }
    this.themes.set(theme.id, theme);
  }

  getTheme(id: string): ThemeConfig | undefined {
    return this.themes.get(id);
  }

  getThemes(): ThemeConfig[] {
    return Array.from(this.themes.values());
  }

  hasTheme(id: string): boolean {
    return this.themes.has(id);
  }
}

export const registry = new ThemeRegistryImpl();

export function getTheme(): Theme {
  return (document.documentElement.getAttribute('data-theme') as Theme) || defaultTheme;
}

export function setTheme(theme: Theme): void {
  if (!registry.hasTheme(theme)) {
    console.warn(`Theme '${theme}' not found. Using default theme.`);
    theme = defaultTheme;
  }

  // Apply theme variables
  const themeConfig = registry.getTheme(theme);
  if (themeConfig) {
    Object.entries(themeConfig.variables).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    // If theme extends another theme, apply parent theme first
    if (themeConfig.extends) {
      const parentTheme = registry.getTheme(themeConfig.extends);
      if (parentTheme) {
        Object.entries(parentTheme.variables).forEach(([key, value]) => {
          // Only set if not overridden by child theme
          if (!(key in themeConfig.variables)) {
            document.documentElement.style.setProperty(key, value);
          }
        });
      }
    }
  }

  document.documentElement.setAttribute('data-theme', theme);
}

export function toggleTheme(): void {
  const currentTheme = getTheme();
  setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

// Register built-in themes
Object.values(builtInThemes).forEach(theme => registry.register(theme));
