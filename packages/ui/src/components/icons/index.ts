// Format Icons
export interface IconSet {
  readonly name: string;
  readonly icons: Record<string, string>;
}

export class IconRegistry {
  private iconSets: Map<string, IconSet> = new Map();
  private activeSet: string = 'default';

  constructor() {
    // Register default icon set
    this.registerSet('default', defaultIconSet);
  }

  /**
   * Register a new icon set
   */
  public registerSet(name: string, set: IconSet): void {
    if (this.iconSets.has(name)) {
      throw new Error(`Icon set "${name}" is already registered`);
    }
    this.iconSets.set(name, set);
  }

  /**
   * Set the active icon set
   */
  public setActiveSet(name: string): void {
    if (!this.iconSets.has(name)) {
      throw new Error(`Icon set "${name}" is not registered`);
    }
    this.activeSet = name;
  }

  /**
   * Get an icon from the active set
   */
  public getIcon(name: string): string {
    const set = this.iconSets.get(this.activeSet);
    if (!set) {
      throw new Error('No active icon set');
    }

    const icon = set.icons[name];
    if (!icon) {
      // Fallback to default set if icon doesn't exist in active set
      const defaultSet = this.iconSets.get('default');
      if (defaultSet && defaultSet.icons[name]) {
        return defaultSet.icons[name];
      }
      throw new Error(`Icon "${name}" not found in active set "${this.activeSet}" or default set`);
    }

    return icon;
  }

  /**
   * Create an icon element
   */
  public createIcon(name: string): HTMLElement {
    const container = document.createElement('span');
    container.className = 'modulator-icon';
    container.setAttribute('role', 'img');
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = this.getIcon(name);
    return container;
  }
}

// Default icon set
export const defaultIconSet: IconSet = {
  name: 'default',
  icons: {
    bold: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
      <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
    </svg>`,

    italic: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="19" y1="4" x2="10" y2="4"/>
      <line x1="14" y1="20" x2="5" y2="20"/>
      <line x1="15" y1="4" x2="9" y2="20"/>
    </svg>`,

    underline: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/>
      <line x1="4" y1="21" x2="20" y2="21"/>
    </svg>`,

    strike: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17.3 5H6.7a1 1 0 0 0-.8 1.6L9 12"/>
      <path d="M13 19l4.3-5.4a1 1 0 0 0-.8-1.6H6.7"/>
      <line x1="4" y1="12" x2="20" y2="12"/>
    </svg>`,

    code: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>`,

    link: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>`,

    delete: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>`,

    moveUp: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="19" x2="12" y2="5"/>
      <polyline points="5 12 12 5 19 12"/>
    </svg>`,

    moveDown: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <polyline points="19 12 12 19 5 12"/>
    </svg>`,

    heading: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 4v16"/>
      <path d="M18 4v16"/>
      <path d="M6 12h12"/>
    </svg>`,

    list: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </svg>`,

    more: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="1"/>
      <circle cx="19" cy="12" r="1"/>
      <circle cx="5" cy="12" r="1"/>
    </svg>`,
  },
};

// Create and export a singleton instance
export const iconRegistry = new IconRegistry();
