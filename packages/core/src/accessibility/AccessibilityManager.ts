import {
  BlockData,
  AccessibilityContext,
  AccessibilityConfig,
  AccessibilityLevel,
  LocaleConfig,
  Translator,
  BlockRenderOptions,
  BlockEvent,
} from '@modulator/types';
import { EventEmitter } from '../events/EventEmitter.js';
import { Block } from '../blocks/Block.js';
import { BaseRenderer } from '../rendering/renderer.js';

/**
 * Manages accessibility features according to WCAG guidelines
 */
export class AccessibilityManager<T extends BlockData = BlockData> implements AccessibilityContext {
  private eventEmitter: EventEmitter;
  public config: AccessibilityConfig;
  private translator: Translator;
  private locales: Map<string, LocaleConfig>;
  private renderer: BaseRenderer;

  // Required by AccessibilityContext
  public locale!: LocaleConfig;

  constructor(
    renderer: BaseRenderer,
    initialConfig: Partial<AccessibilityConfig> = {},
    initialLocale: LocaleConfig = {
      language: 'en-US',
      translations: {},
    }
  ) {
    this.eventEmitter = new EventEmitter();
    this.locales = new Map();
    this.renderer = renderer;

    this.config = {
      level: initialConfig.level ?? AccessibilityLevel.AA, // Default to WCAG Level AA
      keyboardNavigation: initialConfig.keyboardNavigation ?? true, // WCAG 2.1.1
      screenReader: initialConfig.screenReader ?? true, // WCAG 1.3.1
      highContrast: initialConfig.highContrast ?? false, // WCAG 1.4.6 (AAA)
      locale: initialLocale.language, // WCAG 3.1.1
      textResize: initialConfig.textResize ?? true, // WCAG 1.4.4
      focusIndicators: initialConfig.focusIndicators ?? true, // WCAG 2.4.7
      ...initialConfig,
    };

    this.locale = initialLocale;
    this.translator = this.createTranslator();
    this.addLocale(initialLocale);

    // Enforce WCAG requirements based on selected level
    this.enforceWCAGRequirements();
  }

  /**
   * Enhance block accessibility
   */
  enhanceBlockAccessibility(block: Block<T>): void {
    const element = this.renderer.render(block, {
      attributes: {
        role: 'region',
        'aria-label': this.createBlockLabel(block, block.type),
        tabindex: this.config.keyboardNavigation ? '0' : undefined,
      },
    } as BlockRenderOptions);

    // Emit accessibility enhancement event
    this.eventEmitter.emit<BlockEvent>({
      type: 'block:updated',
      blockId: block.id,
      data: {
        accessibilityEnhanced: true,
        blockData: block.data,
      },
    });
  }

  /**
   * Update accessibility configuration
   */
  updateConfig(config: Partial<AccessibilityConfig>): void {
    this.config = { ...this.config, ...config };
    this.enforceWCAGRequirements();
    this.eventEmitter.emit<BlockEvent>({
      type: 'accessibility:updated',
      blockId: '',
      data: { config: this.config },
    });
  }

  /**
   * Get current accessibility configuration
   */
  getConfig(): AccessibilityConfig {
    return { ...this.config };
  }

  /**
   * Add locale configuration
   */
  addLocale(config: LocaleConfig): void {
    this.locales.set(config.language, config);
  }

  /**
   * Set current locale
   */
  setLocale(locale: string): void {
    if (!this.locales.has(locale)) {
      throw new Error(`Locale '${locale}' not found`);
    }
    this.config.locale = locale;
    this.translator.setLocale(locale);
  }

  /**
   * Get translation for key
   */
  translate(key: string, params?: Record<string, string>): string {
    return this.translator.translate(key, params);
  }

  /**
   * Create block ARIA label
   * Required for WCAG 2.1 Level A (1.3.1)
   */
  private createBlockLabel(block: Block<T>, type: string): string {
    return this.translate('block.label', {
      type,
      id: block.id,
    });
  }

  /**
   * Enforce WCAG requirements based on selected level
   */
  private enforceWCAGRequirements(): void {
    switch (this.config.level) {
      case AccessibilityLevel.AAA:
        this.config.highContrast = true;
      // Fall through to apply AA and A requirements
      case AccessibilityLevel.AA:
        this.config.textResize = true;
        this.config.focusIndicators = true;
      // Fall through to apply A requirements
      case AccessibilityLevel.A:
        this.config.keyboardNavigation = true;
        this.config.screenReader = true;
        break;
    }
  }

  /**
   * Create translator instance
   */
  private createTranslator(): Translator {
    return {
      translate: (key: string, params?: Record<string, string>): string => {
        const locale = this.locales.get(this.config.locale);
        if (!locale) return key;

        let translation = locale.translations[key] || key;
        if (params) {
          Object.entries(params).forEach(([param, value]) => {
            translation = translation.replace(`{${param}}`, value);
          });
        }
        return translation;
      },
      setLocale: (locale: string): void => {
        if (this.locales.has(locale)) {
          this.config.locale = locale;
        }
      },
      addTranslations: (locale: string, translations: Record<string, string>): void => {
        const config = this.locales.get(locale);
        if (config) {
          config.translations = { ...config.translations, ...translations };
        }
      },
    };
  }
}
