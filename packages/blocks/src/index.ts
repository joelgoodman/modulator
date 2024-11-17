export * from './text/TextBlock.js';
export * from './heading/HeadingBlock.js';
export * from './list/ListBlock.js';

import { BlockRegistry } from '@modulator/core';
import { TextBlock } from './text/TextBlock.js';
import { HeadingBlock } from './heading/HeadingBlock.js';
import { ListBlock } from './list/ListBlock.js';

export function registerDefaultBlocks(registry: BlockRegistry): void {
  registry.register(TextBlock);
  registry.register(HeadingBlock);
  registry.register(ListBlock);
}
