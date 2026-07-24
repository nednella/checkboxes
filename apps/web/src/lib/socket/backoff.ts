const MAX_RECONNECT_DELAY_MS = 60_000;

/**
 * Exponential backoff for reconnect attempts.
 *
 * Each attempt waits twice as long as the previous one, capped at
 * `MAX_RECONNECT_DELAY_MS` ms.
 *
 * @param attempt zero-based retry index
 */
export function exponentialBackoff(attempt: number, baseMs: number): number {
  return Math.min(baseMs * 2 ** attempt, MAX_RECONNECT_DELAY_MS);
}
