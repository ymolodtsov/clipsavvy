"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createReadwiseClient, type ReadwiseClient } from "./readwise";
import { getStoredToken, setStoredToken, clearStoredToken } from "./storage";
import type { Book, ExportResult, SourceCategory } from "@/types/readwise";

interface ReadwiseContextType {
  token: string | null;
  client: ReadwiseClient | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  books: Book[];
  exports: ExportResult[];
  selectedCategory: SourceCategory;
  setSelectedCategory: (category: SourceCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  login: (token: string) => Promise<boolean>;
  logout: () => void;
  refreshData: () => Promise<void>;
}

const ReadwiseContext = createContext<ReadwiseContextType | null>(null);

export function ReadwiseProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [client, setClient] = useState<ReadwiseClient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [exports, setExports] = useState<ExportResult[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SourceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const isAuthenticated = !!token && !!client;

  const refreshData = useCallback(async () => {
    if (!client) return;

    setIsLoading(true);
    setError(null);

    try {
      const [booksData, exportsData] = await Promise.all([
        client.getAllBooks(),
        client.getAllExports(),
      ]);
      setBooks(booksData);
      setExports(exportsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  const login = useCallback(async (newToken: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const newClient = createReadwiseClient(newToken);
    const isValid = await newClient.validateToken();

    if (isValid) {
      setToken(newToken);
      setClient(newClient);
      setStoredToken(newToken);
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
    clearStoredToken();
  }, []);

  useEffect(() => {
    const storedToken = getStoredToken();
    if (storedToken) {
      login(storedToken);
    } else {
      setIsLoading(false);
    }
  }, [login]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshData();
    }
  }, [isAuthenticated, refreshData]);

  return (
    <ReadwiseContext.Provider
      value={{
        token,
        client,
        isAuthenticated,
        isLoading,
        error,
        books,
        exports,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        login,
        logout,
        refreshData,
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
