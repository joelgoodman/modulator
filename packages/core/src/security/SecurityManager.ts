import { Block } from '../blocks/Block.js';
import { BlockData } from '@modulator/types';
import { EventEmitter } from '../events/EventEmitter.js';

/**
 * Sanitization configuration
 */
export interface SanitizationConfig {
  /**
   * Allowed HTML tags
   */
  allowedTags: string[];

  /**
   * Allowed HTML attributes
   */
  allowedAttributes: Record<string, string[]>;

  /**
   * Allowed URL protocols
   */
  allowedProtocols: string[];

  /**
   * Remove unknown tags
   */
  stripUnknown: boolean;

  /**
   * Remove all scripts
   */
  stripScripts: boolean;

  /**
   * Maximum length for attribute values
   */
  maxAttributeLength: number;

  /**
   * Maximum length for text content
   */
  maxTextLength: number;
}

/**
 * Security validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitized?: unknown;
}

/**
 * Manages content security and sanitization
 */
export class SecurityManager {
  private config: SanitizationConfig;
  private eventEmitter: EventEmitter;
  private urlRegex: RegExp;
  private scriptRegex: RegExp;

  constructor(config: Partial<SanitizationConfig> = {}) {
    this.eventEmitter = new EventEmitter();

    this.config = {
      allowedTags: ['p', 'strong', 'em', 'u', 'a', 'h1', 'h2', 'h3', 'ul', 'ol', 'li'],
      allowedAttributes: {
        a: ['href', 'title', 'target'],
        img: ['src', 'alt', 'title'],
      },
      allowedProtocols: ['http:', 'https:', 'mailto:', 'tel:'],
      stripUnknown: true,
      stripScripts: true,
      maxAttributeLength: 1000,
      maxTextLength: 10000,
      ...config,
    };

    this.urlRegex = /^(https?|mailto|tel):/i;
    this.scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
  }

  /**
   * Validate and sanitize block data
   */
  validateBlock<T extends BlockData>(block: T): ValidationResult {
    const errors: string[] = [];
    let sanitized = { ...block };

    // Check content length
    if (typeof block.content === 'string' && block.content.length > this.config.maxTextLength) {
      errors.push(`Content exceeds maximum length of ${this.config.maxTextLength} characters`);
      sanitized.content = block.content.slice(0, this.config.maxTextLength);
    }

    // Sanitize HTML content
    if (typeof block.content === 'string' && this.containsHTML(block.content)) {
      const sanitizeResult = this.sanitizeHTML(block.content);
      if (!sanitizeResult.isValid) {
        errors.push(...sanitizeResult.errors);
      }
      if (sanitizeResult.sanitized) {
        sanitized.content = sanitizeResult.sanitized;
      }
    }

    // Validate URLs
    if (block.type === 'link' && typeof block.url === 'string') {
      const urlValidation = this.validateURL(block.url);
      if (!urlValidation.isValid) {
        errors.push(...urlValidation.errors);
        delete (sanitized as any).url;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: errors.length > 0 ? sanitized : undefined,
    };
  }

  /**
   * Update security configuration
   */
  updateConfig(config: Partial<SanitizationConfig>): void {
    this.config = {
      ...this.config,
      ...config,
      allowedAttributes: {
        ...this.config.allowedAttributes,
        ...config.allowedAttributes,
      },
    };

    this.emitConfigUpdate();
  }

  /**
   * Sanitize HTML content
   */
  private sanitizeHTML(content: string): ValidationResult {
    const errors: string[] = [];
    let sanitized = content;

    // Remove scripts if configured
    if (this.config.stripScripts) {
      sanitized = sanitized.replace(this.scriptRegex, '');
    }

    // Basic HTML sanitization (in a real implementation, use a proper HTML sanitizer)
    const doc = new DOMParser().parseFromString(sanitized, 'text/html');
    const elements = doc.getElementsByTagName('*');

    for (const element of Array.from(elements)) {
      // Check tag
      if (!this.config.allowedTags.includes(element.tagName.toLowerCase())) {
        if (this.config.stripUnknown) {
          element.remove();
        }
        errors.push(`Disallowed HTML tag: ${element.tagName}`);
        continue;
      }

      // Check attributes
      const allowedAttrs = this.config.allowedAttributes[element.tagName.toLowerCase()] || [];
      for (const attr of Array.from(element.attributes)) {
        if (!allowedAttrs.includes(attr.name)) {
          element.removeAttribute(attr.name);
          errors.push(`Disallowed attribute: ${attr.name} on ${element.tagName}`);
          continue;
        }

        // Check attribute length
        if (attr.value.length > this.config.maxAttributeLength) {
          element.setAttribute(attr.name, attr.value.slice(0, this.config.maxAttributeLength));
          errors.push(`Attribute ${attr.name} exceeds maximum length`);
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitized: doc.body.innerHTML,
    };
  }

  /**
   * Validate URL
   */
  private validateURL(url: string): ValidationResult {
    const errors: string[] = [];

    try {
      const parsed = new URL(url);
      if (!this.config.allowedProtocols.includes(parsed.protocol)) {
        errors.push(`Disallowed protocol: ${parsed.protocol}`);
      }
    } catch {
      errors.push('Invalid URL format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if content contains HTML
   */
  private containsHTML(content: string): boolean {
    return /<[a-z][\s\S]*>/i.test(content);
  }

  /**
   * Emit configuration update event
   */
  private emitConfigUpdate(): void {
    this.eventEmitter.emit({
      type: 'block:updated',
      blockId: '',
      data: { securityConfigUpdated: true },
    });
  }
}
