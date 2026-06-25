/**
 * Exponential backoff for reconnect attempts.
 *
 * Each attempt waits twice as long as the previous one, capped at `60_000` ms.
 *
 * @param attempt zero-based retry index
 */
export function exponentialBackoff(attempt: number, baseMs: number): number {
  return Math.min(baseMs * 2 ** attempt, 60_000);
}
