import * as fs from 'node:fs';
import * as path from 'node:path';
import { parse } from 'yaml';
import { Theme, ModulatorConfig } from '@modulator/types';

/**
 * Configuration loader
 */
export class ConfigLoader {
  private config: ModulatorConfig;
  private configPath: string;

  constructor(configPath: string) {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  /**
   * Get current configuration
   */
  getConfig(): ModulatorConfig {
    return { ...this.config };
  }

  /**
   * Load configuration from file
   */
  private loadConfig(): ModulatorConfig {
    if (!fs.existsSync(this.configPath)) {
      return this.getDefaultConfig();
    }

    const ext = path.extname(this.configPath);
    const content = fs.readFileSync(this.configPath, 'utf-8');

    try {
      let config: ModulatorConfig;
      if (ext === '.json') {
        config = JSON.parse(content);
      } else if (ext === '.yaml' || ext === '.yml') {
        config = parse(content);
      } else {
        throw new Error(`Unsupported config file type: ${ext}`);
      }

      return {
        ...this.getDefaultConfig(),
        ...config,
      };
    } catch (error) {
      console.error('Error loading config:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Get default configuration
   */
  private getDefaultConfig(): ModulatorConfig {
    return {
      theme: 'light' as Theme,
      debug: false,
      blocks: {
        custom: [],
      },
      security: {
        sanitization: {
          allowedTags: ['p', 'strong', 'em', 'u', 'a'],
          stripScripts: true,
        },
      },
      accessibility: {
        screenReader: true,
        keyboardNavigation: true,
        locale: 'en-US',
      },
      performance: {
        monitoring: false,
        lazyLoad: true,
        virtualize: true,
      },
    };
  }
}
