"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { createReadwiseClient, type ReadwiseClient } from "./readwise";
import {
  getStoredToken,
  setStoredToken,
  clearAllStorage,
  getStoredExports,
  setStoredExports,
  getLastSyncedAt,
  setLastSyncedAt,
  mergeExports,
} from "./storage";
import type { Book, ExportResult, SourceCategory } from "@/types/readwise";

type ViewMode = "random" | "favorites" | "sources" | "add";

interface ReadwiseContextType {
  token: string | null;
  client: ReadwiseClient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  error: string | null;
  books: Book[];
  exports: ExportResult[];
  selectedCategory: SourceCategory;
  setSelectedCategory: (category: SourceCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  refreshData: (forceFullSync?: boolean) => Promise<void>;
  updateHighlight: (id: number, updates: { note?: string; text?: string }) => Promise<void>;
  deleteHighlight: (id: number) => Promise<void>;
  createHighlight: (highlight: {
    text: string;
    title?: string;
    author?: string;
    source_url?: string;
    category?: "books" | "articles" | "tweets" | "podcasts" | "supplementals";
    note?: string;
  }) => Promise<boolean>;
}

const ReadwiseContext = createContext<ReadwiseContextType | null>(null);

export function ReadwiseProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [client, setClient] = useState<ReadwiseClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAtState] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [exports, setExports] = useState<ExportResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SourceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("random");

  // Track if initial load from cache has happened
  const hasLoadedCache = useRef(false);
  // Ref to avoid stale closure on exports in refreshData
  const exportsRef = useRef(exports);
  exportsRef.current = exports;

  const isAuthenticated = !!token && !!client;

  // Sync data - supports incremental sync via updatedAfter
  const refreshData = useCallback(async (forceFullSync = false) => {
    if (!client) return;

    const currentExports = exportsRef.current;
    const cachedLastSynced = getLastSyncedAt();
    const isIncrementalSync = !forceFullSync && cachedLastSynced && currentExports.length > 0;

    // Use isSyncing for background sync, isLoading for initial load
    if (isIncrementalSync) {
      setIsSyncing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Record sync start time before fetching
      const syncStartTime = new Date().toISOString();

      // Fetch data - use updatedAfter for incremental sync
      const [booksData, exportsData] = await Promise.all([
        client.getAllBooks(),
        client.getAllExports(isIncrementalSync ? cachedLastSynced : undefined),
      ]);

      setBooks(booksData);

      // Merge or replace exports
      let finalExports: ExportResult[];
      if (isIncrementalSync && exportsData.length > 0) {
        // Merge new/updated exports with existing
        finalExports = mergeExports(currentExports, exportsData);
        console.log(`Incremental sync: merged ${exportsData.length} updated sources`);
      } else if (isIncrementalSync && exportsData.length === 0) {
        // No updates - keep existing
        finalExports = currentExports;
        console.log("Incremental sync: no updates");
      } else {
        // Full sync - replace all
        finalExports = exportsData;
        console.log(`Full sync: loaded ${exportsData.length} sources`);
      }

      setExports(finalExports);

      // Update cache and sync timestamp
      const cacheSuccess = setStoredExports(finalExports);
      if (!cacheSuccess) {
        console.warn("Could not cache exports - data may be too large for localStorage");
      }
      setLastSyncedAt(syncStartTime);
      setLastSyncedAtState(syncStartTime);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch data";
      setError(errorMessage);
      console.error("Sync failed:", errorMessage);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [client]);

  const updateHighlight = useCallback(async (id: number, updates: { note?: string; text?: string }) => {
    if (!client) return;

    await client.updateHighlight(id, updates);

    // Optimistically update local state
    setExports((prev) => {
      const updated = prev.map((source) => ({
        ...source,
        highlights: source.highlights.map((h) =>
          h.id === id ? { ...h, ...updates } : h
        ),
      }));
      // Update cache
      setStoredExports(updated);
      return updated;
    });
  }, [client]);

  const deleteHighlight = useCallback(async (id: number) => {
    if (!client) return;

    await client.deleteHighlight(id);

    // Remove from local state and filter out empty sources
    setExports((prev) => {
      const updated = prev
        .map((source) => ({
          ...source,
          highlights: source.highlights.filter((h) => h.id !== id),
        }))
        .filter((source) => source.highlights.length > 0);
      // Update cache
      setStoredExports(updated);
      return updated;
    });
  }, [client]);

  const createHighlight = useCallback(async (highlight: {
    text: string;
    title?: string;
    author?: string;
    source_url?: string;
    category?: "books" | "articles" | "tweets" | "podcasts" | "supplementals";
    note?: string;
  }): Promise<boolean> => {
    if (!client) return false;

    try {
      await client.createHighlight({
        ...highlight,
        highlighted_at: new Date().toISOString(),
      });
      // Refresh data to get the new highlight
      await refreshData(false);
      return true;
    } catch (err) {
      console.error("Failed to create highlight:", err);
      return false;
    }
  }, [client, refreshData]);

  const login = useCallback(async (newToken: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const newClient = createReadwiseClient(newToken);
    const isValid = await newClient.validateToken();

    if (isValid) {
      setToken(newToken);
      setClient(newClient);
      setStoredToken(newToken);

      // Load cached data immediately if available
      const cachedExports = getStoredExports();
      const cachedLastSynced = getLastSyncedAt();
      if (cachedExports && cachedExports.length > 0) {
        setExports(cachedExports);
        setLastSyncedAtState(cachedLastSynced);
        hasLoadedCache.current = true;
        console.log(`Loaded ${cachedExports.length} sources from cache`);
      }

      setIsLoading(false);
      return true;
    } else {
      setError("Invalid API token");
      setIsLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setClient(null);
    setBooks([]);
    setExports([]);
    setLastSyncedAtState(null);
    hasLoadedCache.current = false;
    clearAllStorage();
  }, []);

  // Initialize from stored token on mount
  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      login(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [login]);

  // Sync data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // If we have cached data, do an incremental sync in the background
      // Otherwise, do a full sync
      refreshData(false);
    }
  }, [isAuthenticated, refreshData]);

  return (
    <ReadwiseContext.Provider
      value={{
        token,
        client,
        isAuthenticated,
        isLoading,
        isSyncing,
        lastSyncedAt,
        error,
        books,
        exports,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        login,
        logout,
        refreshData,
        updateHighlight,
        deleteHighlight,
        createHighlight,
      }}
    >
      {children}
    </ReadwiseContext.Provider>
  );
}

export function useReadwise() {
  const context = useContext(ReadwiseContext);
  if (!context) {
    throw new Error("useReadwise must be used within a ReadwiseProvider");
  }
  return context;
}
