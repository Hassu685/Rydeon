import Trip from "@/models/Trip";

/**
 * Generates a human-friendly trip code like "TRP-8823".
 *
 * The previous approach (`TRP-${8800 + count + 1}`) is NOT safe under
 * concurrent requests: two trips created at nearly the same moment can both
 * read the same `count`, produce the same code, and the second insert then
 * fails on the unique index. This retries with a small random jitter on
 * collision, and falls back to a timestamp-based code if it still can't
 * find a free one (astronomically unlikely, but handled anyway).
 */
export async function generateUniqueTripCode(attempts = 5) {
  const baseCount = await Trip.countDocuments();

  for (let i = 0; i < attempts; i++) {
    const jitter = i === 0 ? 0 : Math.floor(Math.random() * 500);
    const code = `TRP-${8800 + baseCount + 1 + jitter}`;
    const exists = await Trip.exists({ tripCode: code });
    if (!exists) return code;
  }

  // Extremely unlikely fallback: still unique, still readable.
  return `TRP-${Date.now().toString().slice(-6)}`;
}
