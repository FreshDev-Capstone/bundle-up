/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static startTimer(label: string): void {
    this.timers.set(label, Date.now());
    console.log(`⏱️  Started: ${label}`);
  }

  static endTimer(label: string): number {
    const start = this.timers.get(label);
    if (!start) {
      console.warn(`⚠️  Timer "${label}" was not started`);
      return 0;
    }

    const duration = Date.now() - start;
    this.timers.delete(label);
    console.log(`⏱️  Completed: ${label} in ${duration}ms`);
    return duration;
  }

  static async measureAsync<T>(
    label: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.startTimer(label);
    try {
      const result = await fn();
      this.endTimer(label);
      return result;
    } catch (error) {
      this.endTimer(label);
      throw error;
    }
  }
}
