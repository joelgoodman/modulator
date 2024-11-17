/**
 * Mock storage for testing
 */
export class MockStorage implements Storage {
  private data: Map<string, string>;
  private errorRate: number;
  private latency: number;

  constructor(options: { errorRate?: number; latency?: number } = {}) {
    this.data = new Map();
    this.errorRate = options.errorRate || 0;
    this.latency = options.latency || 0;
  }

  get length(): number {
    return this.data.size;
  }

  key(index: number): string | null {
    return Array.from(this.data.keys())[index] || null;
  }

  private async simulateLatency(): Promise<void> {
    if (this.latency > 0) {
      await new Promise(resolve => setTimeout(resolve, this.latency));
    }
  }

  private simulateError(): void {
    if (Math.random() < this.errorRate) {
      throw new Error('Simulated storage error');
    }
  }

  getItem(key: string): string | null {
    this.simulateError();
    return this.data.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.simulateError();
    this.data.set(key, value);
  }

  removeItem(key: string): void {
    this.simulateError();
    this.data.delete(key);
  }

  clear(): void {
    this.simulateError();
    this.data.clear();
  }
}
