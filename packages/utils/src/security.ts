import type {
  SanitizationOptions,
  ValidationResult,
  ValidationOptions,
  SecurityPolicy,
  SecurityService,
} from '@modulator/types';

export class SecurityManager implements SecurityService {
  config: SanitizationOptions = {
    allowedTags: ['p', 'br', 'strong', 'em'],
    allowedAttributes: {
      a: ['href', 'target'],
      img: ['src', 'alt'],
    },
    allowedProtocols: ['http', 'https'],
    removeUnknown: true,
    stripComments: true,
  };

  private policy: SecurityPolicy = {
    csp: "default-src 'self'; img-src 'self' https:; script-src 'self'",
    allowedOrigins: ['https://modulator.dev'],
    allowedFileTypes: ['text/plain', 'text/html', 'image/jpeg', 'image/png'],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    rateLimit: {
      maxRequests: 100,
      windowMs: 60000, // 1 minute
    },
  };

  updateConfig(config: Partial<SanitizationOptions>): void {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  validate(content: unknown, options?: ValidationOptions): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const opts = {
      allowHTML: false,
      allowExternalUrls: false,
      maxLength: 10000,
      ...options,
    };

    // Type validation
    if (typeof content !== 'string') {
      errors.push('Content must be a string');
      return { isValid: false, errors };
    }

    // Length validation
    if (opts.maxLength && content.length > opts.maxLength) {
      errors.push(`Content exceeds maximum length of ${opts.maxLength} characters`);
    }

    // HTML validation
    if (!opts.allowHTML && /<[^>]+>/g.test(content)) {
      errors.push('HTML content is not allowed');
    }

    // External URL validation
    if (!opts.allowExternalUrls) {
      const urlRegex = /https?:\/\/(?!modulator\.dev)[^\s"']+/g;
      if (urlRegex.test(content)) {
        errors.push('External URLs are not allowed');
      }
    }

    // Pattern validation
    if (opts.pattern && !opts.pattern.test(content)) {
      errors.push('Content does not match required pattern');
    }

    // Custom validation
    if (opts.validate && !opts.validate(content)) {
      errors.push('Content failed custom validation');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }

  sanitizeHTML(content: string): string {
    if (!this.config.allowedTags || this.config.allowedTags.length === 0) {
      return content.replace(/<[^>]+>/g, '');
    }

    const allowedTagsRegex = this.config.allowedTags.join('|');
    const allowedTagsPattern = new RegExp(`<(?!\/?(?:${allowedTagsRegex})\b)[^>]+>`, 'gi');

    let result = content.replace(allowedTagsPattern, '');

    // Remove disallowed attributes
    this.config.allowedTags.forEach(tag => {
      const allowedAttrs = this.config.allowedAttributes?.[tag] || [];
      const tagRegex = new RegExp(`<${tag}\\s+[^>]*>`, 'gi');
      result = result.replace(tagRegex, match => {
        return match.replace(
          /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/gi,
          (attr, name, value) => {
            return allowedAttrs.includes(name) ? attr : '';
          }
        );
      });
    });

    if (this.config.stripComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, '');
    }

    return result;
  }

  validateURL(url: string): ValidationResult {
    const errors: string[] = [];

    try {
      const parsed = new URL(url);
      const protocol = parsed.protocol.replace(':', '');

      if (!this.config.allowedProtocols?.includes(protocol)) {
        errors.push(`Protocol '${protocol}' is not allowed`);
      }

      if (!this.policy.allowedOrigins?.includes(parsed.origin)) {
        errors.push(`Origin '${parsed.origin}' is not allowed`);
      }
    } catch (e) {
      errors.push('Invalid URL format');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
