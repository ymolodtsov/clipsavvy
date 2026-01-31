import type { ExportResult } from "@/types/readwise";

const TOKEN_KEY = "readwise_token";
const EXPORTS_KEY = "readwise_exports";
const LAST_SYNCED_KEY = "readwise_last_synced";

// Token management
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

// Exports cache management
export function getStoredExports(): ExportResult[] | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(EXPORTS_KEY);
    if (!data) return null;
    return JSON.parse(data) as ExportResult[];
  } catch (err) {
    console.warn("Failed to parse cached exports:", err);
    return null;
  }
}

export function setStoredExports(exports: ExportResult[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    const data = JSON.stringify(exports);
    localStorage.setItem(EXPORTS_KEY, data);
    return true;
  } catch (err) {
    // localStorage quota exceeded - common with large datasets
    console.warn("Failed to cache exports (quota exceeded?):", err);
    return false;
  }
}

export function clearStoredExports(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(EXPORTS_KEY);
}

// Sync timestamp management
export function getLastSyncedAt(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_SYNCED_KEY);
}

export function setLastSyncedAt(timestamp: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_SYNCED_KEY, timestamp);
}

export function clearLastSyncedAt(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LAST_SYNCED_KEY);
}

// Clear all cached data (on logout)
export function clearAllStorage(): void {
  clearStoredToken();
  clearStoredExports();
  clearLastSyncedAt();
}

// Merge updated exports with existing cache
// - Updates existing sources by user_book_id
// - Adds new sources
// - Merges highlights within each source
export function mergeExports(
  existing: ExportResult[],
  updates: ExportResult[]
): ExportResult[] {
  const existingMap = new Map<number, ExportResult>();

  // Index existing exports by user_book_id
  for (const exp of existing) {
    existingMap.set(exp.user_book_id, exp);
  }

  // Merge updates
  for (const update of updates) {
    const existingSource = existingMap.get(update.user_book_id);

    if (existingSource) {
      // Merge highlights for existing source
      const highlightMap = new Map<number, typeof update.highlights[0]>();

      // Index existing highlights
      for (const h of existingSource.highlights) {
        highlightMap.set(h.id, h);
      }

      // Apply updates (add new or replace existing)
      for (const h of update.highlights) {
        highlightMap.set(h.id, h);
      }

      // Update the source with merged highlights and updated metadata
      existingMap.set(update.user_book_id, {
        ...update,
        highlights: Array.from(highlightMap.values()),
      });
    } else {
      // New source - add it
      existingMap.set(update.user_book_id, update);
    }
  }

  return Array.from(existingMap.values());
}

// Remove deleted highlights from cache
export function removeDeletedHighlights(
  exports: ExportResult[],
  deletedHighlightIds: Set<number>
): ExportResult[] {
  return exports.map((source) => ({
    ...source,
    highlights: source.highlights.filter((h) => !deletedHighlightIds.has(h.id)),
  })).filter((source) => source.highlights.length > 0);
}
