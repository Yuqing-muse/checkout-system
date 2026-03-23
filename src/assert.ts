export function assert(condition: boolean, error: Error): void {
  if (!condition) throw error;
}
